import {defineComponent, ExtractPropTypes, ref, nextTick} from "vue"
import dayjs from "dayjs";
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar from "../../Calendar";
export const datePickerProps = buildProps({

})
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
export default defineComponent({
    name:"WpDatePicker",
    props:datePickerProps,
    setup(){
        const options:any = ref([]);
        const currentValue = ref("");
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const onClickDay = ({year, month, date})=>{
            refSelect.value.show = false;
            const value = dayjs(new Date(year.value,month.value-1,date.value)).format("YYYY-MM-DD")
            options.value = [
                {label:value,value},
            ];
            nextTick(()=>{
                currentValue.value = value;
            })
        }
        return {
            onClickDay,
            refCalendar,
            refSelect,
            currentValue,
            options,
        }
    },
    render(){
        return (
            <div class={{
                "wp-date-picker": true
            }}>
                <WpSelect clearable filterable v-model={this.currentValue} options={this.options} ref={'refSelect'} PopoverConfig={{
                    popoverClass:"wp-date-picker-panel-popover"
                }} v-slots={{
                    panel:()=>(
                        <WpCalendar ref={'refCalendar'} onClickDay={this.onClickDay}>
                        </WpCalendar>
                    )
                }}>
                </WpSelect>
            </div>
        )
    }
})
