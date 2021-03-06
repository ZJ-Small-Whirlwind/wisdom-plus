import { buildProps } from "@wisdom-plus/utils/props"
import { ref, computed, defineComponent, ExtractPropTypes, watch, onMounted } from "vue"

import ProCascader, { proCascaderProps, cascaderDefaultProps, getCascaderItems, CascaderMenu } from "../../Pro/Cascader"
import BasicSelect, { basicSelectProps } from "../../BasicSelect"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { useFormItem } from "@wisdom-plus/hooks"

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
    size: basicSelectProps['size'],
    max: basicSelectProps['max'],
    tagProps: basicSelectProps['tagProps'],
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
        const tags = ref<CascaderMenu[]>([])

        const stringTags = computed(() => {
            return tags.value.map(item => {
                return String((item as Record<any, unknown>)[cascaderProps.value.title] || (item as Record<any, unknown>)[cascaderProps.value.key])
            })
        })

        watch(() => props.multiple, () => {
            if (props.multiple) {
                input.value = ''
            } else {
                tags.value = []
            }
        })

        const { formItem } = useFormItem({})

        const getItems = () => {
            return getCascaderItems(cascaderProps.value, !props.multiple, model.value, props.menus)
        }

        const updateValue = () => {
            const items = getItems()
            if (props.multiple) {
                tags.value = items
            } else {
                const item = items?.[0]
                if (!item) {
                    input.value = ''
                    return
                }
                input.value = String((item as Record<any, unknown>)[cascaderProps.value.title] || (item as Record<any, unknown>)[cascaderProps.value.key])
            }
            formItem?.validate('change')
        }

        onMounted(updateValue)

        watch(() => props.menus, updateValue, {
            deep: true
        })

        watch(model, updateValue, {
            deep: true
        })

        const clearable = computed(() => {
            return props.clearable && Boolean(input.value || tags.value.length > 0)
        })

        const expends = ref<unknown[]>([])

        const handleOnShow = () => {
            if (expends.value.length > 0) return
        }

        return {
            input,
            cascaderProps,
            tags,
            model,
            cascaderRef,
            updateValue,
            clearable,
            getItems,
            expends,
            stringTags,
            handleOnShow
        }
    },
    expose: ['getItems'],
    render() {
        return (
            <BasicSelect
                modelValue={this.stringTags}
                v-model:input={this.input}
                placeholder={this.placeholder || '?????????'}
                showPopoverWhenDisabled={this.showPopoverWhenDisabled}
                class="wp-cascader"
                popoverProps={{
                    class: 'wp-cascader--popover',
                    width: 'target'
                }}
                readonly
                disabled={this.disabled}
                clearable={this.clearable}
                tagProps={this.tagProps}
                size={this.size}
                max={this.max}
                closable={!this.disabled}
                onClear={() => {
                    if (!this.multiple) {
                        this.model = ''
                    } else {
                        this.model = []
                    }
                }}
                onClose={index => {
                    if (Array.isArray(this.model)) {
                        const trustModel = this.tags[index]
                        const trustIndex = this.model.indexOf(trustModel[this.cascaderProps.key])
                        if (trustIndex > -1) this.model.splice(trustIndex, 1)
                    }
                }}
                onShow={this.handleOnShow}
                v-slots={this.$slots}
            >
                <ProCascader
                    ref="cascaderRef"
                    v-model={this.model}
                    v-model:expends={this.expends}
                    props={this.props}
                    menus={this.menus}
                    useRadio={!this.multiple}
                    useCheckbox={this.multiple}
                    disabled={this.disabled}
                    preset={'compact'}
                    editable={false}
                />
            </BasicSelect>
        )
    }
})