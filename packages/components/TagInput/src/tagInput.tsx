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
    limit: Number,
    keyboardDelete: {
        type: Boolean,
        default: true
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

        const regExp = computed(() => new RegExp(`[${props.delimiter.join('')}]$`))

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

        const active = ref('')
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
                onKeydown={e => {
                    if (!props.keyboardDelete || props.disabled || props.readonly || !notLimited.value) return
                    if ((e.code === 'Delete' || e.code === 'Backspace') && active.value) {
                        const index = value.value.indexOf(active.value)
                        if (index > -1) {
                            value.value.splice(index, 1)
                            active.value = ''
                            nextTick(() => {
                                inputRef.value?.focus()
                            })
                        }
                    }
                }}
            >
                <div class="wp-taginput__content">
                    <Space size={[10, 5]} align="center" { ...props.spaceProps }>
                        {
                            tagsMap.value.map(tag => {
                                return (
                                    <div
                                        class={{
                                            'wp-taginput__tag': true,
                                            'active': active.value === tag.tag,
                                        }}
                                        onClick={() => {
                                            if (!props.keyboardDelete || props.disabled || props.readonly || tag.index === -1 || !notLimited.value) return
                                            if (active.value !== tag.tag) {
                                                active.value = tag.tag
                                            } else {
                                                active.value = ''
                                            }
                                        }}
                                        onMousedown={e => {
                                            if (props.disabled || props.readonly || tag.index === -1) return
                                            if (e.button === 1) {
                                                e.preventDefault()
                                                value.value.splice(tag.index, 1)
                                            }
                                        }}
                                    >
                                        {
                                            slots.tag?.(tag) || (
                                                <Tag
                                                    
                                                    size={props.size}
                                                    closable={!props.readonly && !props.disabled && tag.index !== -1}
                                                    { ...props.tagProps }
                                                    onClose={(e: Event) => {
                                                        e.stopPropagation()
                                                        value.value.splice(tag.index, 1)
                                                    }}
                                                >
                                                    { tag.tag }
                                                </Tag>
                                            )
                                        }
                                    </div>
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
                                active.value = ''
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
                                if (e.code === 'Backspace' || e.code === 'Delete') {
                                    if (!props.keyboardDelete || props.disabled || props.readonly || !notLimited.value) return
                                    if (active.value) return
                                    e.stopPropagation()
                                    if (!inputingTag.value && value.value.length > 0) {
                                        active.value = value.value[value.value.length - 1]
                                    }
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
