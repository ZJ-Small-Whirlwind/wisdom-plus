import { flatten } from "@wisdom-plus/utils/flatten"
import { useNamespace } from "@wisdom-plus/utils/namespace"
import { buildProps } from "@wisdom-plus/utils/props"
import { defineComponent, ExtractPropTypes, PropType, provide } from "vue"

export const timelineProps = buildProps({
    reverse: Boolean,
    relative: Boolean,
    mode: {
        type: String as PropType<'left' | 'right' | 'alternate'>
    },
    horizontal: Boolean
})

export type TimelineProps = ExtractPropTypes<typeof timelineProps>

export default defineComponent({
    name: 'WpTimeline',
    props: timelineProps,
    setup(props) {
        const { basic, is } = useNamespace('timeline')
        provide('wpTimelineProps', props)
        return {
            basic,
            is
        }
    },
    render() {
        // Reverse
        const items = flatten(this.$slots.default?.() || [])
        if (this.reverse) items.reverse()

        return (
            <div class={[
                this.basic,
                {
                    [this.is('horizontal')]: this.horizontal,
                }
            ]}>
                { items }
            </div>
        )
    }
})