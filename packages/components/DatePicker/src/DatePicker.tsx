import {defineComponent, ExtractPropTypes, ref, nextTick, watch, computed, onMounted, provide, PropType} from "vue"
import dayjs from "dayjs";
import {buildProps} from "@wisdom-plus/utils/props";
import WpSelect from "../../Select";
import WpCalendar, {calendarProps} from "../../Calendar";
import WpButton from "../../Button";
import WpIcon from "../../Icon";
import WpTimePicker from "../../TimePicker";
import {DateRangeOutlined} from "@vicons/material";
export const datePickerProps = buildProps({
    modelValue:{type:[String, Array, Date, Number],default:null},
    format:{type:String, default:null},
    clearable:{type:Boolean as PropType<boolean>, default:false},
    filterable:{type:Boolean as PropType<boolean>, default:false},
    showPanel:{type:Boolean as PropType<boolean>, default:false},
    calendarProps:{type:Object as PropType<object>, default:()=>({})},
    selectProps:{type:Object as PropType<object>, default:()=>({})},
    timePickerProps:{type:Object as PropType<object>, default:()=>({})},
    type:{type:String as PropType<string>, default:null},
    placeholder:{type:[String, Array], default:null},
    disabled:{type:Boolean as PropType<boolean>, default:false},
    maxYearRange:{type:Number as PropType<number>, default:12},
})
export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
export default defineComponent({
    name:"WpDatePicker",
    inheritAttrs:false,
    props:datePickerProps,
    setup(props,{emit}){
        const timeFormat = ref('HH:mm:ss')
        const currentFormat = computed(()=>{
            return props.format || {
                year:"YYYY",
                month:"YYYY-MM",
                monthrange:"YYYY-MM",
                yearrange:"YYYY",
                // dateTime:"YYYY-MM-DD "+timeFormat.value,
                // datetimerange:"YYYY-MM-DD "+timeFormat.value,
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
                getYearMonth:ref(d.format("YYYY-MM"))
            }
        }
        const isValidTime = function (getTime = false):any{
            // @ts-ignore
            let value:any = this;
            const date = dayjs(dayjs().format("YYYY-MM-DD ")+value, timeFormat.value);
            if(getTime){
                return date.toDate().getTime()
            }
            if(value && date.isValid()){
                return  false;
            }else {
                return  true;
            }
        }
        const footerError = ref(false)
        const timeError = ref(false)
        const timeErrorStart = ref(false)
        const timeErrorEnd = ref(false)
        const timeErrorAll = ref(false)
        const timeModel:any = ref(dayjs().format(timeFormat.value.replace(/a/img,'')));
        const options:any = ref([]);
        const optionsStart:any = ref(null);
        const optionsEnd:any = ref(null);
        const newValue:any = ref(null);
        const currentValue:any = ref(null);
        const currentValueStart:any = ref(null);
        const currentValueEnd:any = ref(null);
        const timeModelStart:any = ref(null);
        const timeModelEnd:any = ref(null);
        const daterangeValueCache:any = ref([]);
        const daterangeDayHoverValueCache:any = ref([]);
        const refTimePicker:any = ref(null)
        const refCalendar:any = ref(null)
        const refSelect:any = ref(null)
        const refTimePickerEnd:any = ref(null)
        const refCalendarEnd:any = ref(null)
        const refSelectEnd:any = ref(null)
        const isMultiple = computed(()=> props.type === 'dates');
        const isDaterange = computed(()=>["daterange","monthrange", "yearrange", "datetimerange"].includes(props.type))
        const isDateTime = computed(()=>["datetime", 'datetimerange'].includes(props.type))
        const currentTimeFormat = computed(()=>{
            return isDateTime.value ? (currentFormat.value +" "+ timeFormat.value) : currentFormat.value;
        })
        const currentValueCopy = ref(null);
        const isDaterangeCanSwitchYear = ref(false);
        const isDaterangeCanSwitchMonth = ref(false);
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
        provide("WpCalendarIsDaterangeCanSwitchYear", isDaterangeCanSwitchYear)
        provide("WpCalendarIsDaterangeCanSwitchMonth", isDaterangeCanSwitchMonth)
        const currentPlaceholder:any = computed(()=>{
            let placeholder = ["选择日期", "至"];
            switch (Object.prototype.toString.call(props.placeholder)) {
                case "[object Array]":
                    props.placeholder.forEach((p,k)=>{
                        if(p) placeholder[k] = p;
                    })
                    break;
                case "[object String]":
                    placeholder[0] = props.placeholder;
                    break;
            }
            return placeholder;
        });
        const updateDaterangeCurrentValue = (value)=>{
            const time = (value || [])
            const start = time[0] || null;
            const end = time[1] || null;
            currentValue.value = value;
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

        const updateRangeReset = (newDate?:any)=>{
            currentValue.value = newDate || currentValue.value;
            newValue.value = null;
            footerError.value = false;
            currentValueCopy.value = JSON.parse(JSON.stringify(currentValue.value || []));
            nextTick(()=>{
                if(isDaterange.value){
                    daterangeValueCache.value = currentValueCopy.value;
                    if(Object.prototype.toString.call(daterangeValueCache.value) === '[object Array]' && daterangeValueCache.value.length === 2){
                        const InitData = daterangeValueCache.value.map(e=>getDate(e))
                        if(refCalendar.value){
                            refCalendar.value.year = InitData[0].year.value;
                            refCalendar.value.month = InitData[0].month.value;
                            refCalendar.value.date = InitData[0].date.value;
                            refCalendarEnd.value.year = InitData[1].year.value;
                            refCalendarEnd.value.month = InitData[1].month.value;
                            refCalendarEnd.value.date = InitData[1].date.value;
                            if(['monthrange', 'yearrange'].includes(props.type) && InitData[0].year.value === InitData[1].year.value){
                                refCalendarEnd.value.year += 1;
                            } else if(['yearrange'].includes(props.type)){
                                const maxYearRange = props.maxYearRange*2;
                                if(refCalendarEnd.value.year - refCalendar.value.year < maxYearRange){
                                    refCalendarEnd.value.year = refCalendar.value.year+1
                                }else {
                                    refCalendarEnd.value.year = refCalendarEnd.value.year + 2 - maxYearRange;
                                }
                            } else if(InitData[0].getYearMonth.value === InitData[1].getYearMonth.value){
                                refCalendarEnd.value.month += 1;
                            }
                        }
                        if(['datetimerange'].includes(props.type)){
                            timeModelStart.value = dayjs(InitData[0].time.value).format(timeFormat.value);
                            timeModelEnd.value = dayjs(InitData[1].time.value).format(timeFormat.value);
                        }
                    }else {
                        if(refCalendarEnd.value){
                            if(['monthrange', 'yearrange'].includes(props.type)){
                                refCalendarEnd.value.year += 1;
                            }else {
                                refCalendarEnd.value.month += 1;
                            }
                        }
                    }
                    return;
                }
                if(refCalendar.value){
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
                }
            })
        }
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
                    newValue.value = daterangeValueCache.value.map(e=>dayjs(e).toDate().getTime()).sort((a,b)=>a-b).map((time,k)=>{
                        return dayjs(k === 0  ? time : (time + 82800000 + 3540000 + 59000 + 900)).format(currentTimeFormat.value);
                    });
                    if(!isDateTime.value){
                        currentValue.value = newValue.value;
                        refSelect.value.show = false;
                    }
                }
            }
            updateDaterangeCurrentValue(currentValue.value);
            nextTick(()=>{
                // 点击非本月月份纠正
                try {
                    if(refCalendar.value.year === refCalendarEnd.value.year && refCalendar.value.month === refCalendarEnd.value.month){
                        refCalendarEnd.value.month += 1;
                    }
                }catch (e){}
            })
        }
        const onClickDay = ({year, month, date})=>{
            timeError.value = false;
            if(!['dates','daterange','monthrange','yearrange', 'datetime','datetimerange'].includes(props.type)){
                refSelect.value.show = false;
            }
            if(['daterange','monthrange','yearrange','datetimerange'].includes(props.type)){
                daterangeClickDay({year, month, date});
            }
            if(['week','daterange','monthrange','yearrange', 'datetimerange'].includes(props.type)){
                return;
            }
            let value = dayjs(new Date(year.value,month.value-1,date.value)).format(currentFormat.value)
            if(isDateTime.value){
                if(refTimePicker.value){
                    value = value+' ' + timeModel.value;
                    if(isValidTime.call(timeModel.value)){
                        timeError.value = isValidTime.call(timeModel.value);
                        return;
                    }
                }else {
                    const time = dayjs(props.modelValue).format(timeFormat.value)
                    if(time === 'Invalid Date'){
                        timeModel.value = null;
                        options.value = [];
                        nextTick(()=>{
                            currentValue.value = null;
                        })
                    }else {
                        value = value+' ' + time;
                        timeModel.value = time;
                    }
                }
            }
            if(value === 'Invalid Date'){
                timeModel.value = null;
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
                if(['datetime'].includes(props.type) && refSelect.value && refSelect.value.show) {
                    refSelect.value.show = false;
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
                if(isDaterange.value){
                    updateRangeReset(props.modelValue || []);
                }else {
                    onClickDay(getDate(props.modelValue));
                }
            }
        }
        const onConfirm = ()=>{
            if(props.type === 'datetimerange'){
                footerError.value = false;
                timeErrorAll.value = false;
                timeErrorStart.value = isValidTime.call(timeModelStart.value)
                timeErrorEnd.value = isValidTime.call(timeModelEnd.value)
                const startTime = isValidTime.call(timeModelStart.value, true);
                const startEnd = isValidTime.call(timeModelEnd.value, true);
                if(!!startTime && !!startEnd && startTime > startEnd){
                    timeErrorAll.value = true;
                    timeErrorStart.value = true;
                    timeErrorEnd.value = true;
                }
                if(!timeErrorStart.value && !timeErrorEnd.value && startTime <= startEnd){
                    newValue.value = (newValue.value || currentValue.value || []).map((e,k)=>{
                        const day = dayjs(e).format(currentFormat.value);
                        return day + ' '+ (k === 0 ? timeModelStart.value : timeModelEnd.value)
                    })
                    if(Object.prototype.toString.call(newValue.value) === '[object Array]' && newValue.value.length === 2){
                        currentValue.value = newValue.value;
                        setTimeout(()=>{
                            updateRangeReset()
                            refSelect.value.show = false;
                        })
                    }else {
                        footerError.value = true;
                    }
                }
            }else {
                currentValueCopy.value = JSON.parse(JSON.stringify(currentValue.value));
                emit("update:modelValue", currentValue.value)
                refSelect.value.show = false;
            }

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
        const onClear = (isEmit)=>{
            if(isDaterange.value){
                timeModel.value = null;
                currentValue.value = null;
                currentValueStart.value = null;
                currentValueEnd.value = null;
                optionsStart.value = [];
                optionsEnd.value = [];
            }
            if(isEmit){
                emit('clear')
            }
        }
        const onCalendarChange = ()=>{
            if(isDaterange.value){
                nextTick(()=>{
                    try {
                        isDaterangeCanSwitchYear.value  = refCalendar.value.year < refCalendarEnd.value.year;
                        if(['monthrange', 'yearrange'].includes(props.type)){
                            isDaterangeCanSwitchYear.value  = refCalendar.value.year < refCalendarEnd.value.year-1;
                        }
                        isDaterangeCanSwitchMonth.value = isDaterangeCanSwitchYear.value ||  (refCalendar.value.year <= refCalendarEnd.value.year && refCalendar.value.month+1 < refCalendarEnd.value.month);
                    }catch (e){}
                })
            }
        }
        const rangeSortingInit = ()=>{
            if(isDaterange.value && Object.prototype.toString.call(currentValue.value) === '[object Array]'){
                nextTick(()=>{
                    const times = currentValue.value.map(e=>dayjs(e).toDate().getTime())
                    if(times[0] > times[1]){
                        currentValue.value = currentValue.value.reverse();
                    }
                    updateDaterangeCurrentValue(currentValue.value)
                })
            }
        }
        watch(timeModel,()=>{
            timeError.value = isValidTime.call(timeModel.value);
        })
        watch(timeModelStart,()=>{
            timeErrorStart.value = isValidTime.call(timeModelStart.value);
        })
        watch(timeModelEnd,()=>{
            timeErrorEnd.value = isValidTime.call(timeModelEnd.value);
        })
        watch([timeModelStart, timeModelEnd],([start, end])=>{
            const startTime = isValidTime.call(start, true);
            const startEnd = isValidTime.call(end, true);
            if(startTime > startEnd){
                nextTick(()=>{
                    timeErrorStart.value = true;
                    timeErrorEnd.value = true;
                    timeErrorAll.value = true;
                })
            }else {
                timeErrorStart.value = false;
                timeErrorEnd.value = false;
                timeErrorAll.value = false;
            }
        })
        watch(computed(()=>props.modelValue),()=>{
            init()
            rangeSortingInit();
        })
        watch(currentValue,()=>{
            nextTick(()=>{
                emit("update:modelValue", currentValue.value)
            })
        })
        watch([currentValueStart, currentValueEnd],([start,end])=>{
            nextTick(()=>{
                if(isDaterange.value && dayjs(start,currentFormat.value).isValid() && dayjs(end,currentFormat.value).isValid()){
                    // onClear(false);
                    // emit("update:modelValue", [start,end])
                }
            })
        })
        watch(computed(()=>refSelect.value && refSelect.value.show),val=>{
            if(val){
                updateRangeReset()
            }else {
                if(isMultiple.value){
                    emit("update:modelValue", currentValueCopy.value)
                }
                if(isDaterange.value){
                    if(dayjs(currentValueStart.value,currentFormat.value).isValid() &&  dayjs(currentValueStart.value,currentFormat.value).isValid()){
                        nextTick(()=>{
                            updateDaterangeCurrentValue([currentValueStart.value, currentValueEnd.value]);
                        })
                    }
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
                rangeSortingInit();
            })
        })
        return {
            onGoDay,
            onClickDay,
            onWeekClick,
            onDayMousemove,
            onDayMouseleave,
            refTimePicker,
            refCalendar,
            refSelect,
            refTimePickerEnd,
            refCalendarEnd,
            refSelectEnd,
            currentPlaceholder,
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
            onCalendarChange,
            timeModelStart,
            timeModelEnd,
            timeModel,
            isDateTime,
            timeFormat,
            timeErrorAll,
            timeErrorStart,
            timeErrorEnd,
            timeError,
            footerError,
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
                onChange={()=>this.onCalendarChange()}
                {...this.$props.calendarProps}
                type={this.$props.type}
                isActiveShow={bool}
                disabledDate={this.disabledDate}
                maxYearRange={this.$props.maxYearRange}
                showAvailableStyle={this.isDaterange && (this.currentDaterangeValues || []).length >= 2}
                v-slots={{
                    title:this.isDateTime ? ()=>([
                        <WpTimePicker
                            class={{
                                timeError:this[this.isDaterange ? (bool ? 'timeErrorStart' : 'timeErrorEnd'): 'timeError']
                            }}
                            ref={bool ? 'refTimePicker' : 'refTimePickerEnd'}
                            v-model={this[this.isDaterange ? (bool ? 'timeModelStart' : 'timeModelEnd'): 'timeModel']}
                            format={this.timeFormat}
                            showFormat={this.timeFormat}
                            clearable
                            {...this.$props.timePickerProps}
                        >
                        </WpTimePicker>,
                        this[this.isDaterange ? (bool ? 'timeErrorStart' : 'timeErrorEnd'): 'timeError'] ? <div class={{
                            timeErrorText:true
                        }}>{this.timeErrorAll ? "开始时间不能大于结束时间":"请选择正确时间格式"}</div>:null
                    ]) : null
                }}
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
                      placeholder={bool ? this.currentPlaceholder[0] : (this.currentPlaceholder[2] || this.currentPlaceholder[0])}
                      multiple={this.isMultiple}
                      disabled={this.$props.disabled}
                      collapseTags={this.isMultiple}
                      onClear={()=>this.onClear(true)}
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
                              this.isMultiple || this.$props.type === 'datetimerange' ?  <div class={{
                                  'wp-date-picker-footer':true
                              }}>
                                  {this.$props.type === 'datetimerange' && this.footerError ? <div class={{
                                      'wp-date-picker-footer-error': true
                                  }}>请选择日期</div> : null}
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
                        }}>{this.currentPlaceholder[1]}</span>
                        {WpSelectRender(false)}
                    </div>
                ) :
                    WpSelectRender(true)
                }
            </div>
        )
    }
})
