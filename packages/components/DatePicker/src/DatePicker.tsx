import {defineComponent, ExtractPropTypes, ref, nextTick, watch, computed, onMounted, provide} from "vue"
import dayjs from "dayjs";
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar from "../../Calendar";
export const datePickerProps = buildProps({
    modelValue:{type:[String, Array, Date, Number],default:null},
    format:{type:String, default:"YYYY-MM-DD"},
})
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
export default defineComponent({
    name:"WpDatePicker",
    props:datePickerProps,
    setup(props,{emit}){
        provide("notClearInputValue", true)
        provide("notClearInputValueFormat", props.format)
        const options:any = ref([]);
        const currentValue:any = ref(null);
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const onClickDay = ({year, month, date})=>{
            refSelect.value.show = false;
            const value = dayjs(new Date(year.value,month.value-1,date.value)).format(props.format)
            if(value === 'Invalid Date'){
                options.value = [];
                nextTick(()=>{
                    currentValue.value = null;
                })
            }else {
                options.value = [
                    {label:value,value},
                ];
                nextTick(()=>{
                    currentValue.value = value;
                })
            }

        }
        const getDate = (date)=>{
            const d = dayjs(date, props.format);
            return {
                year:ref(d.year()),
                month:ref(d.month()+1),
                date:ref(d.date()),
                hour:ref(d.hour()),
                minute:ref(d.minute()),
                second:ref(d.second()),
            }
        }
        const currentValueParse = computed(()=>getDate(currentValue.value || new Date()))

        onMounted(()=>{
            currentValue.value = props.modelValue;
        })
        watch(computed(()=>props.modelValue),()=>{
            onClickDay(getDate(props.modelValue));
        })
        watch(currentValue,()=>{
            nextTick(()=>{
                emit("update:modelValue", currentValue.value)
            })
        })
        watch(computed(()=>refSelect.value && refSelect.value.show),val=>{
            if(val){
                nextTick(()=>{
                    refCalendar.value.year = currentValueParse.value.year.value;
                    refCalendar.value.month = currentValueParse.value.month.value;
                    refCalendar.value.date = currentValueParse.value.date.value;
                })
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
