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
    placeholder: {
        type: String,
        default: '请输入标签'
    },
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
    },
    max: Number,
    trim: Boolean,
    limit: Number
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
            let text = inputingTag.value
            if (props.trim) {
                text = text.trim()
            }
            if (text && (props.allowRepeat || !value.value.includes(text))) {
                value.value.push(text)
            }
            if (clear) {
                if (inputRef.value?.innerText) inputRef.value.innerText = ''
                inputingTag.value = ''
            }
        }

        const tagsMap = computed(() => {
            let finalValue: string[] = []
            if (props.max) {
                finalValue = value.value.slice(0, props.max)
            } else {
                finalValue = value.value
            }
            const final = finalValue.map((tag, index) => {
                return {
                    tag,
                    index,
                    close: () => {
                        value.value.splice(index, 1)
                    }
                }
            })
            if (props.max && props.max < value.value.length) final.push({
                tag: `${value.value.length - props.max}+`,
                index: -1,
                close: () => {}
            })
            return final
        })

        const notLimited = computed(() => {
            return !props.limit || value.value.length < props.limit
        })
        return () => (
            <div
                class={{
                    'wp-taginput': true,
                    'wp-taginput-disabled': props.disabled,
                    [`wp-taginput-${props.size}`]: true,
                    'focus': focused.value
                }}
                onClick={() => {
                    if (!focused.value && !props.disabled && !props.readonly && notLimited.value) {
                        inputRef.value?.focus()
                    }
                }}
            >
                <div class="wp-taginput__content">
                    <Space align="center" { ...props.spaceProps }>
                        {
                            tagsMap.value.map(tag => {
                                return slots.tag?.(tag) || (
                                    <Tag
                                        size={props.size}
                                        closable={!props.readonly && !props.disabled && tag.index !== -1}
                                        { ...props.tagProps }
                                        onClose={e => {
                                            e.stopPropagation()
                                            value.value.splice(tag.index, 1)
                                        }}
                                    >
                                        { tag.tag }
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
                                const text = (e.target as HTMLDivElement).innerText
                                if (regExp.value.test(text)) {
                                    inputingTag.value = text.substring(0, text.length - 1)
                                    tagPush()
                                    nextTick(() => {
                                        inputRef.value?.focus()
                                    })
                                } else {
                                    inputingTag.value = text
                                }
                            }}
                            onBlur={() => {
                                if (!inputingTag.value) return
                                tagPush()
                            }}
                            contenteditable={!props.readonly && !props.disabled && notLimited.value ? 'true' : 'false' as any}
                            onKeydown={e => {
                                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                    e.preventDefault()
                                    if (!inputingTag.value) return
                                    tagPush()
                                    nextTick(() => {
                                        inputRef.value?.focus()
                                    })
                                }
                            }}
                        />
                    </Space>
                </div>
                {
                    props.clearable && value.value.length > 0 && !props.readonly && !props.disabled ? (
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
