import {defineComponent, ExtractPropTypes} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
export const datePickerProps = buildProps({

})
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
export default defineComponent({
    name:"WpDatePicker",
    props:datePickerProps,
    render(){
        return (
            <div class={{
                "wp-date-picker": true
            }}>
                asdas
            </div>
        )
    }
})
