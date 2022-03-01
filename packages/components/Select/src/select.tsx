import {defineComponent, ExtractPropTypes} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
export const selectProps = buildProps({

})
export type SelectProps = ExtractPropTypes<typeof selectProps>
export default defineComponent({
    name:"WpSelect",
    props:selectProps,
    setup(){

    },
    render(){
        return (<div>asdas</div>)
    }
})
