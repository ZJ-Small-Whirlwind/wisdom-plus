import { buildProps } from "@wisdom-plus/utils/props"
import { defineComponent, ExtractPropTypes } from "vue"

export const layoutProps = buildProps({
    row: Boolean
})

export type LayoutProps = ExtractPropTypes<typeof layoutProps>

export default defineComponent({
    name: 'WpLayout',
    props: layoutProps,
    setup(props, { slots }) {
        return () => (
            <div class="wp-layout" style={{
                flexDirection: props.row ? 'row' : 'column'
            }}>
                { slots.default?.() }
            </div>
        )
    }
})