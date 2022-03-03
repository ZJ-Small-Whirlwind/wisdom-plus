import { buildProps } from "@wisdom-plus/utils/props"
import { ref, defineComponent, PropType, Component, ExtractPropTypes, watch } from "vue"
import Input from '../../Input'
import Icon from '../../Icon'
import { CaretUpFilled, CaretDownFilled, PlusOutlined, MinusOutlined } from '@vicons/antd'
import { useAutoControl } from "@wisdom-plus/utils/use-control"

export const inputNumberProps = buildProps({
    modelValue: {
        type: Number as PropType<number>
    },
    validateEvent: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    readonly: Boolean,
    suffix: Object as PropType<Component>,
    prefix: Object as PropType<Component>,
    size: {
        type: String as PropType<'small' | 'default' | 'medium' | 'large'>,
        default: 'default'
    },
    autofocus: Boolean,
    tabindex: [String, Number],
    name: String,
    min: Number,
    max: Number,
    step: {
        type: Number,
        default: 1
    },
    stepStrictly: Boolean,
    controls: {
        type: [Boolean, String] as PropType<boolean | 'right' | 'both'>,
        default: true
    },
    precision: {
        type: Number
    }
})

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>

export default defineComponent({
    name: 'WpInputNumber',
    props: inputNumberProps,
    emits: {
        'update:modelValue': (value?: number) => {
            void value
            return true
        },
        'blur': (e: Event) => {
            void e
            return true
        },
        'focus': (e: Event) => {
            void e
            return true
        },
        'change': (e: Event) => {
            void e
            return true
        }
    },
    setup(props, { emit }) {
        const valueRef = ref<number>()
        const model = useAutoControl(valueRef, props, 'modelValue', emit)

        const value = ref(model.value)

        watch(model, () => {
            if (model.value === undefined) return
            if (props.max && model.value > props.max) model.value = props.max
            if (props.min && model.value < props.min) model.value = props.min
            value.value = model.value
        }, {
            immediate: true
        })

        const changeByStep = (add = true) => {
            if (props.readonly || props.disabled) return
            if (add) {
                value.value = (value.value || 0) + props.step
            } else {
                value.value = (value.value || 0) - props.step
            }
            model.value = value.value
        }

        return {
            value,
            model,
            changeByStep
        }
    },
    render() {
        return (
            <div class={[
                'wp-input-number',
                {
                    'wp-input-number--controls-right': this.controls === 'right' || this.controls === true,
                    'wp-input-number--controls-both': this.controls === 'both'
                }
            ]}>
                {
                    this.controls === 'both' && (
                        <button class="wp-input-number--control wp-input-number--control-left" onClick={() => this.changeByStep(false)}>
                            <Icon><MinusOutlined/></Icon>
                        </button>
                    )
                }
                <Input
                    type="number"
                    modelValue={String(this.value)}
                    onUpdate:modelValue={value => this.value = Number(value)}
                    validateEvent={this.validateEvent}
                    disabled={this.disabled}
                    readonly={this.readonly}
                    clearable={false}
                    suffix={this.suffix}
                    prefix={this.prefix}
                    size={this.size}
                    autofocus={this.autofocus}
                    tabindex={this.tabindex}
                    name={this.name}
                    min={this.min}
                    max={this.max}
                    step={this.stepStrictly ? this.step : undefined}
                    onBlur={e => this.$emit('blur', e)}
                    onFocus={e => this.$emit('focus', e)}
                    onChange={e => {
                        const delta = (this.value || 0) - (this.model || 0)
                        if (this.precision !== undefined) {
                            this.value = Number((this.value || 0).toFixed(this.precision))
                        }
                        if (!this.stepStrictly || delta % this.step === 0) {
                            this.model = this.value
                            this.$emit('change', e)
                        } else if (delta !== 0) {
                            const valueMore = (this.value || 0) + this.step - delta % this.step
                            const valueLess = (this.value || 0) - this.step - delta % this.step
                            const deltaMore = Math.abs(valueMore - (this.value || 0))
                            const deltaLess = Math.abs(valueLess - (this.value || 0))
                            if (deltaMore >= deltaLess) {
                                this.value = valueLess
                            } else {
                                this.value = valueMore
                            }
                            this.model = this.value
                            this.$emit('change', e)
                        }
                    }}
                    v-slots={this.$slots}
                />
                {
                    this.controls === 'right' || this.controls === true && (
                        <div class="wp-input-number--controls">
                            <button class="wp-input-number--control" onClick={() => this.changeByStep(true)}>
                                <Icon><CaretUpFilled/></Icon>
                            </button>
                            <button class="wp-input-number--control" onClick={() => this.changeByStep(false)}>
                                <Icon><CaretDownFilled /></Icon>
                            </button>
                        </div>
                    )
                }
                {
                    this.controls === 'both' && (
                        <button class="wp-input-number--control wp-input-number--control-right" onClick={() => this.changeByStep(true)}>
                            <Icon><PlusOutlined/></Icon>
                        </button>
                    )
                }
            </div>
        )
    }
})