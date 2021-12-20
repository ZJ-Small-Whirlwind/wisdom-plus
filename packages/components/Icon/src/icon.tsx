import { defineComponent, ExtractPropTypes } from 'vue'
import { Icon } from '@vicons/utils'
import { buildProps } from '@wisdom-plus/utils/props'

export const iconProps = buildProps({
    size: [String, Number],
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
            <Icon
                size={props.size}
                color={props.color}
                tag={props.tag}
                class="wp-icon"
            >
                {slots.default?.() || <i class={props.name} />}
            </Icon>
        )
    },
})