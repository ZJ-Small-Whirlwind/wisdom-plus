import { defineComponent, PropType, ref, ExtractPropTypes, computed, nextTick, CSSProperties } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import Tag, { TagProps } from '../../Tag'

import Icon from '../../Icon'
import Space, { SpaceProps } from '../../Space'
import { CloseOutlined } from '@vicons/antd'

import { useFocus } from '@vueuse/core'
import { useAutoControl } from '../../../utils/use-control'
import { useFormItem } from '@wisdom-plus/hooks'

export const tagInputProps = buildProps({
    modelValue: {
        type: Array as PropType<string[]>,
        default: undefined
    },
    input: {
        type: String
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
    },
    auto: {
        type: Boolean,
        default: true
    }
})

export type TagInputProps = ExtractPropTypes<typeof tagInputProps>

export default defineComponent({
    name: 'WpTagInput',
    props: tagInputProps,
    emits: {
        'update:modelValue': (value: string[]) => Array.isArray(value),
        'update:input': (value: string) => {
            void value
            return true
        },
        keydown: (e: KeyboardEvent) => ((void e, true)),
        input: (e: Event) => ((void e, true)),
        blur: (e: Event) => ((void e, true)),
        focus: (e: Event) => ((void e, true))
    },
    setup(props, { slots, emit }) {
        const valueRef = ref<string[]>([])
        const value = useAutoControl(valueRef, props, 'modelValue', emit, {
            passive: true,
            deep: true
        })
        const inputingTagRef = ref('')
        const inputingTag = useAutoControl(inputingTagRef, props, 'input', emit)
        const inputRef = ref<HTMLDivElement | null>(null)

        const { size, disabled, formItem } = useFormItem({ size: props.size, disabled: props.disabled })

        /**
         * Bind foucs of inputRef
         */
        const { focused } = useFocus({
            target: inputRef
        })

        /**
         * A RegExp to find string to be delimiter.
         */
        const regExp = computed(() => new RegExp(`[${props.delimiter.join('')}]$`))

        /**
         * @param clear 是否清除已经输入的内容
         * 
         * Add a tag
         */
        const tagPush = (clear = true) => {
            let text = inputingTag.value
            if (!props.modelValue) {
                emit('update:modelValue', [])
            }
            if (!value.value) {
                value.value = []
            }
            if (props.trim) {
                text = text?.trim() || ''
            }
            if (text && (props.allowRepeat || !value.value.includes(text))) {
                value.value.push(text)
            }
            if (clear) {
                if (inputRef.value?.innerText) inputRef.value.innerText = ''
                inputingTag.value = ''
            }
        }

        const active = ref('')

        /**
         * Tag Map, used when max is vaild
         */
        const tagsMap = computed(() => {
            let finalValue: string[] = []
            if (props.max) {
                finalValue = value.value?.slice(0, props.max) || []
            } else {
                finalValue = value.value || []
            }
            const final = finalValue.map((tag, index) => {
                return {
                    tag,
                    index,
                    close: () => {
                        value.value?.splice(index, 1)
                    },
                    active: active.value === tag
                }
            })
            if (props.max && props.max < (value.value?.length || 0)) final.push({
                tag: `${(value.value?.length || 0) - props.max}+`,
                index: -1,
                close: () => {},
                active: Boolean(props.limit && props.limit <= (value.value?.length || 0))
            })
            return final
        })

        const notLimited = computed(() => {
            return !props.limit || (value.value?.length || 0) < props.limit
        })
        return () => (
            <div
                class={{
                    'wp-taginput': true,
                    'wp-taginput-disabled': disabled.value,
                    [`wp-taginput-${size.value}`]: true,
                    'focus': focused.value
                }}
                onClick={() => {
                    if (!focused.value && !disabled.value && !props.readonly && notLimited.value) {
                        inputRef.value?.focus()
                    }
                }}
                onKeydown={e => {
                    if (!props.keyboardDelete || disabled.value || props.readonly || !notLimited.value) return
                    /**
                     * press Enter to copy value to input
                     */
                    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && active.value && inputRef.value) {
                        inputRef.value.innerText = active.value
                        inputingTag.value = active.value
                        nextTick(() => {
                            if (!inputRef.value) return
                            inputRef.value.focus()
                            const selection = window.getSelection()
                            const range = document.createRange()
                            range.selectNodeContents(inputRef.value)
                            if (!selection) return
                            selection.removeAllRanges()
                            selection.addRange(range)
                        })
                    }
                    /**
                     * press Delete to delete choosed one
                     */
                    if ((e.code === 'Delete' || e.code === 'Backspace') && active.value) {
                        const index = value.value?.indexOf(active.value) || -1
                        if (index > -1) {
                            value.value?.splice(index, 1)
                            active.value = ''
                            nextTick(() => {
                                inputRef.value?.focus()
                            })
                        }
                    }
                }}
            >
                { slots.prefix?.() }
                <div class="wp-taginput__content">
                    <Space size={[10, 5]} align="center" { ...props.spaceProps }>
                        {
                            tagsMap.value.map(tag => {
                                return (
                                    <div
                                        class={{
                                            'wp-taginput__tag': true,
                                            'active': tag.active,
                                        }}
                                        onClick={() => {
                                            if (!props.keyboardDelete || disabled.value || props.readonly || tag.index === -1 || !notLimited.value) return
                                            if (active.value !== tag.tag) {
                                                active.value = tag.tag
                                            } else {
                                                active.value = ''
                                            }
                                        }}
                                        onMousedown={e => {
                                            if (disabled.value || props.readonly || tag.index === -1) return
                                            /**
                                             * press Middle button to remove an item
                                             */
                                            if (e.button === 1) {
                                                e.preventDefault()
                                                value.value?.splice(tag.index, 1)
                                            }
                                        }}
                                    >
                                        {
                                            slots.tag?.(tag) || (
                                                <Tag
                                                    
                                                    size={size.value}
                                                    closable={!props.readonly && !disabled.value && tag.index !== -1}
                                                    { ...props.tagProps }
                                                    onClose={(e: Event) => {
                                                        e.stopPropagation()
                                                        value.value?.splice(tag.index, 1)
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
                                '--wp-taginput-placehoder': `'${props.placeholder || ' '}'`,
                                minWidth: `${props.placeholder.length || 1}em`
                            } as CSSProperties}
                            onFocus={e => {
                                emit('focus', e)
                            }}
                            onInput={e => {
                                emit('input', e)
                                if (!props.auto) return
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
                                formItem?.validate?.('change')
                            }}
                            onBlur={e => {
                                emit('blur', e)
                                if (!props.auto) return
                                if (!inputingTag.value) return
                                tagPush()
                                formItem?.validate?.('blur')
                            }}
                            contenteditable={!props.readonly && !disabled.value && notLimited.value ? 'true' : 'false'}
                            onKeydown={e => {
                                emit('keydown', e)
                                if (!props.auto) return
                                /**
                                 * press Enter to push a value
                                 */
                                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                    e.preventDefault()
                                    if (!inputingTag.value) return
                                    e.stopPropagation()
                                    tagPush()
                                    nextTick(() => {
                                        inputRef.value?.focus()
                                    })
                                }
                                /**
                                 * press Delete to make a tag active
                                 */
                                if (e.code === 'Backspace' || e.code === 'Delete') {
                                    if (!props.keyboardDelete || disabled.value || props.readonly || !notLimited.value) return
                                    if (active.value || !value.value) return
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
                    slots.closeIcon?.({
                        clearable: props.clearable && (value.value?.length || 0) > 0 && !props.readonly && !disabled.value,
                        clear: () => value.value = []
                    }) ?? (
                        props.clearable && (value.value?.length || 0) > 0 && !props.readonly && !disabled.value && (
                            <div class="wp-taginput__clear">
                                <div class="wp-taginput__clear-icon" onClick={() => {
                                    value.value = []
                                }}>
                                    <Icon>
                                        <CloseOutlined />
                                    </Icon>
                                </div>
                            </div>
                        )
                    )
                }
                { slots.suffix?.() }
            </div>
        )
    }
})
