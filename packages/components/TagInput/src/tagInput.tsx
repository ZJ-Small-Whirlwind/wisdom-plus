import { defineComponent, PropType, ref, ExtractPropTypes, computed, nextTick, CSSProperties } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import Tag, { TagProps } from '../../Tag'

import Icon from '../../Icon'
import Space, { SpaceProps } from '../../Space'
import { CloseOutlined } from '@vicons/antd'

import { useFocus } from '@vueuse/core'

export const tagInputProps = buildProps({
    modelValue: {
        type: Array as PropType<string[]>,
        default: undefined
    },
    clearable: Boolean,
    tagProps: {
        type: Object as PropType<Partial<TagProps> & Record<string, any>>,
        default: () => ({})
    },
    placeholder: String,
    allowRepeat: Boolean,
    delimiter: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    readonly: Boolean,
    disabled: Boolean,
    size: {
        type: String as PropType<'small' | 'default' | 'medium' | 'large'>,
        default: 'default'
    },
    spaceProps: {
        type: Object as PropType<Partial<SpaceProps> & Record<string, any>>,
        default: () => ({})
    }
})

export type TagInputProps = ExtractPropTypes<typeof tagInputProps>

export default defineComponent({
    name: 'WpTagInput',
    props: tagInputProps,
    emits: {
        'update:modelValue': (value: string[]) => Array.isArray(value)
    },
    setup(props, { slots, emit }) {
        const valueRef = ref<string[]>([])
        const value = computed<string[]>({
            get() {
                if (typeof props.modelValue === 'undefined') return valueRef.value
                return props.modelValue
            },
            set(value) {
                if (typeof props.modelValue === 'undefined') {
                    valueRef.value = value
                } else {
                    emit('update:modelValue', value)
                }
            }
        })
        const inputingTag = ref('')
        const inputRef = ref<HTMLDivElement | null>(null)

        const { focused } = useFocus({
            target: inputRef
        })

        const regExp = computed(() => new RegExp(`[${props.delimiter.join('|')}]$`))

        const tagPush = (clear = true) => {
            if (props.allowRepeat || !value.value.includes(inputingTag.value)) {
                value.value.push(inputingTag.value)
            }
            if (clear) inputingTag.value = ''
        }
        return () => (
            <div class={{
                'wp-taginput': true,
                'wp-taginput-disabled': props.disabled,
                [`wp-taginput-${props.size}`]: true,
                'focus': focused.value
            }} onClick={() => {
                if (!focused.value && !props.disabled && !props.readonly) {
                    inputRef.value?.focus()
                }
            }}>
                <div class="wp-taginput__content">
                    <Space align="center" { ...props.spaceProps }>
                        {
                            value.value.map((item, index) => {
                                return slots.tag?.({
                                    tag: item,
                                    index,
                                    close: () => {
                                        value.value.splice(index, 1)
                                    }
                                }) || (
                                    <Tag
                                        size={props.size}
                                        closable={!props.readonly && !props.disabled}
                                        { ...props.tagProps }
                                        onClose={e => {
                                            e.stopPropagation()
                                            value.value.splice(index, 1)
                                        }}
                                    >
                                        { item }
                                    </Tag>
                                )
                            })
                        }
                        <div
                            key="inputRef"
                            ref={inputRef}
                            class={{
                                'wp-taginput__content-input': true,
                                'blank': !inputingTag.value
                            }}
                            style={{
                                '--wp-taginput-placehoder': `'${props.placeholder || ' '}'`
                            } as CSSProperties}
                            onInput={(e) => {
                                inputingTag.value = (e.target as HTMLDivElement).innerText
                                if (regExp.value.test(inputingTag.value)) {
                                    inputingTag.value = inputingTag.value.substring(0, inputingTag.value.length - 2)
                                    tagPush()
                                    nextTick(() => {
                                        inputRef.value?.focus()
                                    })
                                }
                            }}
                            onBlur={() => {
                                if (!inputingTag.value) return
                                tagPush()
                            }}
                            contenteditable={!props.readonly && !props.disabled ? 'plaintext-only' : 'false' as any}
                            onKeydown={e => {
                                if (e.code === 'Enter') {
                                    e.preventDefault()
                                    tagPush()
                                    nextTick(() => {
                                        inputRef.value?.focus()
                                    })
                                }
                            }}
                            v-text={inputingTag.value}
                        />
                    </Space>
                </div>
                {
                    props.clearable && value.value.length > 0 ? (
                        <div class="wp-taginput__clear">
                            <div class="wp-taginput__clear-icon" onClick={() => {
                                value.value = []
                            }}>
                                <Icon>
                                    { slots.closeIcon?.() || <CloseOutlined /> }
                                </Icon>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
})
