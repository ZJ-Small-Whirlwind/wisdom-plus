import { defineComponent, ExtractPropTypes, PropType, computed, ref, Transition, watch, nextTick } from 'vue'
import { buildProps } from '@wisdom-plus/utils/props'

import Overlay, { OverlayProps } from '../../Overlay'

export const modalProps = buildProps({
    overlay: {
        type: Object as PropType<OverlayProps>,
        default: () => ({})
    },
    modelValue: {
        type: Boolean,
        default: undefined
    },
    transitionName: {
        type: String,
        default: 'wp-modal-fade'
    },
    width: {
        type: [String, Number] as PropType<string | number>
    }
})

export type ModalProps = ExtractPropTypes<typeof modalProps>

export default defineComponent({
    name: 'WpModal',
    inheritAttrs: false,
    props: {
        ...modalProps
    },
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean'
    },
    setup(props, { emit, attrs, slots }) {
        const showRef = ref(false)
        const show = computed<boolean>({
            get: () => {
                if (typeof props.modelValue === 'undefined') {
                    return showRef.value
                } else {
                    return props.modelValue
                }
            },
            set: (value) => {
                if (typeof props.modelValue === 'undefined') {
                    showRef.value = value
                } else {
                    emit('update:modelValue', value)
                }
            }
        })
        const showBox = ref(false)
        watch(show, () => {
            nextTick(() => {
                showBox.value = show.value
            })
        }, {
            immediate: true
        })
        return () => (
            <Overlay {...props.overlay} vModel={show.value} class="wp-modal__overlay" transitionName='wp-modal-fade'>
                <Transition name={props.transitionName}>
                    {
                        showBox.value ? (
                            <div class="wp-modal" style={{
                                display: !show.value ? 'none' : '',
                                width: typeof props.width === 'string' ? props.width : `${props.width}px`
                            }} onClick={e => e.stopPropagation()} {...attrs}>
                                { slots.default?.() }
                            </div>
                        ) : null
                    }
                </Transition>
            </Overlay>
        )
    }
})