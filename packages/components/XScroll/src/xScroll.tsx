import { useScroll, useResizeObserver } from '@vueuse/core'
import { defineComponent, ExtractPropTypes, PropType, ref, Transition, onMounted, onActivated, onUpdated } from 'vue'

import { LeftOutlined, RightOutlined } from '@vicons/antd'
import Icon from '../../Icon'
import { buildProps } from '@wisdom-plus/utils/props'

export interface XScrollInst {
    scrollTo: HTMLElement['scrollTo']
}

export const xScrollProps = buildProps({
    disabled: Boolean,
    onScroll: Function as PropType<(e: Event) => void>,
    showScrollbar: Boolean,
    lockScrollIn: {
        type: Boolean,
        default: true
    },
    showButton: {
        type: Boolean,
        default: true
    },
    delta: {
        type: [Number, Function] as PropType<number | ((offsetWidth: number) => number)>,
        default: 300
    },
    smooth: {
        type: Boolean,
        default: false
    },
    throttle: Number
})

export type XScrollProps = ExtractPropTypes<typeof xScrollProps>

export default defineComponent({
    name: 'WpXScroll',
    props: xScrollProps,
    setup(props) {
        const scrollElement = ref<HTMLElement | null>(null)
        /**
         * get Scroll status
         */
        const touchRight = ref(true)
        const getTouchRight = () => {
            if (!scrollElement.value) return
            const element = scrollElement.value
            touchRight.value = Math.abs(element.scrollLeft - (element.scrollWidth - element.offsetWidth)) < 5
        }
        const { x, isScrolling, arrivedState } = useScroll(scrollElement, {
            throttle: props.throttle,
            onScroll: getTouchRight
        })
        /**
         * deltaScroll
         */
        const deltaScroll = (target?: HTMLElement | null, delta: number | ((scrollWidth: number) => number) = 0, isSmooth = true, plus = true) => {
            if (!target) return
            const deltaMap = typeof delta === 'function' ? delta(target.offsetWidth) : Number(delta)
            target.scrollTo({
                behavior: isSmooth ? 'smooth' : undefined,
                left: plus ? (target.scrollLeft + deltaMap) : (target.scrollLeft - deltaMap)
            })
        }
        function handleWheel(e: WheelEvent): void {
            const preventYWheel =
                (e.currentTarget as HTMLElement).offsetWidth <
                (e.currentTarget as HTMLElement).scrollWidth
            if (!preventYWheel || e.deltaY === 0) return
            const delta = e.deltaY + e.deltaX
            if (!props.lockScrollIn) {
                if (x.value === 0 && delta < 0) return
                if (touchRight.value && delta > 0) return
            }
            if (props.smooth) {
                deltaScroll((e.currentTarget as HTMLElement), props.delta, true, delta > 0)
            } else {
                deltaScroll((e.currentTarget as HTMLElement), delta, false)
            }
            e.preventDefault()
        }

        const exposedMethods: XScrollInst = {
            scrollTo(...args: any[]) {
                scrollElement.value?.scrollTo(...args)
            }
        }
        /**
         * Listen Resize to change scroll
         */
        onMounted(getTouchRight)
        onUpdated(getTouchRight)
        useResizeObserver(scrollElement, getTouchRight)

        onActivated(() => {
            scrollElement.value?.scrollTo({
                left: x.value
            })
        })

        return {
            x,
            isScrolling,
            arrivedState,
            scrollElement,
            touchRight,
            handleWheel,
            getTouchRight,
            deltaScroll,
            ...exposedMethods
        }
    },
    render() {
        return (
            <div class={{
                'wp-x-scroll': true,
                'wp-x-scroll__hide': !this.showScrollbar
            }}>
                <Transition name="wp-x-scroll-fade">
                    {
                        this.showButton && !this.arrivedState.left ? (
                            this.$slots.leftArrow?.({
                                click: () => this.deltaScroll(this.scrollElement, this.delta, true, false)
                            }) || (
                                <div class="wp-x-scroll-arrow" onClick={() => this.deltaScroll(this.scrollElement, this.delta, true, false)}>
                                    <Icon>
                                        <LeftOutlined />
                                    </Icon>
                                </div>
                            )
                        ) : null
                    }
                </Transition>
                <div
                    ref="scrollElement"
                    onScroll={this.onScroll}
                    onWheel={this.disabled ? undefined : this.handleWheel} class="wp-x-scroll-wrapper">
                    {this.$slots.default?.()}
                </div>
                <Transition name="wp-x-scroll-fade">
                    {
                        this.showButton && !this.touchRight ? (
                            this.$slots.rightArrow?.({
                                click: () => this.deltaScroll(this.scrollElement, this.delta)
                            }) || (
                                <div class="wp-x-scroll-arrow wp-x-scroll-arrow__right" onClick={() => this.deltaScroll(this.scrollElement, this.delta)}>
                                    <Icon>
                                        <RightOutlined />
                                    </Icon>
                                </div>
                            )
                        ) : null
                    }
                </Transition>
            </div>
        )
    }
})