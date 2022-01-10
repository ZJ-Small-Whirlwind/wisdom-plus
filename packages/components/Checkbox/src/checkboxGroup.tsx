import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { computed, defineComponent, ExtractPropTypes, PropType, provide, ref, toRef } from "vue"

import Space, { spaceProps } from '../../Space'

const checkboxGroupSelf = buildProps({
    modelValue: {
        type: Array as PropType<(string | number | symbol)[]>,
        default: undefined
    },
    disabled: Boolean,
    size: {
        type: String as PropType<'small' | 'default' | 'large'>,
        default: 'default'
    },
    spaceSize: spaceProps['size']
})

export const checkboxGroupProps = {
    ...spaceProps,
    ...checkboxGroupSelf
}

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>

export default defineComponent({
    name: 'WpCheckboxGroup',
    props: checkboxGroupProps,
    emits: {
        'update:modelValue': (value: (string | number | symbol)[]) =>  Array.isArray(value)
    },
    setup(props, { slots, emit }) {
        const checkboxListRef = ref<(string | number | symbol)[]>([])
        const checkboxList = useAutoControl(checkboxListRef, props, 'modelValue', emit, {
            passive: true,
            deep: true
        })
        provide('wp-checkbox-list', checkboxList)
        provide('wp-checkbox-disabled', toRef(props, 'disabled'))
        provide('wp-checkbox-size', toRef(props, 'size'))
        const spacePropsMap = computed(() => {
            const spacePropsTemp: Partial<CheckboxGroupProps> = { ...props }
            delete spacePropsTemp.modelValue
            delete spacePropsTemp.disabled
            delete spacePropsTemp.size
            return spacePropsTemp
        })
        return () => (
            <Space {...spacePropsMap.value} size={props.spaceSize}>
                { slots.default?.() }
            </Space>
        )
    }
})