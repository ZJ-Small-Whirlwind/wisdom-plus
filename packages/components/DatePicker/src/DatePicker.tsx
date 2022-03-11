import {defineComponent, ExtractPropTypes} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar from "../../Calendar";
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
                <WpSelect PopoverConfig={{
                    popoverClass:"asda"
                }} v-slots={{
                    panel:()=>(
                        <WpCalendar>
                        </WpCalendar>
                    )
                }}>
                </WpSelect>
            </div>
        )
    }
})
