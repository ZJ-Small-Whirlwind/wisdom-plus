import { defineComponent, ExtractPropTypes, CSSProperties, PropType } from 'vue'
import { definePropType, buildProps } from '@wisdom-plus/utils/props'

export const statisticProps = buildProps({
    label: {
        type: [String, Number]
    },
    labelStyle: {
        type: definePropType<CSSProperties | string>([Object, String]),
        default: ''
    },
    value: {
        type: [Number, String] as PropType<number | string>
    },
    valueStyle: {
        type: definePropType<CSSProperties | string>([Object, String]),
        default: ''
    },
    prefix: {
        type: [Number, String] as PropType<number | string>
    },
    suffix: {
        type: [Number, String] as PropType<number | string>
    },
    prefixStyle: {
        type: definePropType<CSSProperties | string>([Object, String]),
        default: ''
    },
    suffixStyle: {
        type: definePropType<CSSProperties | string>([Object, String]),
        default: ''
    },
    vertical: {
        type: Boolean,
        default: false
    },
    reverse: {
        type: Boolean,
        default: false
    },
    align: String as PropType<'start' | 'end' | 'center' | 'baseline' | 'stretch'>,
    justify: String as PropType<'start' | 'end' | 'center' | 'space-around' | 'space-between'>
})

export type StatisticProps = ExtractPropTypes<typeof statisticProps>

const getAlign = (align?: string) => {
    if (!align) return
    if (align === 'start' || align === 'end') return `flex-${align}`
    return align
}

export default defineComponent({
    name: 'WpStatistic',
    props: statisticProps,
    setup(props, { slots }) {
        return () => {
            const Label = slots.label || props.label ? (
                <div class="wp-statistic__label" style={props.labelStyle}>
                    { slots.label?.() || props.label }
                </div>
            ) : null
            const Value = (
                <div class="wp-statistic__value" style={props.valueStyle}>
                    {
                        slots.prefix || props.prefix ? (
                            <div class="wp-statistic__prefix" style={props.prefixStyle}>
                                { slots.prefix?.() || props.prefix }
                            </div>
                        ) : null
                    }
                    { slots.default?.() || slots.value?.() || props.value }
                    {
                        slots.suffix || props.suffix ? (
                            <div class="wp-statistic__suffix" style={props.suffixStyle}>
                                { slots.suffix?.() || props.suffix }
                            </div>
                        ) : null
                    }
                </div>
            )
            return (
                <div class={{
                    'wp-statistic': true,
                    'wp-statistic__vertical': props.vertical,
                    'wp-statistic__reverse': props.reverse
                }} style={{
                    alignItems: getAlign(props.align),
                    justifyContent: getAlign(props.justify)
                }}>
                    { slots.top?.() }
                    {
                        !props.reverse ? ( <>{ Label }{ Value }</> ) : ( <>{ Value }{ Label }</> )
                    }
                    { slots.bottom?.() }
                </div>
            )
        }
    }
})