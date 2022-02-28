import {
  computed,
  defineComponent,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import { elFormKey } from '@wisdom-plus/tokens'
import { debugWarn } from '@wisdom-plus/utils/error'
import { useSize } from '@wisdom-plus/hooks'
import type { ValidateFieldsError } from 'async-validator'

import type { PropType } from 'vue'
import type { ComponentSize } from '@wisdom-plus/utils/types'
import type { FormRulesMap } from './form.type'
import type {
  ElFormItemContext as FormItemCtx,
  ValidateFieldCallback,
} from '@wisdom-plus/tokens'

function useFormLabelWidth() {
  const potentialLabelWidthArr = ref<any[]>([])
  const autoLabelWidth = computed(() => {
    if (!potentialLabelWidthArr.value.length) return '0'
    const max = Math.max(...potentialLabelWidthArr.value)
    return max ? `${max}px` : ''
  })

  function getLabelWidthIndex(width: number) {
    const index = potentialLabelWidthArr.value.indexOf(width)
    if (index === -1) {
      debugWarn('Form', `unexpected width ${width}`)
    }
    return index
  }

  function registerLabelWidth(val: number, oldVal: number) {
    if (val && oldVal) {
      const index = getLabelWidthIndex(oldVal)
      potentialLabelWidthArr.value.splice(index, 1, val)
    } else if (val) {
      potentialLabelWidthArr.value.push(val)
    }
  }

  function deregisterLabelWidth(val: number) {
    const index = getLabelWidthIndex(val)
    index > -1 && potentialLabelWidthArr.value.splice(index, 1)
  }

  return {
    autoLabelWidth,
    registerLabelWidth,
    deregisterLabelWidth,
  }
}

export interface Callback {
  (isValid?: boolean, invalidFields?: ValidateFieldsError): void
}

export default defineComponent({
  name: 'WpForm',
  props: {
    model: Object,
    rules: Object as PropType<FormRulesMap>,
    labelPosition: String,
    labelWidth: {
      type: [String, Number],
      default: '',
    },
    labelSuffix: {
      type: String,
      default: '',
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String as PropType<ComponentSize>,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true,
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false,
    },
    scrollToError: Boolean,
  },
  emits: ['validate'],
  setup(props, { emit }) {
    const fields: FormItemCtx[] = []

    watch(
      () => props.rules,
      () => {
        fields.forEach((field) => {
          field.evaluateValidationEnabled()
        })

        if (props.validateOnRuleChange) {
          validate(() => ({}))
        }
      }
    )

    const formSize = useSize()
    const prefix = 'wp-form'
    const formKls = computed(() => {
      const { labelPosition, inline } = props
      return [
        prefix,
        `${prefix}--${formSize.value}`,
        labelPosition ? `${prefix}--label-${labelPosition}` : '',
        inline ? `${prefix}--inline` : '',
      ]
    })

    const addField = (field: FormItemCtx) => {
      if (field) {
        fields.push(field)
      }
    }

    const removeField = (field: FormItemCtx) => {
      if (field.prop) {
        fields.splice(fields.indexOf(field), 1)
      }
    }

    const resetFields = () => {
      if (!props.model) {
        debugWarn('Form', 'model is required for resetFields to work.')
        return
      }
      fields.forEach((field) => {
        field.resetField()
      })
    }

    const clearValidate = (props: string | string[] = []) => {
      const fds = props.length
        ? typeof props === 'string'
          ? fields.filter((field) => props === field.prop)
          : fields.filter((field) => props.indexOf(field.prop || '') > -1)
        : fields
      fds.forEach((field) => {
        field.clearValidate()
      })
    }

    const validate = (callback?: Callback) => {
      if (!props.model) {
        debugWarn('Form', 'model is required for validate to work!')
        return
      }

      let promise: Promise<boolean> | undefined
      // if no callback, return promise
      if (typeof callback !== 'function') {
        promise = new Promise((resolve, reject) => {
          callback = function (valid, invalidFields) {
            if (valid) {
              resolve(true)
            } else {
              reject(invalidFields)
            }
          }
        })
      }

      if (fields.length === 0) {
        callback?.(true)
      }
      let valid = true
      let count = 0
      let invalidFields = {}
      let firstInvalidFields
      for (const field of fields) {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
            firstInvalidFields || (firstInvalidFields = field)
          }
          invalidFields = { ...invalidFields, ...field }
          if (++count === fields.length) {
            callback?.(valid, invalidFields)
          }
        })
      }
      if (!valid && props.scrollToError) {
        scrollToField(Object.keys(firstInvalidFields)[0])
      }
      return promise
    }

    const validateField = (
      props: string | string[],
      cb: ValidateFieldCallback
    ) => {
      props = [].concat(props as any)
      const fds = fields.filter((field) => props.indexOf(field.prop || '') !== -1)
      if (!fields.length) {
        debugWarn('Form', 'please pass correct props!')
        return
      }

      fds.forEach((field) => {
        field.validate('', cb)
      })
    }

    const scrollToField = (prop: string) => {
      fields.forEach((item) => {
        if (item.prop === prop) {
          item.$el.scrollIntoView()
        }
      })
    }

    const elForm = reactive({
      ...toRefs(props),
      resetFields,
      clearValidate,
      validateField,
      emit,
      addField,
      removeField,
      ...useFormLabelWidth(),
    })

    provide(elFormKey, elForm as any)

    return {
      formKls,
      validate, // export
      resetFields,
      clearValidate,
      validateField,
      scrollToField,
    }
  },
  render() {
    return (
      <form class={this.formKls}>
        { this.$slots.default?.() }
      </form>
    )
  }
})
