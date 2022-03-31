import { defineComponent, ExtractPropTypes, h } from 'vue'
import { buildProps, definePropType } from '@wisdom-plus/utils/props'
import { addUnit } from '@wisdom-plus/utils/util'
// import a from '//at.alicdn.com/t/font_3282174_c02x383zxbq.js'

export const iconProps = buildProps({
    size: definePropType<string | number>([String, Number]),
    color: String,
    tag: {
        type: String,
        default: 'span',
    },
    fill:{type:Boolean, default:true},
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
                    class: {
                        'wp-icon':true,
                        'wp-icon-fill':!!props.fill,
                    }
                },
                slots.default?.() || h('i', { class: props.name })
            )
        )
    },
})
