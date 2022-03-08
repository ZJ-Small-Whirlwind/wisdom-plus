import { buildProps } from "@wisdom-plus/utils/props"
import { ref, computed, defineComponent, ExtractPropTypes, watch, onMounted } from "vue"

import ProCascader, { proCascaderProps, cascaderDefaultProps, getCascaderItems } from "../../Pro/Cascader"
import BasicSelect from "../../BasicSelect"
import { useAutoControl } from "@wisdom-plus/utils/use-control"

export const cascaderProps = buildProps({
    modelValue: null,
    multiple: Boolean,
    menus: proCascaderProps['menus'],
    props: proCascaderProps['props'],
    disabled: Boolean,
    showPopoverWhenDisabled: {
        type: Boolean,
        default: true
    },
    placeholder: proCascaderProps['placeholder'],
    clearable: Boolean
})

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>

export default defineComponent({
    name: 'WpCascader',
    props: cascaderProps,
    emits: {
        'update:modelValue': (value: unknown | unknown[]) => ((void value, true))
    },
    setup(props, { emit }) {
        const input = ref()
        const cascaderProps = computed(() => {
            const final = { ...cascaderDefaultProps }
            Object.assign(final, props.props)
            return final
        })

        const cascaderRef = ref<null | InstanceType<typeof ProCascader>>(null)

        const modelRef = ref()
        const model = useAutoControl(modelRef, props, 'modelValue', emit)
        const tags = ref<string[]>([])

        watch(() => props.multiple, () => {
            if (props.multiple) {
                input.value = ''
            } else {
                tags.value = []
            }
        })

        const updateValue = () => {
            const items = getCascaderItems(cascaderProps.value, !props.multiple, model.value, props.menus)
            if (props.multiple) {
                tags.value = items?.map(item => {
                    return String((item as Record<any, unknown>)[cascaderProps.value.title] || (item as Record<any, unknown>)[cascaderProps.value.key])
                }) || []
            } else {
                const item = items?.[0]
                if (!item) {
                    input.value = ''
                    return
                }
                input.value = String((item as Record<any, unknown>)[cascaderProps.value.title] || (item as Record<any, unknown>)[cascaderProps.value.key])
            }
        }

        onMounted(updateValue)

        watch(() => props.menus, updateValue, {
            deep: true
        })

        watch(model, updateValue, {
            deep: true
        })

        const clearable = computed(() => {
            return props.clearable && (input.value || tags.value.length > 0)
        })

        return {
            input,
            cascaderProps,
            tags,
            model,
            cascaderRef,
            updateValue,
            clearable
        }
    },
    render() {
        return (
            <BasicSelect
                modelValue={this.tags}
                v-model:input={this.input}
                placeholder={this.placeholder || '请选择'}
                showPopoverWhenDisabled={this.showPopoverWhenDisabled}
                class="wp-cascader"
                popoverProps={{
                    class: 'wp-cascader--popover',
                    width: 'target'
                }}
                readonly
                disabled={this.disabled}
                clearable={this.clearable}
                onClear={() => {
                    if (!this.multiple) {
                        this.model = ''
                    } else {
                        this.model = []
                    }
                }}
            >
                <ProCascader
                    ref="cascaderRef"
                    v-model={this.model}
                    props={this.props}
                    menus={this.menus}
                    useRadio={!this.multiple}
                    useCheckbox={this.multiple}
                    disabled={this.disabled}
                    preset={'compact'}
                    editable={false}
                    onChange={this.updateValue}
                />
            </BasicSelect>
        )
    }
})