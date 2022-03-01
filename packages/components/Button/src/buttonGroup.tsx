import {defineComponent, inject, provide} from "vue"
import { buttonGroupContextKey } from '@wisdom-plus/tokens'
import { buttonEmits, buttonProps } from '@wisdom-plus/components/button/src/button'
export default defineComponent({
    name:"WpButtonGroup",
    props:buttonProps,
    setup(props){
        provide(buttonGroupContextKey, props);
    },
    render(props){
        return (<div class={{
            'wp-button-group': true,
        }}>
            {this.$slots.default?.()}
        </div>)
    }
})
