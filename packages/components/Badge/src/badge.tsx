import { computed, defineComponent, ExtractPropTypes } from 'vue'

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
        const valueToShow = computed(() => {
            if (typeof props.value === 'number') {
                if (typeof props.max === 'number') {
                    return props.value > props.max ? `${props.max}+` : props.value
                }
                return props.value
            }
            return props.value
        })
        return () => {
            const BadgeCount = (
                !props.hidden ? (
                    <div class={{
                        'wp-badge-value': true,
                        'wp-badge__dot': !slots.value && !props.value && props.value !== 0
                    }} style={{
                        backgroundColor: props.color
                    }}>
                        { slots.value?.() || valueToShow.value }</div>
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