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
                time:ref(d.toDate().getTime()),
            }
        }
        const options:any = ref([]);
        const optionsStart:any = ref(null);
        const optionsEnd:any = ref(null);
        const currentValue:any = ref(null);
        const currentValueStart:any = ref(null);
        const currentValueEnd:any = ref(null);
        const daterangeValueCache:any = ref([]);
        const daterangeDayHoverValueCache:any = ref([]);
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const refCalendarEnd:any = ref(null)
        const refSelectEnd:any = ref(null)
        const isMultiple = computed(()=> props.type === 'dates');
        const isDaterange = computed(()=>["daterange"].includes(props.type))
        const currentValueCopy = ref(null);
        const currentDaterangeValues = computed(()=>daterangeValueCache.value.concat(daterangeDayHoverValueCache.value))
        const currentValueParse = computed(()=>{
            let dates = currentValue.value;
            if(isDaterange.value){
                dates = currentDaterangeValues.value;
            }
            if(isMultiple.value || isDaterange.value){
                const result = (dates || []).map(e=>getDate(e || new Date()));
                return isDaterange.value ? result.slice(0,2) : result;
            }else {
                return getDate((props.type === 'week' ? (dates || [])[0] : dates) || new Date())
            }
        })
        const WpCalendarWeekMaps = computed(()=>{
            return props.type === 'week' ? (currentValue.value || []).map(e=>getDate(e)) : null;
        })
        const showInputClass = ref(false);
        provide("showInputClass", showInputClass)
        provide("notClearInputValue", true)
        provide("notClearInputValueFormat", currentFormat.value)
        provide("WpCalendarActiveMaps", currentValueParse)
        provide("WpCalendarWeekMaps", WpCalendarWeekMaps)
        provide("WpCalendarIsDaterange", isDaterange)

        const daterangeClickDay = ({year, month, date})=>{
            const value = dayjs(new Date(year.value,month.value-1,date.value)).format(currentFormat.value)
            if(value === 'Invalid Date'){
                daterangeValueCache.value = [];
            }else {
                daterangeValueCache.value = (daterangeValueCache.value || []).concat([value]);
                if(daterangeValueCache.value.length > 2){
                    daterangeValueCache.value = [daterangeValueCache.value.at(-1)];
                }
                if(daterangeValueCache.value.length === 2){
                    currentValue.value = daterangeValueCache.value.map(e=>dayjs(e).toDate().getTime()).sort((a,b)=>a-b).map((time,k)=>{
                        return dayjs(k === 0  ? time : (time + 82800000 + 3540000 + 59000 + 900)).format(currentFormat.value);
                    });
                    refSelect.value.show = false;
                }
            }
            const time = (currentValue.value || [])
            const start = time[0] || null;
            const end = time[1] || null;
            if(start && start){
                optionsStart.value = [{label:start,value:start}];
                optionsEnd.value = [{label:end,value:end}];
            }else {
                optionsStart.value = [];
                optionsEnd.value = [];
            }
            nextTick(()=>{
                currentValueStart.value = start;
                currentValueEnd.value = end;
            })
        }
        const onClickDay = ({year, month, date})=>{
            if(!['dates','daterange'].includes(props.type)){
                refSelect.value.show = false;
            }
            if(['daterange'].includes(props.type)){
                daterangeClickDay({year, month, date});
            }
            if(['week','daterange'].includes(props.type)){
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
        const onDayMousemove = (d)=>{
            if(isDaterange.value){
                daterangeDayHoverValueCache.value = [dayjs(d.getDayAll).format(currentFormat.value)];
            }
        }
        const onDayMouseleave = (d)=>{
            if(isDaterange.value){
                // daterangeDayHoverValueCache.value = [];
            }
        }
        const disabledDate = (dayData)=>{
            let resUlt = false;
            const customDisabledDate = (props.calendarProps as any).disabledDate;
            if(Object.prototype.toString.call(customDisabledDate) === "[object Function]"){
                resUlt = customDisabledDate(dayData);
            }
            if(!resUlt && currentDaterangeValues.value.length >= 2 && isDaterange.value){
                try {
                    const times = (currentDaterangeValues.value || []).slice(0,2).map(e=>dayjs(e).toDate().getTime()).sort((a,b)=>a-b);
                    const curTime = dayData.date.toDate().getTime();
                    return  curTime < times[0]  || curTime > times[1];
                }catch (e) {
                    return resUlt
                }
            }
            return resUlt;
        }
        const onClear = ()=>{
            if(isDaterange.value){
                currentValue.value = null;
                currentValueStart.value = null;
                currentValueEnd.value = null;
                optionsStart.value = [];
                optionsEnd.value = [];
            }
            emit('clear')
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
                    if(isDaterange.value){
                        daterangeValueCache.value = (currentValue.value || []);
                        if(Object.prototype.toString.call(daterangeValueCache.value) === '[object Array]' && daterangeValueCache.value.length === 2){
                            const InitData = daterangeValueCache.value.map(e=>getDate(e))
                            refCalendar.value.year = InitData[0].year.value;
                            refCalendar.value.month = InitData[0].month.value;
                            refCalendar.value.date = InitData[0].date.value;
                            refCalendarEnd.value.year = InitData[1].year.value;
                            refCalendarEnd.value.month = InitData[1].month.value;
                            refCalendarEnd.value.date = InitData[1].date.value;
                        }else {
                            refCalendarEnd.value.month += 1;
                        }
                        return;
                    }
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
                daterangeValueCache.value = [];
                daterangeDayHoverValueCache.value = [];
                if(val.includes(true)){
                    showInputClass.value = true;
                    refSelect.value.show = true;
                }else {
                    refSelect.value.show = false;
                    showInputClass.value = false;
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
            onDayMousemove,
            onDayMouseleave,
            refCalendar,
            refSelect,
            refCalendarEnd,
            refSelectEnd,
            currentValue,
            currentValueStart,
            currentValueEnd,
            options,
            optionsStart,
            optionsEnd,
            isMultiple,
            onConfirm,
            isDaterange,
            disabledDate,
            currentDaterangeValues,
            onClear,
        }
    },
    render(){
        const WpCalendarRender = (bool)=>(
            <WpCalendar ref={bool ? 'refCalendar' : 'refCalendarEnd'}
                showPanel={this.showPanel}
                onClickDay={(d)=>this.onClickDay(d)}
                onWeekClick={this.onWeekClick}
                onGoDay={this.onGoDay}
                onDayMousemove={this.onDayMousemove}
                onDayMouseleave={this.onDayMouseleave}
                {...this.$props.calendarProps}
                type={this.$props.type}
                isActiveShow={bool}
                disabledDate={this.disabledDate}
                showAvailableStyle={(this.currentDaterangeValues || []).length >= 2 && this.isDaterange}
            >
        </WpCalendar>);
        const WpSelectRender = (bool)=>(
            <WpSelect clearable={this.clearable}
                      filterable={!this.isMultiple && this.filterable}
                      v-model={this[this.isDaterange ? (bool ? 'currentValueStart' : 'currentValueEnd'): 'currentValue']}
                      options={this[this.isDaterange ? (bool ? 'optionsStart' : 'optionsEnd'): 'options']}
                      ref={bool ? 'refSelect' : 'refSelectEnd'}
                      PopoverConfig={{
                          popoverClass:`wp-date-picker-panel-popover wp-date-picker-panel-popover-${this.$props.type}`
                      }}
                      {...this.$props.selectProps}
                      placeholder={this.$props.placeholder}
                      multiple={this.isMultiple}
                      disabled={this.$props.disabled}
                      collapseTags={this.isMultiple}
                      onClear={this.onClear}
                      v-slots={{
                          prefixIcon:()=>bool ? (<WpIcon class={{
                              "wp-date-picker-prefix-icon":true,
                          }}>
                              <DateRangeOutlined></DateRangeOutlined>
                          </WpIcon>) : null,
                          panel:()=>bool ? [
                              this.isDaterange ? (<div class={{
                                  "wp-date-picker-panel-popover-daterange":true,
                              }}>
                                  {WpCalendarRender(true)}
                                  {WpCalendarRender(false)}
                              </div>) : WpCalendarRender(true),
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
                "wp-date-picker": true,
                "wp-date-picker-multiple": this.isMultiple,
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
