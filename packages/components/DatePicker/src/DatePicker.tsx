import {defineComponent, ExtractPropTypes, ref, nextTick, watch, computed} from "vue"
import dayjs from "dayjs";
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar from "../../Calendar";
export const datePickerProps = buildProps({
    format:{type:String, default:"YYYY-MM-DD"}
})
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
export default defineComponent({
    name:"WpDatePicker",
    props:datePickerProps,
    setup(props){
        const options:any = ref([]);
        const currentValue:any = ref(null);
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const onClickDay = ({year, month, date})=>{
            refSelect.value.show = false;
            const value = dayjs(new Date(year.value,month.value-1,date.value)).format(props.format)
            options.value = [
                {label:value,value},
            ];
            nextTick(()=>{
                currentValue.value = value;
            })
        }
        const currentValueParse = computed(()=>{
            console.log(dayjs(currentValue.value))
        })
        watch(computed(()=>refSelect.value && refSelect.value.show),val=>{
            if(val){
                console.log(currentValueParse.value)
            }
        })
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
