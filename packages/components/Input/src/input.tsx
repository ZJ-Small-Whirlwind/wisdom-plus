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
import Popover from '../../Popover'
import Spin from '../../Spin'

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
    min: Number,
    max: Number,
    step: Number,
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
    },
    isSelect: {
        type: Boolean,
        default: false
    },
    autocomplete: Boolean,
    autocompleteList: {
        type: [Array, Function] as PropType<string[] | ((keyword: string) => Promise<string[]>)>
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
        },
        'focus': (e: Event) => {
            void e
            return true
        },
        'clear': (e: Event) => {
            void e
            return true
        },
        'change': (e: Event) => {
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
            return (props.isSelect || !props.readonly) && !disabled.value && input.value && props.clearable
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

        const autocompleteListMap = ref<string[]>([])
        const autocompleteLoading = ref(false)
        const autocompleteActive = ref(-1)
        watch(input, () => {
            nextTick(resizeTextarea)
            if (props.validateEvent) {
                formItem?.validate?.('change')
            }
        })

        watch([input, focused], async() => {
            if (!focused.value) return
            if (props.autocomplete && !props.disabled && !props.readonly) {
                try {
                    autocompleteLoading.value = true
                    if (!props.autocompleteList) {
                        autocompleteListMap.value = []
                    } else {
                        if (Array.isArray(props.autocompleteList)) {
                            if (!input.value) {
                                autocompleteListMap.value = props.autocompleteList
                            } else {
                                const regExp = new RegExp(input.value.trim(), 'i')
                                autocompleteListMap.value = props.autocompleteList.filter(item => regExp.test(item))
                            }
                        } else {
                            const inputingIs = input.value
                            const result = await props.autocompleteList(input.value || '')
                            if (inputingIs === input.value) {
                                autocompleteListMap.value = result
                            }
                        }
                    }
                } finally {
                    autocompleteActive.value = -1
                    autocompleteLoading.value = false
                }
            }
        }, {
            immediate: true
        })

        const onBlur = (event: Event) => {
            emit('blur', event)
            if (props.validateEvent) {
                formItem?.validate?.('blur')
            }
        }

        const onFocus = (event: Event) => {
            emit('focus', event)
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
            onFocus,
            textareaCalcStyle,
            autocompleteListMap,
            autocompleteLoading,
            autocompleteActive
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
                onFocus={this.onFocus}
                onChange={(e) => this.$emit('change', e)}
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
                onChange={(e) => this.$emit('change', e)}
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
        const Input = (
            <div class={[
                'wp-input',
                `wp-input-${this.size}`,
                {
                    'wp-input--disabled': this.disabled,
                    'wp-input--focused': this.focused
                }
            ]} {...this.$attrs} onKeydown={e => {
                if (!this.autocomplete || this.disabled || this.readonly) return
                if (e.code === 'ArrowDown') {
                    if (this.autocompleteActive === this.autocompleteListMap.length - 1) {
                        this.autocompleteActive = 0
                        return
                    }
                    this.autocompleteActive += 1
                }
                if (e.code === 'ArrowUp') {
                    if (this.autocompleteActive <= 0) {
                        this.autocompleteActive = this.autocompleteListMap.length - 1
                        return
                    }
                    this.autocompleteActive -= 1
                }
                if (e.code === 'Enter' && this.autocompleteActive >= 0) {
                    this.input = this.autocompleteListMap[this.autocompleteActive]
                    this.focused = false
                }
            }}>
                <div class={{
                    'wp-input--element-content':true
                }}>
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
                        {this.$slots.inputPrefix?.()}
                        {InputElement}
                        {Size}
                    </div>
                </div>
                {
                    (this.clearable || (this.showPasswordIcon && this.type === 'password') || this.suffix || this.$slots.suffix) && (
                        <div class="wp-input--suffix">
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
                                        <div class="wp-input__clear-icon" onClick={(ev) => {
                                            this.input = ''
                                            this.$emit('clear',ev);
                                        }}>
                                            <Icon>
                                                { this.$slots.clearIcon?.() || <CloseOutlined /> }
                                            </Icon>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                this.$slots.suffix?.() || (
                                    this.suffix && <Icon>{h(this.suffix)}</Icon>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
        return (
            this.autocomplete && !this.disabled && !this.readonly ? (
                <Popover
                    placement={'bottom'}
                    width={'target'}
                    v-model={this.focused}
                    trigger="none"
                    class="wp-autocompete"
                >
                    {{
                        reference: () => Input,
                        default: () => (
                            !this.autocompleteLoading ? (
                                this.autocompleteListMap.length === 0 ? (
                                    <div class="wp-autocompete-empty">
                                        暂无数据
                                    </div>
                                ) : (
                                    this.autocompleteListMap.map((item, index) => (
                                        <div class={[
                                            'wp-autocompete-cell',
                                            {
                                                'wp-autocompete-cell--active': this.autocompleteActive === index
                                            }
                                        ]} onClick={() => {
                                            this.input = item
                                        }} key={item}>
                                            { item }
                                        </div>
                                    ))
                                )
                            ) : (
                                <div class="wp-autocompete-empty">
                                    <Spin size="24" />
                                </div>
                            )
                        )
                    }}
                </Popover>
            ) : Input
        )
    }
})
