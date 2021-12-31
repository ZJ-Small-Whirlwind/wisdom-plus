import { defineComponent, ExtractPropTypes } from "vue"
import { buildProps } from "@wisdom-plus/utils/props"

export const layoutContentProps = buildProps({
    padding: String
})

export type LayoutContentProps = ExtractPropTypes<typeof layoutContentProps>

export default defineComponent({
    name: 'WpLayoutContent',
    props: layoutContentProps,
    setup(props, { slots }) {
        return () => (
            <div class="wp-layout-content" style={{
                padding: props.padding
            }}>
                { slots.default?.() }
            </div>
        )
    }
})