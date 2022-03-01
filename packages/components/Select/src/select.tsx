import {defineComponent, ExtractPropTypes, ref, onMounted} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
import WpInput from "../../Input"
export const selectProps = buildProps({

})
export type SelectProps = ExtractPropTypes<typeof selectProps>
export default defineComponent({
    name:"WpSelect",
    props:selectProps,
    setup(){
        const input = ref(null);
        const inputClick = ()=>{
            console.log(input.value)
        }
        return {
            input,
            inputClick
        }
    },
    render(){
        return (<div class={{
            'wp-select':true
        }}>
            <WpInput ref={'input'} class={{
                'wp-select-input':true
            }} onClick={this.inputClick}></WpInput>
        </div>)
    }
})
