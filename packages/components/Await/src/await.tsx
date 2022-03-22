import { buildProps } from "@wisdom-plus/utils/props"
import { ref, defineComponent, ExtractPropTypes, PropType, watchEffect } from "vue"

export const awaitProps = buildProps({
    promise: {
        type: Object as PropType<Promise<any>>
    }
})

export type AwaitProps = ExtractPropTypes<typeof awaitProps>

export enum AwaitStatus {
    Pending,
    Resolved,
    Rejected
}

export default defineComponent({
    name: 'WpAwait',
    props: awaitProps,
    setup(props) {
        const status = ref(AwaitStatus.Pending)
        const value = ref()
        const err = ref()

        watchEffect(() => {
            status.value = AwaitStatus.Pending
            if (!props.promise) return
            const promiseRecord = props.promise
            props.promise
                .then((res: any) => {
                    if (promiseRecord !== props.promise) return
                    value.value = res
                    status.value = AwaitStatus.Resolved
                })
                .catch((error: any) => {
                    if (promiseRecord !== props.promise) return
                    err.value = error
                    status.value = AwaitStatus.Rejected
                })
        })

        return {
            status,
            value,
            err
        }
    },
    render() {
        return (
            <>
                {
                    this.status === AwaitStatus.Pending ? this.$slots.default?.() : (
                        this.status === AwaitStatus.Resolved ? this.$slots.then?.({ value: this.value }) : (
                            this.$slots.catch?.({ error: this.err })
                        )
                    )
                }
            </>
        )
    }
})