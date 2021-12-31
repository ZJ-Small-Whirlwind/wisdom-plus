import { buildProps, definePropType } from "@wisdom-plus/utils/props"
import { defineComponent, ExtractPropTypes } from "vue"

export const layoutAsideProps = buildProps({
    width: definePropType<string | number>([String, Number]),
    height: definePropType<string | number>([String, Number]),
    padding: String
})

export type LayoutAsideProps = ExtractPropTypes<typeof layoutAsideProps>

export default defineComponent({
    name: 'WpLayoutAside',
    props: layoutAsideProps,
    setup(props, { slots }) {
        return () => (
            <div class="wp-layout-aside" style={{
                width: typeof props.width === 'number' ? `${props.width}px` : props.width,
                height: typeof props.height === 'number' ? `${props.height}px` : props.height,
                padding: props.padding
            }}>
                {slots.default?.()}
            </div>
        )
    }
})