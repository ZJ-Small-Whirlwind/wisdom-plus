import { defineComponent, ExtractPropTypes, ref, computed, PropType } from "vue"

import Popover, { PopoverProps } from '../../Popover'
import Button from '../../Button'
import type { ButtonProps } from '../../Button/src/button'
import Space, { SpaceProps } from '../../Space'

import { buildProps } from '@wisdom-plus/utils/props'

export const popConfirmProps = buildProps({
    modelValue: {
        type: Boolean,
        default: undefined
    },
    popover: {
        type: Object as PropType<Partial<PopoverProps> & Record<string, any>>,
        default: () => ({})
    },
    confirmText: {
        type: String,
        default: '确认'
    },
    cancelText: {
        type: String,
        default: '取消'
    },
    confirmProps: {
        type: Object as PropType<Partial<ButtonProps> & Record<string, any>>,
        default: () => ({})
    },
    cancelProps: {
        type: Object as PropType<Partial<ButtonProps> & Record<string, any>>,
        default: () => ({})
    },
    spaceProps: {
        type: Object as PropType<Partial<SpaceProps> & Record<string, any>>,
        default: () => ({})
    },
    title: String,
    showFooter: {
        type: Boolean,
        default: true
    }
})

export type PopConfirmProps = ExtractPropTypes<typeof popConfirmProps>

export default defineComponent({
    name: 'WpPopConfirm',
    inheritAttrs: false,
    props: popConfirmProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean',
        'cancel': null,
        'confirm': null
    },
    setup(props, { slots, emit, attrs }) {
        const showRef = ref(false)
        const show = computed<boolean>({
            get() {
                return typeof props.modelValue === 'undefined' ? showRef.value : props.modelValue
            },
            set(value) {
                if (typeof props.modelValue === 'undefined') {
                    showRef.value = value
                } else {
                    emit('update:modelValue', value)
                }
            }
        })
        return () => (
            <Popover
                v-model={show.value}
                placement="bottom"
                width={240}
                v-slots={{
                    reference: () => slots.reference?.(),
                    default: () => (
                        <div class="wp-pop-confirm" { ...attrs }>
                            {
                                ( slots.title || props.title ) ? (
                                    <div class="wp-pop-confirm__title">
                                        { slots.title?.() || props.title }
                                    </div>
                                ) : null
                            }
                            <div class="wp-pop-confirm__content">
                                { slots.default?.() }
                            </div>
                            {
                                props.showFooter ? (
                                    slots.footer?.() || (
                                        <Space class="wp-pop-confirm__footer" justify="end" { ...props.spaceProps }>
                                            <Button size="small" onClick={() => {
                                                show.value = false
                                                emit('cancel')
                                            }} { ...props.cancelProps }>{ props.cancelText }</Button>
                                            <Button size="small" onClick={() => {
                                                show.value = false
                                                emit('confirm')
                                            }} type="primary" { ...props.confirmProps }>{ props.confirmText }</Button>
                                        </Space>
                                    )
                                ) : null
                            }
                        </div>
                    )
                }}
                { ...props.popover }
            />
        )
    }
})