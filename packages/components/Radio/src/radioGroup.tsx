import { useFormItem } from "@wisdom-plus/hooks"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { computed, defineComponent, ExtractPropTypes, PropType, provide, ref, toRef, watch } from "vue"

import Space, { spaceProps } from '../../Space'

const radioGroupSelf = buildProps({
    modelValue: {
        type: [String, Number, Symbol, Boolean] as PropType<string | number | symbol | boolean>,
        default: undefined
    },
    disabled: Boolean,
    size: {
        type: String as PropType<'small' | 'default' | 'large'>,
        default: 'default'
    },
    spaceSize: spaceProps['size']
})

export const radioGroupProps = {
    ...spaceProps,
    ...radioGroupSelf
}

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>

export default defineComponent({
    name: 'WpRadioGroup',
    props: radioGroupProps,
    emits: {
        'update:modelValue': (value: string | number | symbol) =>  {
            void value
            return true
        }
    },
    setup(props, { slots, emit }) {
        const radioValueRef = ref<string | number | symbol>()
        const radioValue = useAutoControl(radioValueRef, props, 'modelValue', emit)
        provide('wp-radio-value', radioValue)
        const { size, disabled, formItem } = useFormItem({ size: props.size as "small" | "large" | "medium" | "mini", disabled: props.disabled })
        provide('wp-radio-disabled', disabled)
        provide('wp-radio-size', size)
        const spacePropsMap = computed(() => {
            const spacePropsTemp: Partial<RadioGroupProps> = { ...props }
            delete spacePropsTemp.modelValue
            delete spacePropsTemp.disabled
            delete spacePropsTemp.size
            return spacePropsTemp
        })
        watch(radioValue, () => {
            formItem?.validate('change')
        })
        return () => (
            <Space {...spacePropsMap.value} size={props.spaceSize}>
                { slots.default?.() }
            </Space>
        )
    }
})