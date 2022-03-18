import { useNamespace } from "@wisdom-plus/utils/namespace"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import {
    h,
    ref,
    computed,
    defineComponent,
    watch,
    PropType,
    type ExtractPropTypes,
    type Component
} from "vue"
import Icon from '../../Icon'
import { StarOutlined, StarFilled } from '@vicons/antd'
import { useFormItem } from "@wisdom-plus/hooks"

export const rateProps = buildProps({
    modelValue: Number,
    max: {
        type: Number,
        default: 5
    },
    showText: Boolean,
    readonly: Boolean,
    activeIcon: {
        type: Object as PropType<Component>
    },
    inactiveIcon: {
        type: Object as PropType<Component>
    }
})

export type RateProps = ExtractPropTypes<typeof rateProps>

export default defineComponent({
    name: 'WpRate',
    props: rateProps,
    emits: {
        'update:modelValue': (value: number) => (void value, true),
        'change': (value: number) => (void value, true)
    },
    setup(props, { emit }) {
        const { basic, is, of } = useNamespace('rate')

        const rateRef = ref(0)
        const rate = useAutoControl(rateRef, props, 'modelValue', emit)

        const { formItem } = useFormItem({})
        watch(rate, () => {
            formItem?.validate('change')
        })

        const active = ref(0)
        const stars = computed(() => {
            return new Array(props.max).fill(0).map((item, index) => {
                return {
                    rate: index + 1,
                    active: active.value > 0 ? active.value >= index + 1 : (rate.value || 0) >= index + 1,
                    valueActive: (rate.value || 0) >= index + 1,
                    hover: index + 1 === active.value
                }
            })
        })

        return {
            basic,
            stars,
            rate,
            of,
            is,
            active
        }
    },
    render() {
        return (
            <div
                class={this.basic}
                onMouseleave={() => {
                    if (this.readonly) return
                    this.active = 0
                }}
            >
                {
                    this.stars.map(star => (
                        <div
                            class={[
                                this.of('rate'),
                                {
                                    [this.is('active', this.of('rate'))]: star.valueActive || star.active,
                                    [this.is('hover', this.of('rate'))]: !this.readonly && star.hover
                                }
                            ]}
                            onMouseenter={() => {
                                if (this.readonly) return
                                this.active = star.rate
                            }}
                            onClick={() => {
                                if (this.readonly) return
                                this.rate = star.rate
                                this.$emit('change', this.rate)
                            }}
                        >
                            {
                                this.$slots.rate?.(star) ?? (
                                    <Icon class={this.of('icon', this.of('rate'))}>
                                        {
                                            !star.active ?
                                                ( this.inactiveIcon ? h(this.inactiveIcon) : <StarOutlined /> ) :
                                                ( this.activeIcon ? h(this.activeIcon) : <StarFilled /> )
                                        }
                                    </Icon>
                                )
                            }
                        </div>
                    ))
                }
                {
                    this.showText && (
                        <div class={this.of('text')}>
                            {
                                this.$slots.text?.({ rate: this.rate, active: this.active }) ?? (
                                    this.active || this.rate
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }
})