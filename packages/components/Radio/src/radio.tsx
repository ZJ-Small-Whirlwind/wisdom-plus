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
import { CheckOutlined } from '@vicons/antd'

export const radiopProps = buildProps({
    modelValue: {
        type: [Boolean, String, Number, Symbol] as PropType<string | number | symbol | boolean>,
        default: undefined
    },
    value: {
        type: [Boolean, String, Number, Symbol] as PropType<string | number | symbol | boolean>
    },
    label: {
        type: String
    },
    disabled: Boolean,
    size: {
        type: String as PropType<'small' | 'default' | 'large'>
    },
    borderRadius: {
        type: String,
        default: '50%'
    }
})

export type RadiopProps = ExtractPropTypes<typeof radiopProps>

export default defineComponent({
    name: 'WpRadio',
    props: radiopProps,
    emits: {
        'update:modelValue': (value: string | number | symbol | boolean) => {
            void value
            return true
        }
    },
    setup(props, { slots, emit }) {
        const checkedRef = ref<string | number | symbol | boolean>(false)
        const checkedControl = useAutoControl(checkedRef, props, 'modelValue', emit)
        const checkedValue = inject<Ref<string | number | symbol | boolean> | false>(
            'wp-radio-value',
            false
        )
        const checked = computed<boolean>({
            get() {
                if (checkedValue) {
                    return checkedValue.value === props.value
                } else {
                    if (props.value !== undefined) {
                        return checkedControl.value === props.value
                    } else {
                        return Boolean(checkedControl.value)
                    }
                }
            },
            set(value) {
                if (checkedValue) {
                    if (!props.value) return
                    checkedValue.value = props.value
                } else {
                    if (props.value !== undefined) {
                        checkedControl.value = props.value
                    } else {
                        checkedControl.value = value
                    }
                }
            }
        })
        /**
         * disabled
         */
        const disabledInject = inject<Ref<boolean>>('wp-radio-disabled', ref(false))
        const disabled = computed(() => {
            return disabledInject.value || props.disabled
        })
        const sizeInject = inject<Ref<boolean> | false>('wp-radio-size', false)
        return () => (
            <div
                class={{
                    'wp-radio': true,
                    'wp-radio__checked': checked.value,
                    'wp-radio__disabled': disabled.value,
                    [`wp-radio__${props.size ? props.size : ( sizeInject ? sizeInject.value : 'default' )}`]: true
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
                        'wp-radio--box': true,
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
                        ) : slots.unchecked?.()
                    }
                </div>
                {
                    slots.default || props.label ? (
                        <span class={"wp-radio--label"}>
                            { slots.default?.() || props.label }
                        </span>
                    ) : null
                }
            </div>
        )
    }
})