import { defineComponent, ExtractPropTypes, h } from 'vue'
import { buildProps, definePropType } from '@wisdom-plus/utils/props'
import { addUnit } from '@wisdom-plus/utils/util'

export const iconProps = buildProps({
    size: definePropType<string | number>([String, Number]),
    color: String,
    tag: {
        type: String,
        default: 'span',
    },
    name: String,
})

export type IconProps = ExtractPropTypes<typeof iconProps>;

export default defineComponent({
    name: 'WpIcon',
    props: iconProps,
    setup(props, { slots }) {
        return () => (
            h(
                props.tag,
                {
                    style: {
                        fontSize: addUnit(props.size),
                        color: props.color
                    },
                    class: 'wp-icon'
                },
                h('svg', null, {
                    default: slots.default || (() => h('i', { class: props.name }))
                })
            )
        )
    },
})