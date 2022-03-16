import {defineComponent, ExtractPropTypes, ref, nextTick, watch, computed, onMounted, provide, PropType} from "vue"
import dayjs from "dayjs";
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar, {calendarProps} from "../../Calendar";
import WpButton from "../../Button";
import WpIcon from "../../Icon";
import {DateRangeOutlined} from "@vicons/material";
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
    disabled:{type:Boolean as PropType<boolean>, default:false},
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
        const options:any = ref([]);
        const currentValue:any = ref(null);
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const refCalendarEnd:any = ref(null)
        const refSelectEnd:any = ref(null)
        const isMultiple = computed(()=> props.type === 'dates');
        const currentValueCopy = ref(null);
        const currentValueParse = computed(()=>{
            if(isMultiple.value){
                return (currentValue.value || []).map(e=>getDate(e || new Date()))
            }else {
                return getDate((props.type === 'week' ? (currentValue.value || [])[0] : currentValue.value) || new Date())
            }
        })
        const WpCalendarWeekMaps = computed(()=>{
            return props.type === 'week' ? (currentValue.value || []).map(e=>getDate(e)) : null;
        })
        provide("notClearInputValue", true)
        provide("notClearInputValueFormat", currentFormat.value)
        provide("WpCalendarActiveMaps", currentValueParse)
        provide("WpCalendarWeekMaps", WpCalendarWeekMaps)
        const isDaterange = computed(()=>["daterange"].includes(props.type))

        const onClickDay = ({year, month, date})=>{
            if(!['dates'].includes(props.type)){
                refSelect.value.show = false;
            }
            if(['week'].includes(props.type)){
                return;
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
                    const currentValueOld = (currentValue.value || []);
                    options.value = (options.value || []).concat(opts);
                    nextTick(()=>{
                        const index = currentValueOld.indexOf(value);
                        if(index === -1){
                            currentValueOld.push(value)
                        }else {
                            currentValueOld.splice(index,1);
                        }
                        currentValue.value = currentValueOld;
                    })
                }else {
                    options.value = opts;
                    nextTick(()=>{
                        currentValue.value = value;
                    })
                }
            }
        }



        const onGoDay = (item)=>{
            onClickDay(item);
            refSelect.value.show = false;
        }

        const watchTypeInit = ()=>{
            switch (props.type){
                default:
                    break;
            }
        }
        const init = ()=>{
            if(isMultiple.value){
                options.value = (props.modelValue || []).map(value=>({label:value,value}));
                nextTick(()=>{
                    currentValue.value = props.modelValue;
                })
            }else {
                onClickDay(getDate(props.modelValue));
            }
        }
        const onConfirm = ()=>{
            currentValueCopy.value = JSON.parse(JSON.stringify(currentValue.value));
            emit("update:modelValue", currentValue.value)
            refSelect.value.show = false;
        }
        const getYearWeek = (a, b, c)=> {
            /*
            date1是当前日期
            date2是当年第一天
            d是当前日期是今年第多少天
            用d + 当前年的第一天的周差距的和在除以7就是本年第几周
            */
            var date1 = new Date(a, parseInt(b) - 1, c),
                date2 = new Date(a, 0, 1),
                d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
            return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
        };
        const onWeekClick = (week)=>{
            if(props.type === 'week'){
                const values = week.map(e=>{
                    if(Object.prototype.toString.call(e) === '[object Object]'){
                        return e.date.format(currentFormat.value);
                    }else {
                        return dayjs(e).format(currentFormat.value);
                    }
                })
                emit("update:modelValue", values)
                const date = week[0];
                const value = `${date.dateYear} 第 ${getYearWeek(date.dateYear,date.dateMonth, date.day)} 周`;
                const opts = [
                    {label:value,value:values},
                ]
                options.value = opts;
                nextTick(()=>{
                    currentValue.value = values;
                });
            }
        }
        watch(computed(()=>props.modelValue),()=>{
            init()
        })
        watch(currentValue,()=>{
            nextTick(()=>{
                emit("update:modelValue", currentValue.value)
            })
        })
        watch(computed(()=>refSelect.value && refSelect.value.show),val=>{
            if(val){
                currentValueCopy.value = JSON.parse(JSON.stringify(currentValue.value));
                nextTick(()=>{
                    if(isMultiple.value){
                        const date = currentValueParse.value[currentValueParse.value.length - 1];
                        if(date){
                            refCalendar.value.year = date.year.value;
                            refCalendar.value.month = date.month.value;
                            refCalendar.value.date = date.date.value;
                        }
                    }else {
                        refCalendar.value.year = currentValueParse.value.year.value;
                        refCalendar.value.month = currentValueParse.value.month.value;
                        refCalendar.value.date = currentValueParse.value.date.value;
                    }
                })
            }else {
                if(isMultiple.value){
                    emit("update:modelValue", currentValueCopy.value)
                }
            }
        })
        watch(computed(()=> props.type),()=>{
            nextTick(()=>{
                watchTypeInit();
            })
        })
        watch(computed(()=>[
            refSelect.value && refSelect.value.show,
            refSelectEnd.value && refSelectEnd.value.show,
        ]),val=>{
            if(isDaterange.value){
                if(val.includes(true)){
                    console.log(val)
                    refSelect.value.show = true;
                }else {
                    refSelect.value.show = false;
                }
                refSelectEnd.value.show = false;
            }
        })
        onMounted(()=>{
            currentValue.value = props.modelValue;
            nextTick(()=>{
                watchTypeInit();
                init();
            })
        })
        return {
            onGoDay,
            onClickDay,
            onWeekClick,
            refCalendar,
            refSelect,
            refCalendarEnd,
            refSelectEnd,
            currentValue,
            options,
            isMultiple,
            onConfirm,
            isDaterange,
        }
    },
    render(){
        const WpSelectRender = (bool)=>(
            <WpSelect clearable={this.clearable}
                      filterable={this.filterable}
                      v-model={this.currentValue}
                      options={this.options}
                      ref={bool ? 'refSelect' : 'refSelectEnd'}
                      PopoverConfig={{
                          popoverClass:`wp-date-picker-panel-popover wp-date-picker-panel-popover-${this.$props.type}`
                      }}
                      {...this.$props.selectProps}
                      placeholder={this.$props.placeholder}
                      multiple={this.isMultiple}
                      disabled={this.$props.disabled}
                      v-slots={{
                          prefixIcon:()=>(<WpIcon class={{
                              "wp-date-picker-prefix-icon":true,
                          }}>
                              <DateRangeOutlined></DateRangeOutlined>
                          </WpIcon>),
                          panel:()=>bool ? [
                              <WpCalendar ref={bool ? 'refCalendar' : 'refCalendarEnd'}
                                          showPanel={this.showPanel}
                                          onClickDay={this.onClickDay}
                                          onWeekClick={this.onWeekClick}
                                          onGoDay={this.onGoDay}
                                          {...this.$props.calendarProps}
                                          type={this.$props.type}
                              >
                              </WpCalendar>,
                              this.isMultiple ?  <div class={{
                                  'wp-date-picker-footer':true
                              }}>
                                  <WpButton size={'mini'} onClick={this.onConfirm}>确定</WpButton>
                              </div> : null
                          ] : null
                      }}
            >
            </WpSelect>
        )
        return (
            <div class={{
                "wp-date-picker": true
            }}>
                { this.isDaterange ? (
                    <div class={{
                        'wp-date-picker-daterange':true,
                    }}>
                        {WpSelectRender(true)}
                        <span class={{
                            'wp-date-picker-daterange-symbol':true,
                        }}>至</span>
                        {WpSelectRender(false)}
                    </div>
                ) :
                    WpSelectRender(true)
                }
            </div>
        )
    }
})
