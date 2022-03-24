import { useNamespace } from "@wisdom-plus/utils/namespace"
import { buildProps } from "@wisdom-plus/utils/props"
import { CSSProperties, defineComponent, ExtractPropTypes, inject, PropType, Component, h } from "vue"
import type { TimelineProps } from './timeline'
import Icon from '../../Icon'
import Spin from "../../Spin"

export const timelineItemProps = buildProps({
    label: String,
    dotColor: String,
    lineColor: String,
    icon: Object as PropType<Component>,
    loading: Boolean
})

export type TimelineItemProps = ExtractPropTypes<typeof timelineItemProps>

export default defineComponent({
    name: 'WpTimelineItem',
    props: timelineItemProps,
    setup() {
        const { basic, of, is } = useNamespace('timeline-item')
        const timelineProps = inject<TimelineProps>('wpTimelineProps')

        return {
            basic,
            of,
            is,
            timelineProps
        }
    },
    render() {
        const Label = (
            <div class={this.of('label')}>
                { this.timelineProps?.relative && (this.$slots.label?.() ?? this.label) }
            </div>
        )
        const Line = (
            <div class={this.of('line')}>
                {
                    this.icon || this.loading ? (
                        <div class={this.of('icon', this.of('line'))}>
                            {
                                this.loading ? (
                                    <Spin color="var(--wp-timeline-item-dot-color)" />
                                ) : <Icon>{h(this.icon)}</Icon>
                            }
                        </div>
                    ) : (
                        <div class={this.of('dot', this.of('line'))} />
                    )
                }
                <div class={this.of('self', this.of('line'))} />
            </div>
        )
        const Content = (
            <div class={this.of('content')}>
                {this.$slots.default?.()}
                {
                    !this.timelineProps?.relative && (
                        <div class={this.of('label', this.of('content'))}>
                            { this.$slots.label?.() ?? this.label }
                        </div>
                    )
                }
            </div>
        )
        return (
            <div class={[
                this.basic,
                this.is(this.timelineProps?.mode || 'left')
            ]} style={{
                '--wp-timeline-item-dot-color': this.dotColor || '',
                '--wp-timeline-item-line-color': this.lineColor || ''
            } as CSSProperties}>
                { (this.timelineProps?.relative || this.timelineProps?.mode === 'alternate') && Label }
                { Line }
                { Content }
            </div>
        )
    }
})