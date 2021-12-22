import { defineComponent, ExtractPropTypes, PropType, computed, ref, Transition, watch, nextTick, CSSProperties } from 'vue'
import { buildProps } from '@wisdom-plus/utils/props'

import Overlay, { OverlayProps } from '../../Overlay'
import Icon from '../../Icon'
import { CloseOutlined } from '@vicons/antd'

import { closeAll } from './utils'

export const modalProps = buildProps({
    overlay: {
        type: Object as PropType<Partial<OverlayProps>>,
        default: () => ({})
    },
    modelValue: {
        type: Boolean,
        default: undefined
    },
    transitionName: {
        type: String
    },
    width: {
        type: [String, Number] as PropType<string | number>
    },
    showClose: {
        type: Boolean,
        default: true
    },
    title: {
        type: String
    },
    border: {
        type: Boolean,
        default: true
    },
    doNotCloseMe: {
        type: Boolean,
        default: false
    },
    borderRadius: {
        type: [Boolean, Number],
        default: true
    },
    type: {
        type: String as PropType<'dialog' | 'drawer'>,
        default: 'dialog'
    },
    from: {
        type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
        default: 'bottom'
    }
})

export type ModalProps = ExtractPropTypes<typeof modalProps>

export default defineComponent({
    name: 'WpModal',
    inheritAttrs: false,
    props: modalProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean',
        open: null,
        close: null,
        afterClose: null,
        afterOpen: null
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
        const showOverlay = ref(false)
        const showBox = ref(false)
        let neverMeet = true
        watch(show, () => {
            if (show.value) {
                showOverlay.value = show.value
                nextTick(() => {
                    showBox.value = show.value
                    emit('open')
                    neverMeet = false
                })
            } else {
                showBox.value = show.value
                nextTick(() => {
                    showOverlay.value = show.value
                    if (!neverMeet) {
                        emit('close')
                    } else {
                        neverMeet = false
                    }
                })
            }
        }, {
            immediate: true
        })
        watch(closeAll, () => {
            if (closeAll.value && !props.doNotCloseMe) {
                show.value = false
            }
        })
        return () => (
            <Overlay {...props.overlay} modelValue={showOverlay.value} onUpdate:modelValue={(value) => { show.value = value }} class={{
                'wp-modal__overlay': true,
                [`wp-modal__overlay-${props.from}`]: props.type === 'drawer'
            }}>
                <Transition name={props.transitionName || (props.type === 'drawer' ? `wp-modal-${props.from}` : 'wp-modal-fade' )}>
                    {
                        showBox.value ? (
                            <div class={{
                                'wp-modal': true,
                                'wp-modal__no-border': !props.border,
                                'wp-modal__drawer': props.type === 'drawer',
                                [`wp-modal__drawer-${props.from}`]: props.type === 'drawer'
                            }} style={{
                                display: !showBox.value ? 'none' : '',
                                width: typeof props.width === 'string' ? props.width : `${props.width}px`,
                                '--wp-modal-border-radius': props.borderRadius === true ? '4px' : props.borderRadius === false ? 0 : props.borderRadius
                            } as CSSProperties} onClick={e => e.stopPropagation()} {...attrs}>
                                {
                                    slots.title || props.title || props.showClose ? (
                                        <div class="wp-modal__header">
                                            <div class="wp-modal__header-text">
                                                { slots.title?.() || props.title }
                                            </div>
                                            {
                                                props.showClose ? <span class="wp-modal__icon" onClick={() => {
                                                    show.value = false
                                                }}><Icon><CloseOutlined/></Icon></span> : null
                                            }
                                        </div>
                                    ) : null
                                }
                                <div class="wp-modal__content">
                                    { slots.default?.() }
                                </div>
                                {
                                    slots.footer ? (
                                        <div class="wp-modal__footer">
                                            { slots.footer?.() }
                                        </div>
                                    ) : null
                                }
                            </div>
                        ) : null
                    }
                </Transition>
            </Overlay>
        )
    }
})