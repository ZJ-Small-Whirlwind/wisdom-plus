import { defineComponent, ExtractPropTypes, PropType, watch, ref, Teleport, RendererElement, Transition, provide, inject } from 'vue'
import { buildProps } from '@wisdom-plus/utils/props'

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
        default: '#00000099'
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

const getMaxZIndex = () => {
    const elements = Array.from(document.querySelectorAll('*'))
    const arr = elements.map(e => +window.getComputedStyle(e).zIndex || 0);
    return arr.length ? Math.max(...arr) + 1 : 1
}

export default defineComponent({
    name: 'WpOverlay',
    inheritAttrs: false,
    props: overlayProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean'
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
        const isSubWpOverlay = inject<boolean>('wp-overlay', false)
        watch(() => props.modelValue, () => {
            getZIndex()
            if (!props.preventScroll || isSubWpOverlay || !props.to) return
            if (props.modelValue) {
                document.body.style.overflowY = 'hidden'
            } else {
                document.body.style.overflowY = ''
            }
        }, {
            immediate: true
        })
        return () => (
            <Teleport to={props.to || null} disabled={!props.to}>
                <Transition name={props.transitionName}>
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