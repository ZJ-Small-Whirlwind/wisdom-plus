import { useFormItem } from "@wisdom-plus/hooks"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { addUnit } from "@wisdom-plus/utils/util"
import { computed, CSSProperties, defineComponent, ExtractPropTypes, ref, watch } from "vue"

export const switchProps = buildProps({
    modelValue: null,
    activeValue: {
        default: true
    },
    inactiveValue: {
        default: false
    },
    activeColor: String,
    inactiveColor: String,
    width: {
        type: [String, Number]
    },
    height: {
        type: [String, Number]
    },
    borderRadius: {
        type: [String, Number]
    },
    disabled: Boolean
})

export type SwitchProps = ExtractPropTypes<typeof switchProps>

export default defineComponent({
    name: 'WpSwitch',
    props: switchProps,
    emits: {
        'update:modelValue': (value?: any) => (void value, true),
        'change': (value?: any) => (void value, true)
    },
    setup(props, { emit }) {
        const modelRef = ref<any>(false)
        const model = useAutoControl(modelRef, props, 'modelValue', emit)

        const active = computed(() => model.value === props.activeValue)

        const formItem = useFormItem({})

        watch(model, () => {
            formItem.formItem?.validate('change')
            emit('change', model.value)
        })

        return {
            model,
            active
        }
    },
    render() {
        return (
            <div
                class={[
                    'wp-switch',
                    {
                        'wp-switch--active': this.active,
                        'wp-switch--disabled': this.disabled
                    }
                ]}
                style={{
                    '--wp-switch-active-color': this.activeColor || '',
                    '--wp-switch-inactive-color': this.inactiveColor || '',
                    '--wp-switch-width': addUnit(this.width) || '',
                    '--wp-switch-height': addUnit(this.height) || '',
                    '--wp-switch-border-radius': addUnit(this.borderRadius) || ''
                } as CSSProperties}
                onClick={() => {
                    if (this.disabled) return
                    if (this.model === this.activeValue) {
                        this.model = this.inactiveValue
                    } else {
                        this.model = this.activeValue
                    }
                }}
            >
                <div class="wp-switch--button">
                </div>
            </div>
        )
    }
})