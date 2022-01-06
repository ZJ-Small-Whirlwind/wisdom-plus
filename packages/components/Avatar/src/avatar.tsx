import { defineComponent, ExtractPropTypes, PropType } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'

import ImageElement, { imageProps } from '../../Image'

const avatarPropsSelf = buildProps({
    size: {
        type: [Number, String, Array] as PropType<number | string | [number | string, number | string]>,
        default: 64
    },
    contain: {
        type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
        default: 'cover'
    },
    borderRadius: {
        type: String,
        default: '50%'
    }
})

export const avatarProps = {
    ...imageProps,
    ...avatarPropsSelf
}

export type AvatarProps = ExtractPropTypes<typeof avatarProps>

import { UserOutlined, UserDeleteOutlined } from '@vicons/antd'
import Icon from '../../Icon'

export default defineComponent({
    name: 'WpAvatar',
    props: avatarProps,
    setup(props, { slots }) {
        return () => (
            <ImageElement
                class="wp-avatar"
                { ...props }
                v-slots={{
                    default: slots.default?.(),
                    error: slots.error?.() || (
                        <Icon>
                            <UserDeleteOutlined />
                        </Icon>
                    ),
                    loading: slots.loading?.() || (
                        <Icon>
                            <UserOutlined />
                        </Icon>
                    ),
                    empty: slots.empty?.() || (
                        <Icon>
                            <UserOutlined />
                        </Icon>
                    )
                }}
            />
        )
    }
})