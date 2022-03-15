import { buildProps } from "@wisdom-plus/utils/props"
import { defineComponent, ExtractPropTypes, PropType } from "vue"

export const tabProps = buildProps({
    title: String,
    index: {
        type: [String, Symbol, Number, Boolean] as PropType<string | symbol | number | boolean>,
        default: Symbol()
    },
    closeable: Boolean
})

export type TabProps = ExtractPropTypes<typeof tabProps>

export default defineComponent({
    name: 'WpTab',
    props: tabProps,
    setup() {
    },
    render() {
        this.index
        return this.$slots.default?.()
    }
})