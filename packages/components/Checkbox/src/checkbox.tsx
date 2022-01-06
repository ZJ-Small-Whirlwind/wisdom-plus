import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import {
    computed,
    ref,
    inject,
    defineComponent,
    type ExtractPropTypes,
    type PropType,
    type Ref
} from "vue"
import Icon from '../../Icon'
import { CheckOutlined, MinusOutlined } from '@vicons/antd'

export const checkboxProps = buildProps({
    modelValue: {
        type: Boolean,
        default: undefined
    },
    value: {
        type: [String, Number, Symbol] as PropType<string | number | symbol>
    },
    label: {
        type: String
    },
    disabled: Boolean,
    indeterminate: Boolean,
    size: {
        type: String as PropType<'small' | 'default' | 'large'>
    },
    borderRadius: {
        type: String,
        default: '2px'
    }
})

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>

export default defineComponent({
    name: 'WpCheckbox',
    props: checkboxProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean'
    },
    setup(props, { slots, emit }) {
        const checkedRef = ref(false)
        const checkedControl = useAutoControl(checkedRef, props, 'modelValue', emit)
        const checkedList = inject<Ref<(string | number | symbol)[]> | false>(
            'wp-checkbox-list',
            false
        )
        const checked = computed<boolean>({
            get() {
                if (checkedList) {
                    return Boolean(props.value && checkedList.value.includes(props.value))
                } else {
                    return Boolean(checkedControl.value)
                }
            },
            set(value) {
                if (checkedList) {
                    if (!props.value) return
                    const index = checkedList.value.indexOf(props.value)
                    if (value) {
                        if (index > -1) return
                        checkedList.value.push(props.value)
                    } else {
                        checkedList.value.splice(index, 1)
                    }
                } else {
                    checkedControl.value = value
                }
            }
        })
        /**
         * disabled
         */
        const disabledInject = inject<Ref<boolean>>('wp-checkbox-disabled', ref(false))
        const disabled = computed(() => {
            return disabledInject.value || props.disabled
        })
        const sizeInject = inject<Ref<boolean> | false>('wp-checkbox-size', false)
        return () => (
            <div
                class={{
                    'wp-checkbox': true,
                    'wp-checkbox__checked': checked.value || props.indeterminate,
                    'wp-checkbox__disabled': disabled.value,
                    [`wp-checkbox__${props.size ? props.size : ( sizeInject ? sizeInject.value : 'default' )}`]: true
                }}
                tabindex={!disabled.value ? 0 : undefined}
                onClick={() => {
                    if (disabled.value) return
                    checked.value = !checked.value
                }}
                onKeydown={e => {
                    if ((e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space')) {
                        e.preventDefault()
                        checked.value = !checked.value
                    }
                }}
            >
                <div
                    class={{
                        'wp-checkbox--box': true,
                        'checked': checked.value
                    }}
                    style={{
                        borderRadius: props.borderRadius
                    }} 
                >
                    {
                        checked.value ? (
                            <Icon>
                                {
                                    slots.checked?.() || <CheckOutlined />
                                }
                            </Icon>
                        ) : (
                            props.indeterminate ? (
                                <Icon>
                                    {
                                        slots.indeterminate?.() || <MinusOutlined />
                                    }
                                </Icon>
                            ) : null
                        )
                    }
                </div>
                {
                    slots.default || props.label ? (
                        <span class={"wp-checkbox--label"}>
                            { slots.default?.() || props.label }
                        </span>
                    ) : null
                }
            </div>
        )
    }
})