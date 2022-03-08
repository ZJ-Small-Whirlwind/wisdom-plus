import { defineComponent, PropType, ref, ExtractPropTypes, computed, nextTick, CSSProperties, watch, onMounted } from 'vue'

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
    },
    closable: Boolean
})

export type TagInputProps = ExtractPropTypes<typeof tagInputProps>

export const tagInputEmits = {
    'update:modelValue': (value: string[]) => Array.isArray(value),
    keydown: (e: KeyboardEvent) => ((void e, true)),
    input: (e: string) => ((void e, true)),
    blur: (e: Event) => ((void e, true)),
    focus: (e: Event) => ((void e, true)),
    close: (index: number) => ((void index, true))
}

export default defineComponent({
    name: 'WpTagInput',
    props: tagInputProps,
    emits: tagInputEmits,
    setup(props, { slots, emit }) {
        const valueRef = ref<string[]>([])
        const value = useAutoControl(valueRef, props, 'modelValue', emit, {
            passive: true,
            deep: true
        })
        const inputingTag = ref('')
        const inputRef = ref<HTMLDivElement | null>(null)

        const { size, disabled, formItem } = useFormItem({ size: props.size, disabled: props.disabled })

        watch(inputingTag, () => {
            emit('input', inputingTag.value)
        })

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
                        emit('close', index)
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

        onMounted(() => {
            if (inputRef.value) inputRef.value.innerText = inputingTag.value || ''
        })

        const toInput = (value: string) => {
            if (inputRef.value) {
                inputRef.value.innerText = value || ''
                inputingTag.value = value || ''
            }
        }

        return {
            disabled,
            size,
            focused,
            toInput,
            notLimited,
            inputRef,
            inputingTag,
            active,
            value,
            tagsMap,
            regExp,
            tagPush,
            formItem
        }
    },
    expose: ['toInput'],
    render() {
        return (
            <div
                class={{
                    'wp-taginput': true,
                    'wp-taginput-disabled': this.disabled,
                    [`wp-taginput-${this.size}`]: true,
                    'focus': this.focused
                }}
                onClick={() => {
                    if (!this.focused && !this.disabled && !this.readonly && this.notLimited) {
                        this.inputRef?.focus()
                    }
                }}
                onKeydown={e => {
                    if (!this.keyboardDelete || this.disabled || this.readonly || !this.notLimited || !this.auto) return
                    /**
                     * press Enter to copy value to input
                     */
                    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && this.active && this.inputRef) {
                        this.inputRef.innerText = this.active
                        this.inputingTag = this.active
                        nextTick(() => {
                            if (!this.inputRef) return
                            this.inputRef.focus()
                            const selection = window.getSelection()
                            const range = document.createRange()
                            range.selectNodeContents(this.inputRef)
                            if (!selection) return
                            selection.removeAllRanges()
                            selection.addRange(range)
                        })
                    }
                    /**
                     * press Delete to delete choosed one
                     */
                    if ((e.code === 'Delete' || e.code === 'Backspace') && this.active) {
                        const index = this.value?.indexOf(this.active) || -1
                        if (index > -1) {
                            this.$emit('close', index)
                            this.value?.splice(index, 1)
                            this.active = ''
                            nextTick(() => {
                                this.inputRef?.focus()
                            })
                        }
                    }
                }}
            >
                { this.$slots.prefix?.() }
                <div class="wp-taginput__content">
                    <Space size={[10, 5]} align="center" { ...this.spaceProps }>
                        {
                            this.tagsMap.map(tag => {
                                return (
                                    <div
                                        class={{
                                            'wp-taginput__tag': true,
                                            'active': tag.active,
                                        }}
                                        onClick={() => {
                                            if (!this.keyboardDelete || this.disabled || this.readonly || tag.index === -1 || !this.notLimited) return
                                            if (this.active !== tag.tag) {
                                                this.active = tag.tag
                                            } else {
                                                this.active = ''
                                            }
                                        }}
                                        onMousedown={e => {
                                            if (!this.closable && (this.disabled || this.readonly || tag.index === -1)) return
                                            /**
                                             * press Middle button to remove an item
                                             */
                                            if (e.button === 1) {
                                                e.preventDefault()
                                                this.$emit('close', tag.index)
                                                this.value?.splice(tag.index, 1)
                                            }
                                        }}
                                    >
                                        {
                                            this.$slots.tag?.(tag) || (
                                                <Tag

                                                    size={this.size}
                                                    closable={this.closable || (!this.readonly && !this.disabled && tag.index !== -1)}
                                                    onClose={(e: Event) => {
                                                        e.stopPropagation()
                                                        this.$emit('close', tag.index)
                                                        this.value?.splice(tag.index, 1)
                                                    }}
                                                    { ...this.tagProps }
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
                            ref="inputRef"
                            class={{
                                'wp-taginput__content-input': true,
                                'blank': !this.inputingTag
                            }}
                            style={{
                                '--wp-taginput-placehoder': `'${this.placeholder || ' '}'`,
                                minWidth: `${this.placeholder.length || 1}em`
                            } as CSSProperties}
                            onFocus={e => {
                                this.$emit('focus', e)
                            }}
                            onInput={e => {
                                const text = (e.currentTarget as HTMLDivElement).innerText
                                this.active = ''
                                if (!this.auto) {
                                    this.inputingTag = text
                                    return
                                }
                                if (this.regExp.test(text)) {
                                    this.inputingTag = text.substring(0, text.length - 1)
                                    this.tagPush()
                                    nextTick(() => {
                                        this.inputRef?.focus()
                                    })
                                } else {
                                    this.inputingTag = text
                                }
                                this.formItem?.validate?.('change')
                            }}
                            onBlur={e => {
                                this.$emit('blur', e)
                                if (!this.auto) return
                                if (!this.inputingTag) return
                                this.tagPush()
                                this.formItem?.validate?.('blur')
                            }}
                            contenteditable={!this.readonly && !this.disabled && this.notLimited ? 'true' : 'false'}
                            onKeydown={e => {
                                this.$emit('keydown', e)
                                if (!this.auto) return
                                /**
                                 * press Enter to push a value
                                 */
                                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                    e.preventDefault()
                                    if (!this.inputingTag) return
                                    e.stopPropagation()
                                    this.tagPush()
                                    nextTick(() => {
                                        this.inputRef?.focus()
                                    })
                                }
                                /**
                                 * press Delete to make a tag active
                                 */
                                if (e.code === 'Backspace' || e.code === 'Delete') {
                                    if (!this.keyboardDelete || this.disabled || this.readonly || !this.notLimited) return
                                    if (this.active || !this.value) return
                                    e.stopPropagation()
                                    if (!this.inputingTag && this.value.length > 0) {
                                        this.active = this.value[this.value.length - 1]
                                    }
                                }
                            }}
                        />
                    </Space>
                </div>
                {
                    this.$slots.closeIcon?.({
                        clearable: this.clearable && (this.value?.length || 0) > 0 && !this.readonly && !this.disabled,
                        clear: () => this.value = []
                    }) ?? (
                        this.clearable && (this.value?.length || 0) > 0 && !this.readonly && !this.disabled && (
                            <div class="wp-taginput__clear">
                                <div class="wp-taginput__clear-icon" onClick={() => {
                                    this.value = []
                                }}>
                                    <Icon>
                                        <CloseOutlined />
                                    </Icon>
                                </div>
                            </div>
                        )
                    )
                }
                { this.$slots.suffix?.() }
            </div>
        )
    }
})
