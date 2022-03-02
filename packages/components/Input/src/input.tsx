import { useFocus } from "@vueuse/core"
import { buildProps } from "@wisdom-plus/utils/props"
import { ref, defineComponent, ExtractPropTypes, computed, Component, PropType, h, CSSProperties, watch, nextTick } from "vue"
import Icon from '../../Icon'
import { CloseOutlined, EyeOutlined, EyeInvisibleOutlined } from '@vicons/antd'
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import {
    useFormItem,
} from '@wisdom-plus/hooks'
import { calcTextareaHeight } from './calc-textarea-height'

export const inputProps = buildProps({
    modelValue: {
        type: String,
        default: undefined
    },
    type: String,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: {
        type: String,
        default: '请输入'
    },
    rows: Number,
    clearable: Boolean,
    suffix: Object as PropType<Component>,
    prefix: Object as PropType<Component>,
    maxlength: Number,
    showWordSize: Boolean,
    size: {
        type: String as PropType<'small' | 'default' | 'medium' | 'large'>,
        default: 'default'
    },
    autofocus: Boolean,
    tabindex: [String, Number],
    name: String,
    showPasswordIcon: {
        type: Boolean,
        default: true
    },
    resize: {
        type: String as PropType<'none' | 'both' | 'horizontal' | 'vertical'>,
        default: 'vertical'
    },
    validateEvent: {
        type: Boolean,
        default: true
    },
    autosize: {
        type: [Boolean, Object] as PropType<boolean | { minRows?: number, maxRows?: number }>
    }
})

export type InputProps = ExtractPropTypes<typeof inputProps>

export default defineComponent({
    name: 'WpInput',
    props: inputProps,
    emits: {
        'update:modelValue': (value: string) => {
            void value
            return true
        },
        'blur': (e: Event) => {
            void e
            return true
        }
    },
    setup(props, { emit }) {
        const inputElementRef = ref<HTMLInputElement | HTMLTextAreaElement>()
        const { focused } = useFocus({ target: inputElementRef })

        const inputRef = ref('')
        const input = useAutoControl(inputRef, props, 'modelValue', emit)

        const { size, disabled, formItem } = useFormItem({ size: props.size, disabled: props.disabled })
        const clearable = computed(() => {
            return !props.readonly && !disabled.value && input.value && props.clearable
        })

        const showPassword = ref(true)

        const textareaCalcStyle = ref<Record<string, any>>({})

        const resizeTextarea = () => {
            const { type, autosize } = props

            if (type !== 'textarea') return

            if (autosize) {
                const minRows = typeof autosize === 'object' ? autosize.minRows : undefined
                const maxRows = typeof autosize === 'object' ? autosize.maxRows : undefined
                textareaCalcStyle.value = {
                    ...calcTextareaHeight((inputElementRef.value as HTMLTextAreaElement)!, minRows, maxRows),
                }
            } else {
                textareaCalcStyle.value = {
                    minHeight: calcTextareaHeight((inputElementRef.value as HTMLTextAreaElement)!).minHeight,
                }
            }
        }

        watch(input, () => {
            nextTick(resizeTextarea)
            if (props.validateEvent) {
                formItem?.validate?.('change')
            }
        })

        const onBlur = (event: Event) => {
            emit('blur', event)
            if (props.validateEvent) {
                formItem?.validate?.('blur')
            }
        }

        return {
            input,
            focused,
            inputElementRef,
            clearable,
            showPassword,
            size,
            disabled,
            resizeTextarea,
            onBlur,
            textareaCalcStyle
        }
    },
    render() {
        const InputElement = this.type !== 'textarea' ? (
            <input
                v-model={this.input}
                ref='inputElementRef'
                class="wp-input--field"
                type={this.type === 'password' ? this.showPassword ? 'password' : undefined : this.type}
                readonly={this.readonly || this.disabled}
                placeholder={this.placeholder}
                maxlength={this.maxlength}
                autocomplete={'off'}
                autofocus={this.autofocus}
                tabindex={this.tabindex}
                name={this.name}
                onBlur={this.onBlur}
            />
        ) : (
            <textarea
                v-model={this.input}
                ref='inputElementRef'
                class="wp-input--textarea"
                style={{
                    resize: this.resize || 'vertical',
                    ...this.textareaCalcStyle
                }}
                rows={this.rows}
                readonly={this.readonly || this.disabled}
                placeholder={this.placeholder}
                maxlength={this.maxlength}
                autofocus={this.autofocus}
                tabindex={this.tabindex}
                name={this.name}
                onBlur={this.onBlur}
            />
        )
        const Size = this.showWordSize && (
            <div class="wp-input--size">
                { this.input?.length || 0 } {
                    this.maxlength && (
                        `/ ${this.maxlength}`
                    )
                }
            </div>
        )
        return (
            <div class={[
                'wp-input',
                `wp-input-${this.size}`,
                {
                    'wp-input--disabled': this.disabled,
                    'wp-input--focused': this.focused
                }
            ]}>
                {
                    (this.prefix || this.$slots.prefix) && (
                        <div class="wp-input--prefix">
                            {
                                this.$slots.prefix?.() || (
                                    this.prefix && <Icon>{h(this.prefix)}</Icon>
                                )
                            }
                        </div>
                    )
                }
                <div class="wp-input--element">
                    {InputElement}
                    {Size}
                </div>
                {
                    (this.clearable || (this.showPasswordIcon && this.type === 'password') || this.suffix || this.$slots.suffix) && (
                        <div class="wp-input--suffix">
                            {
                                this.$slots.suffix?.() || (
                                    this.suffix && <Icon>{h(this.suffix)}</Icon>
                                )
                            }
                            {
                                this.showPasswordIcon && this.type === 'password' && (
                                    <div class="wp-input__password">
                                        <div class="wp-input__password-icon" onClick={() => {
                                            this.showPassword = !this.showPassword
                                        }}>
                                            <Icon>
                                                {
                                                    !this.showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined/>
                                                }
                                            </Icon>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                this.clearable && (
                                    <div class="wp-input__clear">
                                        <div class="wp-input__clear-icon" onClick={() => {
                                            this.input = ''
                                        }}>
                                            <Icon>
                                                { this.$slots.clearIcon?.() || <CloseOutlined /> }
                                            </Icon>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }
})