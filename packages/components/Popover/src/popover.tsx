import { defineComponent, h, Transition, PropType, cloneVNode, mergeProps, ref, computed, createTextVNode, CSSProperties, watch, provide, inject } from 'vue'
import { VBinder, VTarget, VFollower } from 'vueuc'

import { definePropType, buildProps } from '@wisdom-plus/utils/props'

import type { ExtractPropTypes } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { closeAll } from './utils'

import { getMaxZIndex } from '@wisdom-plus/utils/get-max-zindex'
import { useAutoControl } from '@wisdom-plus/utils/use-control'

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'none'
export type PopoverPlacement = 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'
export const popoverProps = buildProps({
    modelValue: {
        type: Boolean,
        default: undefined
    },
    trigger: {
        type: String as PropType<PopoverTrigger>,
        default: 'click'
    },
    placement: {
        type: String as PropType<PopoverPlacement>,
        default: 'top'
    },
    arrow: {
        type: Boolean,
        default: true
    },
    zIndex: Number,
    raw: Boolean,
    to: {
        type: definePropType<string | HTMLElement | false>([String, Object, Boolean]),
        default: undefined
    },
    width: {
        type: [Number, String] as PropType<number | 'trigger' | 'target'>
    },
    flip: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        default: 100
    },
    dark: Boolean,
    transition: {
        type: String,
        default: 'popover-transition'
    },
    closeOnClickOutside: {
        type: Boolean,
        default: true
    },
    popoverClass: {
        type: [String, Object] as PropType<string | Record<string, boolean>>,
        default: ''
    },
    popoverStyle: {
        type: definePropType<CSSProperties | string>([Object, String]),
        default: '',
    },
    offset: {
        type: Array as PropType<number[]>
    },
    doNotCloseMe: Boolean,
    x: Number,
    y: Number,
    useVShow: Boolean
})

export type PopoverProps = ExtractPropTypes<typeof popoverProps>

export const popoverEmits = {
    'update:modelValue': (value: boolean) => typeof value === 'boolean'
}

export type PopoverEmits = typeof popoverEmits

const textVNodeType = createTextVNode('').type

