import { defineComponent, ExtractPropTypes, PropType, computed, ref, watch } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'

export const imageProps = buildProps({
    size: {
        type: [Number, String, Array] as PropType<number | string | [number | string, number | string]>
    },
    src: String,
    contain: {
        type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>
    },
    borderRadius: {
        type: String
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

export type ImageProps = ExtractPropTypes<typeof imageProps>

import { FileImageTwotone, FileImageOutlined } from '@vicons/antd'
import Icon from '../../Icon'

export default defineComponent({
    name: 'WpImage',
    props: imageProps,
    setup(props, { slots }) {
        const size = computed((): [string, string] => {
            if (!props.size) return ['', '']
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
        return () => {
            const imageVNode = (
                <img
                    src={ props.src }
                    style={{
                        objectFit: props.contain
                    }}
                    alt={ props.alt }
                />
            )
            return (
                <div class="wp-image" style={{
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
                                    <FileImageTwotone />
                                </Icon>
                            )
                        ) : null
                    }
                    {
                        !loading.value && error.value ? (
                            slots.error?.() || (
                                <Icon>
                                    <FileImageOutlined />
                                </Icon>
                            )
                        ) : null
                    }
                    {
                        !loading.value && !error.value ? (
                            props.src ? (
                                slots.default?.() || imageVNode
                            ) : (
                                slots.empty?.() || (
                                    <Icon>
                                        <FileImageOutlined />
                                    </Icon>
                                )
                            )
                        ) : null
                    }
                </div>
            )
        }
    }
})