import { configSymbol } from "@wisdom-plus/utils/config"
import { defineComponent, provide, toRefs } from "vue"

export * from './utils'
import { configProviderProps } from './utils'

export default defineComponent({
    name: 'WpConfigProvider',
    inheritAttrs: false,
    props: configProviderProps,
    setup(props) {
        const propsRef = toRefs(props)
        provide(configSymbol, propsRef)
    },
    render() {
        return (
            <>
                { this.$slots.default?.() }
            </>
        )
    }
})