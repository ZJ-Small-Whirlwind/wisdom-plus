import { defineComponent, computed, PropType, ExtractPropTypes, Component, h, VNode, ref } from 'vue'
import Modal, { modalProps } from '../../Modal'
import Button from '../../Button'
import Icon from '../../Icon'

import { buildProps } from '@wisdom-plus/utils/props'

export interface ActionSheetRecord {
    index?: string | number | symbol,
    title?: VNode | string,
    description?: VNode | string,
    click?: (record: ActionSheetRecord, done: () => void) => void,
    icon?: Component,
    disabled?: boolean
}

const actionSheetPropsRaw = buildProps({
    list: {
        type: Array as PropType<ActionSheetRecord[]>,
        default: () => []
    },
    showCancel: {
        type: Boolean,
        default: true
    },
    cancelText: {
        type: [String, Object] as PropType<string | VNode>,
        default: '取消'
    },
    description: {
        type: [String, Object] as PropType<string | VNode>
    },
    type: {
        type: String as PropType<'dialog' | 'drawer'>,
        default: 'drawer'
    },
    showClose: {
        type: Boolean,
        default: false
    },
    width: {
        type: [String, Number],
        default: 400
    },
    handler: {
        type: Boolean,
        default: true
    }
})


export const actionSheetProps = { ...modalProps, ...actionSheetPropsRaw }

export type ActionSheetProps = ExtractPropTypes<typeof actionSheetProps>

export default defineComponent({
    name: 'WpActionSheet',
    inheritAttrs: false,
    props: actionSheetProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean',
        'click': (record: ActionSheetRecord, done: () => void) => {
            void record
            void done
            return true
        }
    },
    setup(props, { attrs, emit, slots }) {
        const showRef = ref(false)
        const show = computed<boolean>({
            get() {
                if (typeof props.modelValue === 'undefined') {
                    return showRef.value
                }
                return props.modelValue
            },
            set(value) {
                if (typeof props.modelValue === 'undefined') {
                    showRef.value = value
                    return
                }
                emit('update:modelValue', value)
            }
        })
        const modalPropsMap = computed(() => {
            const propsBackup: Partial<ActionSheetProps> = { ...props }
            delete propsBackup.list
            delete propsBackup.showCancel
            delete propsBackup.cancelText
            delete propsBackup.description
            return propsBackup
        })
        // const deltaY = ref(0)
        // const transitionDuration = ref('')
        const actionSheetRef = ref<null | HTMLDivElement>(null)
        const handlerRender = (isTop = true) => (
            <div
                class="wp-action-sheet--hander"
                style={{
                    marginTop: isTop ? '' : '-10px',
                    marginBottom: isTop ? '-10px' : ''
                }}
            />
        )
        // transform: ( props.from === 'bottom' ? deltaY.value < 0 : deltaY.value > 0 ) ? `translateY(${deltaY.value}px)` : '',
        return () => (
            <Modal class="wp-modal-action-sheet" { ...modalPropsMap.value } v-model={show.value}>
                <div class="wp-action-sheet" ref={actionSheetRef} { ...attrs }>
                    {
                        modalPropsMap.value.from === 'bottom' && props.handler && handlerRender()
                    }
                    {
                        slots.description || props.description ? (
                            <div class="wp-action-sheet__cell wp-action-sheet--description">
                                { slots.description?.() || props.description }
                            </div>
                        ) : null
                    }
                    {
                        slots.default?.()
                    }
                    {
                        props.list.map(item => (
                            <div class={{
                                'wp-action-sheet__cell': true,
                                'wp-action-sheet__cell--disabled': item.disabled
                            }} onClick={() => {
                                if (item.disabled) return
                                const done = () => {
                                    show.value = false
                                }
                                if (!item.click?.(item, done)) {
                                    emit('click', item, done)
                                }
                            }}>
                                {
                                    slots.item?.(item) || (
                                        <div class="wp-action-sheet--content">
                                            <div class="wp-action-sheet--icon">
                                                <Icon>{ item.icon && h(item.icon) }</Icon>
                                            </div>
                                            <div class="wp-action-sheet--text">
                                                <div class="wp-action-sheet--title">
                                                    { item.title }
                                                </div>
                                                {
                                                    item.description ? (
                                                        <div class="wp-action-sheet--description">
                                                            { item.description }
                                                        </div>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    }
                    {
                        slots.cancel || props.showCancel ? (
                            <div class="wp-action-sheet__cell wp-action-sheet--cancel">
                                {
                                    slots.cancel?.() || (
                                        <Button size="large" round onClick={() => {
                                            show.value = false
                                        }}>{ props.cancelText }</Button>
                                    )
                                }
                            </div>
                        ) : null
                    }
                    {
                        modalPropsMap.value.from === 'top' && props.handler && handlerRender(false)
                    }
                </div>
            </Modal>
        )
    }
})