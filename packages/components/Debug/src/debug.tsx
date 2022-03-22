import { buildProps } from "@wisdom-plus/utils/props"
import dayjs from "dayjs"
import { defineComponent, createCommentVNode, watch } from "vue"

export const debugProps = buildProps({
    log: null,
    mark: String
})

export default defineComponent({
    name: 'WpDebug',
    inheritAttrs: false,
    props: debugProps,
    setup(props) {
        watch(() => props.log, () => {
            props.mark ? console.log(props.mark, props.log) : console.log(props.log)
        }, {
            immediate: true,
            deep: true
        })
    },
    render() {
        return (
            <>
                { createCommentVNode('debug') }
            </>
        )
    }
})