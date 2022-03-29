import { useNamespace } from "@wisdom-plus/utils/namespace";
import { buildProps } from "@wisdom-plus/utils/props";
import { defineComponent, ExtractPropTypes, Component, PropType } from "vue";
import Icon from '../../Icon'

export const resultProps = buildProps({
    message: String,
    description: String,
    icon: {
        type: String as PropType<string>,
        default: '✋'
    }
})

export type ResultProps = ExtractPropTypes<typeof resultProps>

export default defineComponent({
    name: 'WpResult',
    props: resultProps,
    setup() {
        const { basic, of } = useNamespace('result')

        return {
            basic,
            of
        }
    },
    render() {
        return (
            <div class={this.basic}>
                <div class={this.of('icon')}>
                    <Icon>{this.$slots.icon?.() || this.icon}</Icon>
                </div>
                {
                    (this.$slots.message || this.message) && (
                        <div class={this.of('message')}>
                            { this.$slots.message?.() || this.message }
                        </div>
                    )
                }
                {
                    (this.$slots.description || this.description) && (
                        <div class={this.of('description')}>
                            {this.$slots.description?.() || this.description }
                        </div>
                    )
                }
                { this.$slots.suffix?.() }
            </div>
        )
    }
})