import { defineComponent, ExtractPropTypes } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'

export const badgeProps = buildProps({
    value: {
        type: [Number, String]
    },
    color: {
        type: String,
        default: '#f56c6c'
    },
    hidden: {
        type: Boolean,
        default: false
    },
    max: Number
})

export type BadgeProps = ExtractPropTypes<typeof badgeProps>

export default defineComponent({
    name: 'WpBadge',
    props: badgeProps,
    setup(props, { slots }) {
        return () => {
            const BadgeCount = (
                !props.hidden ? (
                    <div class={{
                        'wp-badge-value': true,
                        'wp-badge__dot': !slots.value && !props.value
                    }} style={{
                        backgroundColor: props.color
                    }}>
                        { slots.value?.() ||
                            (
                                typeof props.max === 'number' && typeof props.value === 'number' ?
                                (
                                    props.value > props.max ?
                                    `${props.max}+` :
                                    props.value
                                ) :
                                props.value
                            )
                        }</div>
                ) : null
            )
            return (
                slots.default ? (
                    <div class="wp-badge">
                        { BadgeCount }
                        { slots.default?.() }
                    </div>
                ) : BadgeCount
            )
        }
    }
})