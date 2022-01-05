import { buildProps } from "@wisdom-plus/utils/props"
import { computed, defineComponent, ExtractPropTypes, nextTick, PropType, ref } from "vue"

import CircleProgressElement from './cricleProgress'

export const progressProps = buildProps({
    size: {
        type: [Number, String],
        default: 10
    },
    percentage: {
        type: Number,
        default: 0
    },
    type: {
        type: String as PropType<'horizontal' | 'vertical' | 'circle' | 'grid'>,
        default: 'horizontal'
    },
    height: {
        type: [Number, String],
        default: 100
    },
    align: {
        type: String as PropType<'start' | 'end' | 'center'>,
        default: 'start'
    },
    showText: {
        type: Boolean,
        default: true
    },
    borderRadius: {
        type: String,
        default: '10px'
    },
    color: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, string>>
    },
    backgroundColor: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, string>>
    },
    strokeLinecap: {
        type: String as PropType<'square' | 'butt' | 'round'>,
        default: 'round'
    },
    clockwise: {
        type: Boolean,
        default: true
    },
    startPosition: {
        type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
        default: 'top'
    },
    appear: Boolean
})

const autoString = new Array(100).fill('█').join('')

export type ProgressProps = ExtractPropTypes<typeof progressProps>

export default defineComponent({
    name: 'WpProgress',
    props: progressProps,
    setup(props, { slots }) {
        /**
         * props map
         */
        const size = computed(() => {
            if (!isNaN(Number(props.size))) {
                return `${props.size}px`
            } else {
                return props.size
            }
        })
        const height = computed(() => {
            if (!isNaN(Number(props.height))) {
                return `${props.height}px`
            } else {
                return props.height
            }
        })
        const finish = ref(false)
        nextTick(() => {
            finish.value = true
        })
        const progress = computed(() => {
            if (props.appear && !finish.value) return 0
            return props.percentage < 0 ? 0 : (props.percentage > 100 ? 100 : props.percentage)
        })
        /**
         * get Color and BgColor
         */
        const getBackground = (color?: string | string[] | Record<string, string>) => {
            if (!color || typeof color === 'string') return color
            let colorString: string = ''
            if (!Array.isArray(color)) {
                const colors = Object.entries(color).map(colorItem => {
                    return `${colorItem[1]} ${colorItem[0]}`
                })
                colorString = colors.join(', ')
            } else {
                colorString = color.join(', ')
            }
            let to: string = ''
            if (props.align === 'start' && (props.type === 'horizontal' || props.type === 'grid')) to = 'right'
            if (props.align === 'end' && (props.type === 'horizontal' || props.type === 'grid')) to = 'left'
            if (props.align === 'start' && props.type === 'vertical') to = 'bottom'
            if (props.align === 'end' && props.type === 'vertical') to = 'top'
            return `linear-gradient(to ${to}, ${colorString})`
        }
        const color = computed(() => {
            return getBackground(props.color)
        })
        const backgroundColor = computed(() => {
            return getBackground(props.backgroundColor)
        })
        const currentRate = ref(props.appear ? 0 : progress.value)
        return () => {
            /**
             * HorizontalProgress
             */
            const HorizontalProgress = (
                <div class="wp-progress__outer" style={{
                    height: size.value,
                    borderRadius: props.borderRadius,
                    background: backgroundColor.value,
                    justifyContent: props.align === 'end' ? 'flex-end' : ( props.align === 'center' ? 'center' : undefined )
                }}>
                    <div class="wp-progress__inner" style={{
                        width: `${progress.value}%`,
                        borderRadius: props.borderRadius,
                        background: color.value
                    }}>
                        { slots.inner?.() }
                    </div>
                </div>
            )
            const GridProgress = (
                <div class="wp-progress__outer" style={{
                    height: size.value,
                    borderRadius: props.borderRadius,
                    background: backgroundColor.value,
                    justifyContent: props.align === 'end' ? 'flex-end' : ( props.align === 'center' ? 'center' : undefined )
                }}>
                    <div class="wp-progress__inner" style={{
                        width: `${progress.value}%`,
                        borderRadius: props.borderRadius,
                        background: color.value,
                        fontSize: size.value,
                        backgroundClip: 'text',
                        '-webkit-background-clip': 'text'
                    }}>
                        { autoString }
                    </div>
                </div>
            )
            /**
            * VerticalProgress
            */
            const VerticalProgress = (
                <div class="wp-progress__outer" style={{
                    width: size.value,
                    borderRadius: props.borderRadius,
                    background: backgroundColor.value,
                    justifyContent: props.align === 'end' ? 'flex-end' : ( props.align === 'center' ? 'center' : undefined )
                }}>
                    <div class="wp-progress__inner" style={{
                        height: `${progress.value}%`,
                        borderRadius: props.borderRadius,
                        background: color.value
                    }}>
                        { slots.inner?.()}
                    </div>
                </div>
            )
            /**
             * CircleProgress
             */
            const CircleProgress = (
                <CircleProgressElement
                    currentRate={currentRate.value}
                    onUpdate:currentRate={value => currentRate.value = value}
                    rate={progress.value}
                    speed={100}
                    color={typeof props.color === 'string' || !Array.isArray(props.color) ? props.color : undefined}
                    layerColor={typeof props.backgroundColor === 'string' ? props.backgroundColor : ''}
                    size={props.height}
                    strokeWidth={props.size}
                    strokeLinecap={props.strokeLinecap}
                    clockwise={props.clockwise}
                    startPosition={props.startPosition}
                >
                    { props.showText ? (slots.default?.() || `${props.percentage}%`) : null }
                </CircleProgressElement>
            )

            const getProgress = () => {
                switch(props.type) {
                    case 'horizontal':
                        return HorizontalProgress
                    case 'vertical':
                        return VerticalProgress
                    case 'circle':
                        return CircleProgress
                    case 'grid':
                        return GridProgress
                    default:
                        return null
                }
            }

            return (
                <div class={{
                    'wp-progress': true,
                    [`wp-progress-${props.type}`]: true
                }} style={{
                    height: props.type === 'vertical' ? height.value : undefined
                }}>
                    { getProgress() }
                    {
                        props.showText && props.type !== 'circle' ? (
                            <span class="wp-progress__text">
                                { slots.default?.() || `${props.percentage}%` }
                            </span>
                        ) : null
                    }
                </div>
            )
        }
    }
})