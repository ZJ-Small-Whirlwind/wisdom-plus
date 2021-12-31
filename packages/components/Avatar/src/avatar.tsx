import { defineComponent, ExtractPropTypes, PropType, computed, ref, watch } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'

export const avatarProps = buildProps({
    size: {
        type: [Number, String, Array] as PropType<number | string | [number | string, number | string]>,
        default: 64
    },
    src: String,
    contain: {
        type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
        default: 'cover'
    },
    borderRadius: {
        type: String,
        default: '50%'
    },
    background: {
        type: String,
        default: '#f5f5f5'
    },
    color: {
        type: String,
        default: ''
    },
    alt: String
})

export type AvatarProps = ExtractPropTypes<typeof avatarProps>

import { UserOutlined, UserDeleteOutlined } from '@vicons/antd'
import Icon from '../../Icon'

export default defineComponent({
    name: 'WpAvatar',
    props: avatarProps,
    setup(props, { slots }) {
        const size = computed((): [string, string] => {
            if (typeof props.size === 'number' || !isNaN(Number(props.size))) {
                return [`${props.size}px`, `${props.size}px`]
            } else if (typeof props.size === 'string') {
                return [props.size, props.size]
            } else {
                return props.size.map(size => {
                    return typeof size === 'number' || isNaN(Number(size)) ? `${size}px` : size
                }) as [string, string]
            }
        })
        const loading = ref(true)
        const error = ref(false)
        watch(() => props.src, () => {
            loading.value = true
            error.value = false
            if (!props.src) {
                loading.value = false
                error.value = false
                return
            }
            const img = new Image()
            img.src = props.src
            img.onabort = () => {
                error.value = true
                loading.value = false
            }
            img.onerror = () => {
                error.value = true
                loading.value = false
            }
            img.onload = () => {
                error.value = false
                loading.value = false
            }
        }, {
            immediate: true
        })
        return () => (
            <div class="wp-avatar" style={{
                width: size.value[0],
                height: size.value[1],
                fontSize: `calc(${size.value[1]} / 2)`,
                borderRadius: props.borderRadius,
                background: props.background,
                color: props.color
            }}>
                {
                    loading.value ? (
                        slots.loading?.() || (
                            <Icon>
                                <UserOutlined />
                            </Icon>
                        )
                    ) : null
                }
                {
                    !loading.value && error.value ? (
                        slots.error?.() || (
                            <Icon>
                                <UserDeleteOutlined />
                            </Icon>
                        )
                    ) : null
                }
                {
                    !loading.value && !error.value ? (
                        props.src ? (
                            slots.default?.() || (
                                <img src={ props.src } style={{
                                    objectFit: props.contain
                                }} alt={ props.alt } />
                            )
                        ) : (
                            slots.empty?.() || (
                                <Icon>
                                    <UserOutlined />
                                </Icon>
                            )
                            
                        )
                    ) : null
                }
            </div>
        )
    }
})