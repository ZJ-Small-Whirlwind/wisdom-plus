import {
    defineComponent,
    ExtractPropTypes,
    TransitionGroup,
    ref,
    StyleValue,
    h,
    onBeforeUnmount,
    watch,
    PropType
} from 'vue'
import { flatten } from '../../../utils/flatten'
import { definePropType, buildProps } from '@wisdom-plus/utils/props'

export const scrollListProps = buildProps({
    height: {
        type: definePropType<number | string>([Number, String]),
        default: 'auto'
    },
    tag: {
        type: String,
        default: 'div'
    },
    duration: {
        type: Number,
        default: 2000
    },
    animationDuration: {
        type: Number,
        default: 400
    },
    hoverToStop: {
        type: Boolean,
        default: true
    },
    space: {
        type: definePropType<number | string>([Number, String])
    },
    play: {
        type: Boolean,
        default: true
    },
    reverse: {
        type: Boolean,
        default: false
    },
    autoUpdate: {
        type: Boolean,
        default: true
    },
    base: {
        type: String as PropType<'first' | 'last'>,
        default: 'first'
    },
    count: {
        type: Number,
        default: 1
    },
    linear: Boolean
})

export type ScrollListProps = ExtractPropTypes<typeof scrollListProps>

export default defineComponent({
    name: 'WpScrollList',
    props: scrollListProps,
    setup(props, { slots, expose }) {
        let slotBackup = JSON.stringify(slots.default?.())
        /**
         * update elements
         */
        const getSlotsElements = () => {
            const elements = slots.default?.() || []
            const flattenElements = flatten(elements).map(element => ({
                ...element,
                id: Symbol('id')
            }))
            if (props.base === 'last') {
                flattenElements.reverse()
            }
            return flattenElements
        }
        const slotsElements = ref(getSlotsElements())
        const update = () => {
            slotsElements.value = getSlotsElements()
        }
        watch([() => props.base, () => props.reverse], () => {
            if (props.autoUpdate) update()
        })
        const scrollListRef = ref<{ $el: HTMLDivElement } | null>(null)
        const popList = () => {
            if (!props.play) return
            if (slotsElements.value.length < 2) return
            if (scrollListRef.value) {
                if (scrollListRef.value.$el.scrollHeight <= scrollListRef.value.$el.offsetHeight) return
            }
            const count = props.count > slotsElements.value.length ? slotsElements.value.length : props.count
            const pushTo = slotsElements.value.slice(0, count)
            slotsElements.value.splice(0, count)
            pushTo.forEach(child => {
                child.id = Symbol('id')
                slotsElements.value.push(child)
            })
        }
        const timer = ref<null | ReturnType<typeof setInterval>>(null)
        const end = () => {
            if (timer.value) clearInterval(timer.value)
        }
        const start = () => {
            end()
            timer.value = setInterval(popList, props.duration + props.animationDuration)
        }
        watch(() => props.play, () => {
            if (props.play) {
                start()
            } else {
                end()
            }
        }, {
            immediate: true
        })
        /**
         * 解决 chrome 浏览器返回页面时动画加速的问题
         */
        const stopWhileHidden = () => {
            if (!props.play) return
            if (document.visibilityState === 'visible') {
                start()
            } else {
                end()
            }
        }
        
        window.addEventListener('visibilitychange', stopWhileHidden)
        onBeforeUnmount(() => {
            end()
            window.removeEventListener('visibilitychange', stopWhileHidden)
        })
        expose({ update })
        return () => {
            if (props.autoUpdate) {
                const slotBackupMap = JSON.stringify(slots.default?.())
                if (slotBackupMap !== slotBackup) {
                    end()
                    slotBackup = slotBackupMap
                    update()
                    start()
                }
            }
            return (
                h(TransitionGroup, {
                    class: {
                        'wp-scroll-list': true,
                        'wp-scroll-list-reverse': props.reverse
                    },
                    name: props.reverse ? 'wp-scroll-flip-reverse' : 'wp-scroll-flip',
                    tag: props.tag,
                    style: {
                        height: !isNaN(Number(props.height)) ? `${props.height}px` : props.height
                    },
                    ref: scrollListRef,
                    onMouseenter: () => props.play && props.hoverToStop && end(),
                    onMouseleave: () => props.play && props.hoverToStop && start()
                }, {
                    default: () => (
                        slotsElements.value.map((element, index) => (
                            <div class={{
                                'wp-scroll-list__cell': true,
                                'linear': props.linear
                            }} style={{
                                '--duration': props.animationDuration / 1000 + 's',
                                paddingBottom: index !== slotsElements.value.length - 1 ? (!isNaN(Number(props.space)) ? `${props.space}px` : props.space) : ''
                            } as StyleValue} key={element.id}>
                                { element }
                            </div>
                        ))
                    )
                })
            )
        }
    }
})