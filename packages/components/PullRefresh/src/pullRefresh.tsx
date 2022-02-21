import {
    ref,
    defineComponent,
    type ExtractPropTypes,
    PropType,
    computed,
    reactive,
} from 'vue';
import { useScrollParent } from '../../../utils/use-scroll-parent'
import Icon from '../../Icon'
import { Loading3QuartersOutlined } from '@vicons/antd'

export const pullRefreshProps = {
    disabled: Boolean,
    pullDistance: {
        type: Number,
        default: 60
    },
    refresh: {
        type: Function as PropType<() => Promise<void>>
    },
    rootElement: {
        type: Object as PropType<Element | null>
    },
    wheelRefresh: Boolean
}
export type PullRefreshProps = ExtractPropTypes<typeof pullRefreshProps>

export default defineComponent({
    name: 'WpPullRefresh',
    props: pullRefreshProps,
    emits: [
        'refresh'
    ],
    setup(props) {
        let reachTop: boolean

        const root = ref<HTMLElement>()
        const scrollParent = useScrollParent(root)

        const isLoading = ref(false)
        const isTouchable = computed(() => !props.disabled && !isLoading.value)
        const checkPosition = () => {
            reachTop = props.rootElement ? props.rootElement.scrollTop === 0 : scrollParent.value?.scrollTop === 0
        }

        const pullingTransition = ref(.4)
        const pullingTransform = reactive({
            translateY: 0,
            rotate: 0
        })
        const refresh = async() => {
            try {
                isLoading.value = true
                pullingTransform.translateY = 90
                pullingTransform.rotate = 360
                await props.refresh?.()
            } finally {
                isLoading.value = false
                pullingTransform.translateY = 0
                pullingTransform.rotate = 0
            }
        }

        let startY = 0
        const onTouchStart = (event: TouchEvent) => {
            pullingTransition.value = 0
            if (isTouchable.value) {
                checkPosition()
                startY = event.touches[0].clientY
            }
        }

        let deltaY = 0
        const onTouchMove = (event: TouchEvent) => {
            if (isTouchable.value) {
                if (!reachTop) {
                    checkPosition()
                }
                deltaY = event.touches[0].clientY - startY
                const delta = deltaY / props.pullDistance > 1 ? 1 : deltaY / props.pullDistance
                pullingTransform.translateY = delta * 90
                pullingTransform.rotate = delta * 360

                if (reachTop && deltaY >= 0) {
                    event.preventDefault()
                }
            }
        }

        const onTouchEnd = async() => {
            pullingTransition.value = .4
            if (reachTop && deltaY >= props.pullDistance && isTouchable.value) {
                refresh()
            } else {
                pullingTransform.translateY = 0
                pullingTransform.rotate = 0
            }
            return true
        }

        const onWheel = (event: WheelEvent) => {
            checkPosition()
            if (reachTop) {
                event.preventDefault()
                if (isTouchable.value && event.deltaY < 0) {
                    refresh()
                }
            }
        }

        return {
            root,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onWheel,
            pullingTransform,
            pullingTransition,
            isTouchable,
            isLoading
        }
    },
    expose: ['root'],
    render() {
        return (
            <div
                ref='root'
                class={'wp-pull-refresh'}
                onTouchstart={this.onTouchStart}
                onTouchmove={this.onTouchMove}
                onTouchend={this.onTouchEnd}
                onTouchcancel={this.onTouchEnd}
                onWheel={this.wheelRefresh ? this.onWheel : undefined}
            >
                {
                    !this.disabled && (
                        <div class='wp-pull-refresh--pulling'>
                            <div class={{
                                'wp-pull-refresh--circle': true,
                            }} style={{
                                transform: `translateY(${this.pullingTransform.translateY}px) rotate(${this.pullingTransform.rotate}deg)`,
                                transitionDuration: `${this.pullingTransition}s`
                            }}>
                                <Icon class={{ 'wp-pull-refresh--circle__loading': this.isLoading }}><Loading3QuartersOutlined /></Icon>
                            </div>
                        </div>
                    )
                }
                { this.$slots.default?.() }
            </div>
        )
    }
});