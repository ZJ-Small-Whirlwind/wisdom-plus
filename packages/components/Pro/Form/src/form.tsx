import { defineComponent, ref, computed, markRaw, h, ExtractPropTypes, Component } from 'vue'
import { useVModel } from '@vueuse/core'
import type { PropType } from 'vue'
import type { Schema } from './interface'
import type { GridProps } from '../../../Grid'
import { WpForm, WpFormItem } from '../../../Form'
import WpGrid from '../../../Grid'
import WpGridItem from '../../../GridItem'
import { buildProps, definePropType } from '@wisdom-plus/utils/props'

export const proFormProps = buildProps({
    enterToSubmit: {
        type: Boolean,
        default: false
    },
    schemas: {
        type: Array as PropType<Schema[]>,
        default: () => []
    },
    modelValue: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({})
    },
    grid: Object as PropType<Partial<GridProps>>,
    initReset: Boolean,
    rules: Object as PropType<Record<string, any>>,
    props: Object as PropType<Record<string, any>>,
    labelWidth: definePropType<string | number>([String, Number]),
    plain: Boolean
})

export type ProFormProps = ExtractPropTypes<typeof proFormProps>

export const proFormGenerate = (name = 'WpProForm',Form: Component = WpForm, FormItem: Component = WpFormItem) => {
    const FormRender = Form as any
    const FormItemRender = FormItem as any
    return defineComponent({
        name,
        props: proFormProps,
        emits: {
            submit: () => true,
            'update:modelValue': (value: Record<string, any>) => typeof value === 'object'
        },
        setup(props, { emit }) {
            const formRef = ref<any>(null)
            const data = useVModel(props, 'modelValue', emit, { passive: true, deep: true })
            const schemaHandle = (schema: Schema) => {
                const newSchema: Partial<Schema> = { ...schema }
                delete newSchema.grid
                delete newSchema.componentProps
                delete newSchema.component
                delete newSchema.raw
                delete newSchema.plain
                return newSchema as Record<string, any>
            }
            const schemasMap = computed(() => {
                return props.schemas.map(schema => {
                    const componentProps = schema.componentProps || {}
                    if (!('placehoder' in componentProps) && schema.label) componentProps.placeholder = `请输入${schema.label}`
                    let component = schema.component
                    if (component && typeof component === 'object') {
                        component = markRaw(component)
                    }
                    return {
                        ...schema,
                        component,
                        componentProps,
                        formItemProp: schemaHandle(schema)
                    }
                })
            })
            const rulesMap = computed(() => {
                const newRules: Record<string, any> = {}
                props.schemas.forEach(schema => {
                    newRules[schema.prop] = props.rules?.[schema.prop] || []
                    if (schema.required) {
                        const rule = {
                            required: true,
                            message: `请输入${schema.label || ''}`
                        }
                        if (Array.isArray(newRules[schema.prop])) {
                            newRules[schema.prop].push(rule)
                        } else {
                            newRules[schema.prop] = [
                                newRules[schema.prop],
                                rule
                            ]
                        }
                    }
                })
                return newRules
            })
            const reset = () => {
                formRef.value?.resetFields()
                for (const schema of props.schemas) {
                    if (typeof schema.defaultValue === 'function') {
                        data.value[schema.prop] = schema.defaultValue()
                    } else {
                        data.value[schema.prop] = schema.defaultValue
                    }
                }
            }
            const submit = (isEnter = false, e?: Event) => {
                e?.preventDefault()
                if (isEnter && !props.enterToSubmit) return
                formRef.value?.validate(vaild => {
                    if (!vaild) return
                    emit('submit')
                })
            }
            const getSlotName = (schema: Schema) => {
                return schema.prop
            }
            if (props.initReset) reset()
            return {
                reset,
                submit,
                data,
                rulesMap,
                formRef,
                schemasMap,
                getSlotName
            }
        },
        expose: [
            'reset',
            'submit',
            'formRef'
        ],
        render() {
            const renderContent = (schema: Schema) => {
                return ('plain' in schema ? !schema.plain : !this.plain) ? (
                    this.$slots[this.getSlotName(schema)]?.(schema) || (schema.component && h(schema.component as any, {
                        ...schema.componentProps,
                        [schema.model || 'modelValue']: this.data[schema.prop],
                        [`onUpdate:${schema.model || 'modelValue'}`]: (value: unknown) => this.data[schema.prop] = value
                    }))
                ) : (
                    this.$slots[`${schema.prop}_plain`]?.() || this.data[schema.prop]
                )
            }
            return (
                <FormRender
                    ref="formRef"
                    validateOnRuleChange={false}
                    { ...this.props }
                    model={this.data}
                    rules={this.rulesMap}
                    onKeydown={e => {
                        if (e.code === 'Enter') {
                            this.submit(true, e)
                        }
                    }}
                >
                    <WpGrid defaultSpan={24} { ...this.grid }>
                        {
                            this.schemasMap.map(schema => (
                                <WpGridItem key={schema.prop} {...schema.grid}>
                                    {
                                        !schema.hide && (
                                            !schema.raw ? (
                                                <FormItemRender
                                                    labelWidth={this.labelWidth}
                                                    {...schema.formItemProp}
                                                    prop={schema.noVaild ? '' : schema.prop}
                                                >
                                                    {renderContent(schema)}
                                                </FormItemRender>
                                            ) : renderContent(schema)
                                        )
                                    }
                                </WpGridItem>
                            ))
                        }
                    </WpGrid>
                    <slot />
                </FormRender>
            )
        }
    })
}

export default proFormGenerate()