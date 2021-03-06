import { defineComponent, ExtractPropTypes, PropType, watch, ref, Teleport, RendererElement, Transition, provide, inject } from 'vue'
import { buildProps } from '@wisdom-plus/utils/props'

import { getMaxZIndex } from '@wisdom-plus/utils/get-max-zindex'
import { activeOverlay } from './utils'

export const overlayProps = buildProps({
    modelValue: {
        type: Boolean,
        default: undefined
    },
    position: {
        type: String as PropType<'fixed' | 'absolute'>,
        default: 'fixed'
    },
    background: {
        type: String,
        default: 'rgba(0, 0, 0, .6)'
    },
    blur: {
        type: [Boolean, String] as PropType<boolean | string>,
        default: false
    },
    zIndex: Number,
    to: {
        type: [String, Object, Boolean] as PropType<string | RendererElement | false>,
        default: 'body'
    },
    clickToClose: {
        type: Boolean,
        default: true
    },
    useVShow: {
        type: Boolean,
        default: false
    },
    transitionName: {
        type: String,
        default: 'wp-overlay-fade'
    },
    preventScroll: {
        type: Boolean,
        default: true
    }
})

export type OverlayProps =  ExtractPropTypes<typeof overlayProps>

export default defineComponent({
    name: 'WpOverlay',
    inheritAttrs: false,
    props: overlayProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean',
        leave: () => true,
        enter: () => true
    },
    setup(props, { slots, emit, attrs }) {
        const zIndex = ref(1)
        const getZIndex = () => {
            if (props.modelValue && typeof props.zIndex === 'undefined') zIndex.value = getMaxZIndex()
        }
        /**
         * 处理 overlay 嵌套
         */
        provide('wp-overlay', true)
        const overlaySymbol = Symbol('wp-overlay')
        watch(() => props.modelValue, () => {
            getZIndex()
            if (!props.preventScroll || !props.to) {
                const index = activeOverlay.value.indexOf(overlaySymbol)
                if (index > -1) {
                    activeOverlay.value.splice(index, 1)
                }
                return
            }
            if (props.modelValue) {
                activeOverlay.value.push(overlaySymbol)
            } else {
                const index = activeOverlay.value.indexOf(overlaySymbol)
                if (index > -1) {
                    activeOverlay.value.splice(index, 1)
                }
            }
        }, {
            immediate: true
        })
        return () => (
            <Teleport to={props.to || null} disabled={!props.to}>
                <Transition name={props.transitionName} onEnter={() => emit('enter')} onLeave={() => emit('leave')}>
                    {
                        !props.useVShow && !props.modelValue ? null : (
                            <>
                                <div class="wp-overlay" style={{
                                    position: props.position,
                                    zIndex: typeof props.zIndex === 'undefined' ? zIndex.value : props.zIndex,
                                    background: props.background,
                                    backdropFilter: props.blur ? `blur(${typeof props.blur === 'boolean' ? '10px' : props.blur})` : '',
                                }} onClick={() => props.clickToClose && emit('update:modelValue', false)} v-show={!props.useVShow || props.modelValue} {...attrs}>
                                    { slots.default?.() }
                                </div>
                            </>
                        )
                    }
                </Transition>
            </Teleport>
        )
    }
})