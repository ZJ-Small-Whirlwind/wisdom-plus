import {defineComponent, ExtractPropTypes, ref, nextTick, watch, computed, onMounted, provide, PropType} from "vue"
import dayjs from "dayjs";
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar, {calendarProps} from "../../Calendar";
import WpButton from "../../Button";
export const datePickerProps = buildProps({
    modelValue:{type:[String, Array, Date, Number],default:null},
    format:{type:String, default:null},
    clearable:{type:Boolean as PropType<boolean>, default:false},
    filterable:{type:Boolean as PropType<boolean>, default:false},
    showPanel:{type:Boolean as PropType<boolean>, default:false},
    calendarProps:{type:Object as PropType<object>, default:()=>({})},
    selectProps:{type:Object as PropType<object>, default:()=>({})},
    type:{type:String as PropType<string>, default:null},
    placeholder:{type:String as PropType<string>, default:null},
})
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
export default defineComponent({
    name:"WpDatePicker",
    props:datePickerProps,
    setup(props,{emit}){
        const currentFormat = computed(()=>{
            return props.format || {
                year:"YYYY",
                month:"YYYY-MM",
            }[props.type] || "YYYY-MM-DD";
        })
        provide("notClearInputValue", true)
        provide("notClearInputValueFormat", currentFormat.value)
        const options:any = ref([]);
        const currentValue:any = ref(null);
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const isMultiple = computed(()=> props.type === 'dates');
        const onClickDay = ({year, month, date})=>{
            if(props.type !== 'dates'){
                refSelect.value.show = false;
            }
            const value = dayjs(new Date(year.value,month.value-1,date.value)).format(currentFormat.value)
            if(value === 'Invalid Date'){
                options.value = [];
                nextTick(()=>{
                    currentValue.value = null;
                })
            }else {
                const opts = [
                    {label:value,value},
                ]
                if(isMultiple.value){
                    options.value = (options.value || []).concat(opts);
                    nextTick(()=>{
                        currentValue.value = (currentValue.value || []).concat([value]);
                    })
                }else {
                    options.value = opts;
                    nextTick(()=>{
                        currentValue.value = value;
                    })
                }

            }
        }
        const getDate = (date)=>{
            const d = dayjs(date, currentFormat.value);
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


        const onGoDay = (item)=>{
            refSelect.value.show = false;
            onClickDay(item);
        }

        const watchTypeInit = ()=>{
            switch (props.type){
                default:
                    break;
            }
        }

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
        watch(computed(()=> props.type),()=>{
            nextTick(()=>{
                watchTypeInit();
            })
        })
        onMounted(()=>{
            currentValue.value = props.modelValue;
            nextTick(()=>{
                watchTypeInit();
            })
        })
        return {
            onGoDay,
            onClickDay,
            refCalendar,
            refSelect,
            currentValue,
            options,
            isMultiple,
        }
    },
    render(){
        return (
            <div class={{
                "wp-date-picker": true
            }}>
                <WpSelect clearable={this.clearable}
                          filterable={this.filterable}
                          v-model={this.currentValue}
                          options={this.options}
                          ref={'refSelect'}
                          PopoverConfig={{
                                popoverClass:"wp-date-picker-panel-popover"
                          }}
                          {...this.$props.selectProps}
                          placeholder={this.$props.placeholder}
                          multiple={this.isMultiple}
                          v-slots={{
                            panel:()=>[
                                <WpCalendar ref={'refCalendar'}
                                            showPanel={this.showPanel}
                                            onClickDay={this.onClickDay}
                                            onGoDay={this.onGoDay}
                                            {...this.$props.calendarProps}
                                            type={this.$props.type}
                                >
                                </WpCalendar>,
                                <div class={{
                                    'wp-date-picker-footer':true
                                }}>
                                    <WpButton size={'mini'}>确定</WpButton>
                                </div>
                            ]
                        }}
                >
                </WpSelect>
            </div>
        )
    }
})
