import { buildProps } from "@wisdom-plus/utils/props"
import { defineComponent, ExtractPropTypes } from "vue"

export const tableProps = buildProps({
    stripe: Boolean,
    border: Boolean
})

export type TableProps = ExtractPropTypes<typeof tableProps>

export default defineComponent({
    name: 'WpTable',
    props: tableProps,
    setup() {

    },
    render() {
        return (
            <div class={'wp-table'}>
                <table class={{
                    'wp-table--body': true,
                    'wp-table--stripe': this.stripe,
                    'wp-table--border': this.border
                }}>
                  { this.$slots.default?.() }
                </table>
            </div>
        )
    }
})