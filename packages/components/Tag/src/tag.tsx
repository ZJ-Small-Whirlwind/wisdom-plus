import { defineComponent, PropType, Component, h, CSSProperties } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes } from 'vue'

import { CloseOutlined } from '@vicons/antd'

import Icon from '../../Icon'

export const tagProps = buildProps({
    label: String,
    icon: Object as PropType<Component>,
    closable: Boolean,
    color: {
        type: Array as PropType<string[]>,
    },
    size: {
        type: String as PropType<'small' | 'default' | 'medium' | 'large'>,
        default: 'default'
    }
})

export type TagProps = ExtractPropTypes<typeof tagProps>

export default defineComponent({
    name: 'WpTag',
    props: tagProps,
    emits: {
        close: (e: Event) => typeof e === 'object'
    },
    setup(props, { slots, emit }) {
        return () => (
            <div class={{
                'wp-tag': true,
                [`wp-tag-${props.size}`]: true
            }} style={{
                '--wp-tag-color': props.color?.[0] || '',
                '--wp-tag-bg-color': props.color?.[1] || ''
            } as CSSProperties}>
                {
                    slots.icon || props.icon ? (
                        <div class="wp-tag--icon">
                            <Icon>
                                { slots.icon?.() || h(props.icon) }
                            </Icon>
                        </div>
                    ) : null
                }
                <div class="wp-tag--text">{ slots.default?.() || props.label }</div>
                {
                    props.closable ? (
                        <div class="wp-tag--close" onClick={e => emit('close', e)}>
                            <Icon>
                                { slots.closeIcon?.() || <CloseOutlined /> }
                            </Icon>
                        </div>
                    ) : null
                }
            </div>
        )
    }
})