import { defineComponent, onMounted } from "vue"

export default defineComponent({
    props: {
        loading: Boolean,
        loadingText: String,
        error: Boolean,
        errorText: String,
        finished: Boolean,
        finishedText: String,
        virtual: Boolean
    },
    emits: {
        load: () => true
    },
    setup(props, { emit }) {
        onMounted(() => {
            if (props.virtual) emit('load')
        })
    },
    render() {
        return (
            <>
                {
                    this.loading ? (
                        this.$slots.loading?.() || this.loadingText
                    ) : (
                        this.error ? (
                            this.$slots.error?.() || this.errorText
                        ) : (
                            this.finished ? (
                                this.$slots.finished?.() || this.finishedText
                            ) : null
                        )
                    )
                }
            </>
        )
    }
})