export default defineComponent({
    name: 'WpPopover',
    inheritAttrs: false,
    props: popoverProps,
    setup(props, { slots, emit, attrs }) {
        /**
         * ???????????????
         */
        const popoverShow = ref(false)
        const zIndex = ref(0)
        const show = useAutoControl(popoverShow, props, 'modelValue', emit)
        watch(show, () => {
            if (show.value && !props.zIndex) {
                zIndex.value = getMaxZIndex()
            }
        })
        watch(closeAll, () => {
            if (closeAll.value && !props.doNotCloseMe) {
                show.value = false
            }
        })
        /**
         * ??????????????????????????????
         */
        const popoverRef = ref<HTMLDivElement | null>(null)
        const popoverId = Math.random().toString(36).slice(-8)
        onClickOutside(popoverRef, event => {
            if (!props.closeOnClickOutside) return
            const path = (event as PointerEvent & { path: HTMLElement[] })?.path || (event as PointerEvent & { composedPath: () => HTMLElement[] })?.composedPath() || []
            for (const el of path) {
                if (el.dataset && 'wpPopoverWrapper' in el.dataset) return
                const wpPopover = el.getAttribute?.('_wp_popover_')
                if (wpPopover === popoverId) return
            }
            if (!show.value) return
            show.value = false
        })
        const mouseMoveing = ref<ReturnType<typeof setTimeout> | null>(null)
        /**
         * ????????????
         */
        const handleClick = () => show.value = !show.value
        const handleMouseEnter = () => {
            if (mouseMoveing.value) clearTimeout(mouseMoveing.value)
            show.value = true
        }
        const handleMouseLeave = () => {
            mouseMoveing.value = setTimeout(() => show.value = false, props.duration)
        }
        const handleFocus = () => {
            show.value = true
        }
        const handleBlur = () => {
            show.value = false
        }
        const getReferenceNode = () => {
            const references = slots.reference?.()
            if (!references) {
                if (typeof props.x === 'undefined' && typeof props.y === 'undefined') console.warn('WisdomPlus: Popover ?????????????????? reference???????????????????????????????????????')
                return
            }
            const reference = cloneVNode(references[0].type === textVNodeType ? h('span', null, references) : references[0])
            /**
             * ????????????
             */
            if (!reference.props) reference.props = {}
            const handlers: Record<string, () => void> = {}
            if (props.trigger === 'click') handlers.onClick = handleClick
            if (props.trigger === 'hover') {
                handlers.onMouseenter = handleMouseEnter
                handlers.onMouseleave = handleMouseLeave
            }
            if (props.trigger === 'focus') {
                handlers.onFocus = handleFocus
                handlers.onBlur = handleBlur
            }
            reference.props = mergeProps(reference.props, handlers, {
                '_wp_popover_': popoverId
            })
            return reference
        }
        const followerEnabled = ref(show.value)
        const popoverClassRef = computed(() => {
            if (typeof props.popoverClass === 'string') {
                const popoverClasses = props.popoverClass.split(' ')
                const final: Record<string, boolean> = {}
                popoverClasses.forEach(item => {
                    final[item] = true
                })
                return final
            } else {
                return props.popoverClass
            }
        })
        const leaving = ref(false)
        const zIndexRef = computed(() => props.zIndex || zIndex.value)

        provide('wpPopover', popoverId)
        const isChild = inject<string | false>('wpPopover', false)
        return () => (
            <VBinder>
                <VTarget>
                    { getReferenceNode() }
                </VTarget>
                <VFollower
                    show
                    placement={props.placement}
                    zIndex={zIndexRef.value}
                    enabled={followerEnabled.value}
                    to={props.to === false ? undefined : props.to}
                    width={props.width === 'trigger' || props.width === 'target' ? 'target' : undefined}
                    flip={props.flip}
                    teleportDisabled={Boolean(props.to === false || isChild)}
                    x={props.x}
                    y={props.y}
                >
                    <Transition
                        name={props.transition}
                        onEnter={() => {
                            followerEnabled.value = true
                        }}
                        onLeave={() => {
                            leaving.value = true
                        }}
                        onAfterLeave = {() => {
                            followerEnabled.value = false
                            leaving.value = false
                        }}
                    >
                        {
                            (show.value || props.useVShow) ?
                                props.raw ?
                                    (
                                        <div
                                            class={popoverClassRef.value}
                                            ref={popoverRef}
                                            onMouseenter={() => {
                                                if (props.trigger !== 'hover' || leaving.value) return
                                                handleMouseEnter()
                                            }}
                                            onMouseleave={() => {
                                                if (props.trigger !== 'hover') return
                                                handleMouseLeave()
                                            }}
                                            style={{
                                                width: typeof props.width === 'number' ? `${props.width}px`: '',
                                                transform: props.offset ? `translateX(${props.offset[0]}px) translateY(${props.offset[1]}px)` : ''
                                            }}
                                            v-show={!props.useVShow || show.value}
                                            { ...attrs }
                                        >
                                            { slots.default?.() }
                                        </div>
                                    ) :
                                    (
                                        <div
                                            class={{
                                                'wp-popover': true,
                                                'wp-popover__dark': props.dark,
                                                ...popoverClassRef.value
                                            }}
                                            ref={popoverRef}
                                            onMouseenter={() => {
                                                if (props.trigger !== 'hover' || leaving.value) return
                                                handleMouseEnter()
                                            }}
                                            onMouseleave={() => {
                                                if (props.trigger !== 'hover') return
                                                handleMouseLeave()
                                            }}
                                            {...mergeProps({
                                                style: {
                                                    width: typeof props.width === 'number' ? `${props.width}px`: '',
                                                    transform: props.offset ? `translateX(${props.offset[0]}px) translateY(${props.offset[1]}px)` : '',
                                                }
                                            }, { style: props.popoverStyle })}
                                            v-show={!props.useVShow || show.value}
                                            { ...attrs }
                                        >
                                            { props.arrow ? <div class="wp-popover-arrow" /> : null }
                                            <div class="wp-popover-content">
                                                { slots.default?.() }
                                            </div>
                                        </div>
                                    ) :
                                null
                        }
                    </Transition>
                </VFollower>
            </VBinder>
        )
    }
})