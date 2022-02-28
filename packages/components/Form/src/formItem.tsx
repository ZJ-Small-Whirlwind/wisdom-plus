import {
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onBeforeUnmount,
    onMounted,
    provide,
    reactive,
    ref,
    toRefs,
    watch,
    nextTick,
    Transition
} from 'vue'
import { NOOP } from '@vue/shared'
import AsyncValidator from 'async-validator'
import { addUnit, getPropByPath } from '@wisdom-plus/utils/util'
import { isValidComponentSize } from '@wisdom-plus/utils/validators'
import { elFormItemKey, elFormKey } from '@wisdom-plus/tokens'
import { useSize } from '@wisdom-plus/hooks'
import LabelWrap from './labelWrap'

import type { PropType, CSSProperties } from 'vue'
import type { ComponentSize } from '@wisdom-plus/utils/types'
import type { ElFormContext, ValidateFieldCallback } from '@wisdom-plus/tokens'
import type { FormItemRule } from './form.type'

export default defineComponent({
    name: 'WpFormItem',
    componentName: 'WpFormItem',
    props: {
        label: String,
        labelWidth: {
            type: [String, Number],
            default: '',
        },
        prop: String,
        required: {
            type: Boolean,
            default: undefined,
        },
        rules: [Object, Array] as PropType<FormItemRule | FormItemRule[]>,
        error: String,
        validateStatus: String,
        for: String,
        inlineMessage: {
            type: [String, Boolean],
            default: '',
        },
        showMessage: {
            type: Boolean,
            default: true,
        },
        size: {
            type: String as PropType<ComponentSize>,
            validator: isValidComponentSize,
        },
    },
    setup(props, { slots }) {
        const elForm = inject(elFormKey, {} as ElFormContext)
        const validateState = ref('')
        const validateMessage = ref('')
        const isValidationEnabled = ref(false)

        const computedLabelWidth = ref('')

        const formItemRef = ref<HTMLDivElement>()

        const vm = getCurrentInstance()
        const isNested = computed(() => {
            let parent = vm?.parent
            while (parent && parent.type.name !== 'ElForm') {
                if (parent.type.name === 'ElFormItem') {
                    return true
                }
                parent = parent.parent
            }
            return false
        })

        let initialValue = undefined

        watch(
            () => props.error,
            (val) => {
                validateMessage.value = val || ''
                validateState.value = val ? 'error' : ''
            },
            {
                immediate: true,
            }
        )
        watch(
            () => props.validateStatus,
            (val) => {
                validateState.value = val || ''
            }
        )

        const labelFor = computed(() => props.for || props.prop)
        const labelStyle = computed(() => {
            const ret: CSSProperties = {}
            if (elForm.labelPosition === 'top') return ret
            const labelWidth = addUnit(props.labelWidth || elForm.labelWidth)
            if (labelWidth) {
                ret.width = labelWidth
            }
            return ret
        })
        const contentStyle = computed(() => {
            const ret: CSSProperties = {}
            if (elForm.labelPosition === 'top' || elForm.inline) {
                return ret
            }
            if (!props.label && !props.labelWidth && isNested.value) {
                return ret
            }
            const labelWidth = addUnit(props.labelWidth || elForm.labelWidth)
            if (!props.label && !slots.label) {
                ret.marginLeft = labelWidth
            }
            return ret
        })
        const fieldValue = computed(() => {
            const model = elForm.model
            if (!model || !props.prop) {
                return
            }

            let path = props.prop
            if (path.indexOf(':') !== -1) {
                path = path.replace(/:/, '.')
            }

            return getPropByPath(model, path, true).v
        })
        const isRequired = computed(() => {
            const rules = getRules()
            let required = false

            if (rules && rules.length) {
                rules.every((rule) => {
                    if ((rule as any).required) {
                        required = true
                        return false
                    }
                    return true
                })
            }
            return required
        })
        const sizeClass = useSize(undefined, { formItem: false })

        const validate = (
            trigger: string,
            callback: ValidateFieldCallback = NOOP
        ) => {
            if (!isValidationEnabled.value) {
                callback()
                return
            }
            const rules = getFilteredRule(trigger)
            if ((!rules || rules.length === 0) && props.required === undefined) {
                callback()
                return
            }
            validateState.value = 'validating'
            const descriptor = {}
            if (rules && rules.length > 0) {
                rules.forEach((rule) => {
                    delete rule.trigger
                })
            }
            if (props.prop === undefined) return
            descriptor[props.prop] = rules
            const validator = new AsyncValidator(descriptor)
            const model = {}
            model[props.prop] = fieldValue.value
            validator.validate(model, { firstFields: true }, (errors, fields) => {
                validateState.value = !errors ? 'success' : 'error'
                validateMessage.value = errors
                    ? errors[0].message || `${props.prop} is required`
                    : ''
                // fix: #3860 after version 3.5.2, async-validator also return fields if validation fails
                callback(validateMessage.value, errors ? fields : {})
                elForm.emit?.(
                    'validate',
                    props.prop,
                    !errors,
                    validateMessage.value || null
                )
            })
        }

        const clearValidate = () => {
            validateState.value = ''
            validateMessage.value = ''
        }
        const resetField = () => {
            const model = elForm.model
            const value = fieldValue.value
            let path = props.prop as string
            if (path.indexOf(':') !== -1) {
                path = path.replace(/:/, '.')
            }
            const prop = getPropByPath(model, path, true) as any
            if (Array.isArray(value)) {
                prop.o[prop.k] = [].concat(initialValue as any)
            } else {
                prop.o[prop.k] = initialValue
            }
            nextTick(() => {
                clearValidate()
            })
        }

        const getRules = () => {
            const formRules = elForm.rules
            const selfRules = props.rules
            const requiredRule =
                props.required !== undefined ? { required: !!props.required } : []

            const prop = getPropByPath(formRules, props.prop || '', false)
            const normalizedRule = formRules ? (prop.o as any)[props.prop || ''] || prop.v : []

            return [].concat(selfRules || normalizedRule || []).concat(requiredRule as any)
        }
        const getFilteredRule = (trigger) => {
            const rules = getRules()

            return rules
                .filter((rule: any) => {
                    if (!rule.trigger || trigger === '') return true
                    if (Array.isArray(rule.trigger)) {
                        return rule.trigger.indexOf(trigger) > -1
                    } else {
                        return rule.trigger === trigger
                    }
                })
                .map((rule: any) => ({ ...rule }))
        }

        const evaluateValidationEnabled = () => {
            isValidationEnabled.value = !!getRules()?.length
        }

        const updateComputedLabelWidth = (width: string | number) => {
            computedLabelWidth.value = width ? `${width}px` : ''
        }

        const elFormItem = reactive({
            ...toRefs(props),
            size: sizeClass,
            validateState,
            $el: formItemRef,
            evaluateValidationEnabled,
            resetField,
            clearValidate,
            validate,
            updateComputedLabelWidth,
        })

        onMounted(() => {
            if (props.prop) {
                elForm?.addField(elFormItem as any)

                const value = fieldValue.value
                initialValue = Array.isArray(value) ? [...value] : value as any

                evaluateValidationEnabled()
            }
        })
        onBeforeUnmount(() => {
            elForm?.removeField(elFormItem as any)
        })

        provide(elFormItemKey, elFormItem as any)

        const formItemClass = computed(() => [
            {
                'wp-form-item--feedback': elForm.statusIcon,
                'is-error': validateState.value === 'error',
                'is-validating': validateState.value === 'validating',
                'is-success': validateState.value === 'success',
                'is-required': isRequired.value || props.required,
                'is-no-asterisk': elForm.hideRequiredAsterisk,
            },
            sizeClass.value ? `wp-form-item--${sizeClass.value}` : '',
        ])

        const shouldShowError = computed(() => {
            return (
                validateState.value === 'error' &&
                props.showMessage &&
                elForm.showMessage
            )
        })

        const currentLabel = computed(
            () => (props.label || '') + (elForm.labelSuffix || '')
        )

        return {
            formItemRef,
            formItemClass,
            shouldShowError,
            elForm,
            labelStyle,
            contentStyle,
            validateMessage,
            labelFor,
            resetField,
            clearValidate,
            currentLabel,
        }
    },
    render() {
        return (
            <div ref="formItemRef" class={[
                'wp-form-item',
                this.formItemClass
            ]}>
                <LabelWrap
                    isAutoWidth={this.labelStyle.width === 'auto'}
                    updateAll={this.elForm.labelWidth === 'auto'}
                >
                    {
                        (this.label || this.$slots.label) ? (
                            <label
                                for={this.labelFor}
                                class="wp-form-item__label"
                                style={this.labelStyle}
                            >
                                {
                                    this.$slots.label?.({ label: this.currentLabel }) || this.currentLabel
                                }
                            </label>
                        ) : null
                    }
                </LabelWrap>
                <div class="wp-form-item__content" style={this.contentStyle}>
                    { this.$slots.default?.() }
                    <Transition name="el-zoom-in-top">
                        {
                            this.shouldShowError && (
                                this.$slots.error?.({ error: this.validateMessage }) || (
                                    <div
                                        class={[
                                            'wp-form-item__error',
                                            {
                                                'wp-form-item__error--inline':
                                                typeof this.inlineMessage === 'boolean'
                                                    ? this.inlineMessage
                                                    : this.elForm.inlineMessage || false,
                                            }
                                        ]}
                                    >
                                        { this.validateMessage }
                                    </div>
                                )
                            )
                        }
                    </Transition>
                </div>
            </div>
        )
    }
})