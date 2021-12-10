import { defineComponent, h, Transition, PropType, cloneVNode, mergeProps, ref } from 'vue'
import { VBinder, VTarget, VFollower } from 'vueuc'

import { buildProps } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes } from 'vue'
import { onClickOutside } from '@vueuse/core'

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'none'
export type PopoverPlacement = 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'
export const popoverProps = buildProps({
    modelValue: Boolean,
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
    to: [String, Boolean, Object] as PropType<string | HTMLElement | false>,
    width: [Number, String] as PropType<number | 'trigger'>,
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
    }
})

export type PopoverProps = ExtractPropTypes<typeof popoverProps>

export const popoverEmits = {
    'update:modelValue': (value: boolean) => typeof value === 'boolean'
}

export type PopoverEmits = typeof popoverEmits

export default defineComponent({
    name: 'Popover',
    props: popoverProps,
    setup(props, { slots, emit }) {
        /**
         * 点击外部自动关闭自身
         */
        const popoverRef = ref<HTMLDivElement | null>(null)
        const popoverId = Math.random().toString(36).slice(-8)
        onClickOutside(popoverRef, event => {
            if (!props.closeOnClickOutside) return
            const path = (event as PointerEvent & { path: HTMLElement[] }).path
            for (const el of path) {
                const wpPopover = el.getAttribute?.('_wp_popover_')
                if (wpPopover === popoverId) {
                    return
                }
            }
            if (!props.modelValue) return
            emit('update:modelValue', false)
        })
        const mouseMoveing = ref<ReturnType<typeof setTimeout> | null>(null)
        const focsuing = ref<ReturnType<typeof setTimeout> | null>(null)
        /**
         * 处理事件
         */
        const handleClick = () => emit('update:modelValue', !props.modelValue)
        const handleMouseEnter = () => {
            if (mouseMoveing.value) clearTimeout(mouseMoveing.value)
            emit('update:modelValue', true)
        }
        const handleMouseLeave = () => {
            mouseMoveing.value = setTimeout(() => emit('update:modelValue', false), props.duration)
        }
        const handleFocus = () => {
            if (focsuing.value) clearTimeout(focsuing.value)
            emit('update:modelValue', true)
        }
        const handleBlur = () => {
            focsuing.value = setTimeout(() => emit('update:modelValue', false), props.duration)
        }
        const getReferenceNode = () => {
            const references = slots.reference?.()
            if (!references) {
                console.warn('WisdomPlus: Popover 组件没有找到 reference，请确保插槽中正确放入内容')
                return
            }
            const reference = cloneVNode(references[0].el?.nodeName === '#text' ? h('span', null, references) : references[0])
            /**
             * 绑定事件
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
                '_wp_popover_': popoverId,
                internalSyncTargetWithParent: true
            })
            return reference
        }
        const followerEnabled = ref(props.modelValue)
        return () => (
            <VBinder syncTarget syncTargetWithParent>
                <VTarget>
                    { getReferenceNode() }
                </VTarget>
                <VFollower
                    show
                    placement={props.placement}
                    zIndex={props.zIndex}
                    enabled={followerEnabled.value}
                    to={props.to}
                    width={props.width}
                    flip={props.flip}
                >
                    <Transition
                        name={props.transition}
                        onEnter={() => {
                            followerEnabled.value = true
                        }}
                        onAfterLeave = {() => {
                            followerEnabled.value = true
                        }}
                    >
                        {
                            props.modelValue ?
                                props.raw ?
                                    slots.default?.()
                                    : (
                                        <div
                                            class={{
                                                'wp-popover': true,
                                                'wp-popover__dark': props.dark,
                                                [`wp-popover__${props.placement}`]: true
                                            }}
                                            ref={popoverRef}
                                            onMouseenter={() => {
                                                if (props.trigger !== 'hover') return
                                                handleMouseEnter()
                                            }}
                                            onMouseleave={() => {
                                                if (props.trigger !== 'hover') return
                                                handleMouseLeave()
                                            }}
                                        >
                                            { props.arrow ? <div class="wp-popover-arrow" /> : null }
                                            <div class="wp-popover-content">
                                                { slots.default?.() }
                                            </div>
                                        </div>
                                    )
                                : null
                        }
                    </Transition>
                </VFollower>
            </VBinder>
        )
    }
})