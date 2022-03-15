import {defineComponent, computed, ref, watch, PropType, ExtractPropTypes, onMounted, nextTick, inject} from 'vue'
import CalendarData,{returnDate} from 'lunar-calendar-panel'
import dayjs from 'dayjs'
import {buildProps} from "@wisdom-plus/utils/props";
import Icon from "../../Icon";
import WpButton from "../../Button";
import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    LeftOutlined,
    RightOutlined,
    AlignRightOutlined,
    CarryOutFilled,
    CarryOutOutlined,
} from "@vicons/antd";
export const calendarProps = buildProps({
    /**
     * 获取事件状态
     */
    getIsEvent:{
        type: Function as PropType<(day:any) => boolean>,
        default: ()=>false
    },
    lunar:{
        type:Boolean as PropType<boolean>,
        default:false
    },
    showPanel:{
        type:Boolean as PropType<boolean>,
        default:false
    },
    disabledDate:{
        type:Function as PropType<(day:any) => boolean>,
        default:()=>false
    },
    type:{
        type:String as PropType<string>,
        default:null
    }
})

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export default defineComponent({
    name:"WpCalendar",
    props:calendarProps,
    setup(props, {emit}) {
        const WpCalendarActiveMaps:any = inject("WpCalendarActiveMaps", ref(null))
        const activeMaps = computed(()=>{
            try {
                if(Object.prototype.toString.call(WpCalendarActiveMaps.value) === '[object Array]'){
                    return WpCalendarActiveMaps.value.reduce((a,b)=>{
                        const keyname = `${b.year.value}-${b.month.value}-${b.date.value}`;
                        a[keyname] = true;
                        return a;
                    },{})
                }else {
                    return {}
                }
            }catch (e) {
                return {};
            }
        })
        const currentData:dayjs.Dayjs = dayjs()
        const today = ref({
            year:currentData.year(),
            month:currentData.month()+1,
            date:currentData.date(),
        })
        const year = ref(today.value.year)
        const month = ref(today.value.month)
        const date = ref(today.value.date)
        const showYear = ref(false)
        const showMonth = ref(false)
        const cd = new CalendarData();
        const oneDayTimeIndex = 86400000;

        const days = computed(()=>{
            const d = cd.returnDate(year.value, month.value);
            return d.map(e=>{
                e.date = dayjs(e.getDayAll);
                return e;
            });
        })
        const currentDays = computed(()=>days.value.filter(e=>e.type === "current"))
        const yearList = computed(()=>{
            return new Array(10).fill(0).map((e,k)=>year.value - 5 + k);
        })
        const monthList = ref(new Array(12).fill(0).map((e,k)=> k+1))
        const currentDayObjData = computed<returnDate>(()=>(days.value.find(e=>e.getDayAll === `${year.value}-${month.value}-${date.value}`) || {calendar:{}}) as any);
        /**
         * 监听日期变化
         */
        watch([year,month, date],(arg) => {
            if(arg[2] > currentDays.value.length){
                date.value = currentDays.value.length;
            }else {
                emit('change',arg)
            }
        },{deep:true,immediate:true})

        const goDay = nb=>{
            switch (nb){
                case 0:
                    year.value = today.value.year;
                    month.value = today.value.month;
                    date.value = today.value.date;
                    break;
                default:
                    const nbData = dayjs(Date.now() + oneDayTimeIndex*nb);
                    year.value = nbData.year();
                    month.value = nbData.month() + 1;
                    date.value = nbData.date();
                    break;
            }
            if(!props.disabledDate(currentDayObjData.value)) {
                emit('go-day', {year, month, date})
            }
        }
        /**
         * 日期点击
         */
        const clickDays = (e:any) => {
            if(!props.disabledDate(e)){
                year.value = e.dateYear
                month.value = e.dateMonth
                date.value = e.day
                emit('click-day',{
                    year,
                    month,
                    date,
                })
            }
        }

        /**
         * 上一月
         */
        const prevMonth = () => {
            month.value -= 1
            if (month.value < 1) {
                month.value = 12
                year.value -= 1
            }
            emit('arrow-change',{
                year,
                month,
                date,
            },'prev')
        }

        /**
         * 下一月
         */
        const nextMonth = () => {
            month.value += 1
            if (month.value > 12) {
                month.value = 1
                year.value += 1
            }
            emit('arrow-change',{
                year,
                month,
                date,
            },'next')
        }

        /**
         * 上一年
         */
        const prevYear = ()=>{
            year.value -= 1;
            emit('arrow-year-change',{
                year,
                month,
                date,
            },'prev')
        }

        /**
         * 下一年
         */
        const nextYear = ()=>{
            year.value += 1;
            emit('arrow-year-change',{
                year,
                month,
                date,
            },'next')
        }

        /**
         * 头部选择
         */
        const herderTitleClick = () => {
            emit('herderTitleClick',{
                year,
                month,
                date,
            })
        }

        const eventClick = (ev,day,task)=> {
            ev.stopPropagation();
            emit('event-click',{ev,day,task})
        }
        const watchTypeInit = ()=>{
            switch (props.type){
                case "year":
                    showYear.value = true;
                    break;
                case "month":
                    showMonth.value = true;
                    break;
                default:
                    break;
            }
        }
        const yearClick = (newYear)=>{
            year.value = newYear;
            if(props.type === 'year'){
                clickDays(currentDayObjData.value)
            }else {
                showYear.value = false
                showMonth.value = true
            }
        }
        const monthClick = (newMonth)=>{
            month.value = newMonth;
            if(props.type === 'month'){
                clickDays(currentDayObjData.value)
            }else {
                showMonth.value = false
            }
        }
        watch(computed(()=> props.type),()=>{
            nextTick(()=>{
                watchTypeInit();
            })
        })
        onMounted(()=>{
            nextTick(()=>{
                watchTypeInit();
            })
        })
        return {
            monthClick,
            yearClick,
            eventClick,
            herderTitleClick,
            days,
            clickDays,
            prevMonth,
            nextMonth,
            prevYear,
            nextYear,
            year,
            month,
            date,
            showYear,
            showMonth,
            monthList,
            yearList,
            goDay,
            currentDayObjData,
            today,
            activeMaps,
        }
    },
    render(){
        const toChinesNum = (num, bool) => {
            let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
            let unit = ["", "十", "百", "千", "万"];
            num = parseInt(num);
            let getWan = (temp) => {
                let strArr = temp.toString().split("").reverse();
                let newNum = "";
                if(bool){
                    newNum = strArr.map((e,k)=>k === 0 ? (changeNum[e] === changeNum[0] ? '':changeNum[e]) : unit[e]).reverse()
                }else {
                    for (var i = 0; i < strArr.length; i++) {
                        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
                    }
                }

                return newNum;
            }
            let overWan = Math.floor(num / 10000);
            let noWan:any = num % 10000;
            if (noWan.toString().length < 4) noWan = "0" + noWan;
            return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);

        }
        /**
         * 具体日期
         */
        const daysRender = ()=> this.days.map((e:any) => {
            const EventList:any = this.$props.getIsEvent(e);
            return (
                <div  onClick={() => this.$props.lunar ? this.clickDays(e) : null} class={{
                    'wp-calendar-content-day':true,
                    isActive:e.dateYear == this.year && e.dateMonth == this.month && e.day == this.date,
                    isWeek:[0,6].includes(e.week),
                    [e.type]:true,
                    "wp-calendar-content-day-disabled":this.$props.disabledDate(e),
                    "wp-calendar-content-day-active-map":this.activeMaps[e.getDayAll],
                }}>
                    <span onClick={() => !this.$props.lunar ? this.clickDays(e) : null} class={{
                        isActive:e.dateYear == this.year && e.dateMonth == this.month && e.day == this.date,
                        isEvent:EventList,
                        'wp-calendar-content-day-cell':true,
                    }}>{e.day}</span>
                    {this.$props.lunar ? (<span class={{
                        "wp-calendar-content-day-lunar":true,
                        isFestival:e.calendar.festival,
                        isLunarFestival:e.calendar.lunarFestival,
                    }}>{e.calendar.lunarFestival || e.calendar.festival || e.calendar.IDayCn} </span>) : null}
                    {Object.prototype.toString.call(EventList) === '[object Array]' ? (<div class={{
                        "wp-calendar-content-day-event":true
                    }}>
                        {EventList.map(eventObj=>(
                            <div class={{
                                "wp-calendar-content-day-event-cell":true,
                                "wp-calendar-content-day-event-cell-success":eventObj.success,
                            }} onClick={ev=>this.eventClick(ev,e,eventObj)}>
                                {eventObj.name}
                                <Icon size={18} class={{
                                    "wp-calendar-content-day-event-cell-icon":true,
                                }}>{eventObj.success ? <CarryOutFilled></CarryOutFilled> : <CarryOutOutlined></CarryOutOutlined>}</Icon>
                            </div>
                        ))}
                    </div>) : null}
                </div>
            )
        })
        /**
         * 星期头
         */
        const daysHeaderRender = ()=>['日','一','二','三','四','五','六'].map(e => (
            <div class={'wp-calendar-content-day-header'}>
                <span>{e}</span>
            </div>
        ))
        const yearRender = ()=> this.yearList.map(year => (
            <div class={{
                "wp-calendar-content-year":true
            }}>
                <span class={{
                    active:this.year === year
                }} onClick={()=>this.yearClick(year)}>{year}</span>
            </div>
        ))

        const monthRender = ()=> this.monthList.map(month => (
            <div class={{
                "wp-calendar-content-month":true
            }}>
                <span class={{
                    active:this.month === month
                }} onClick={()=>this.monthClick(month)}>{toChinesNum(month, true)}月</span>
            </div>
        ))

        /**
         * 年月
         */
        const titleRender = ()=>[
            <span onClick={()=>this.showYear = true}>{this.year}年</span>,
            this.$props.type !== 'year' ? <span onClick={()=>(this.showYear = false, this.showMonth = true)}>{this.month}月</span> : null,
        ]

        const calendarRender = ()=>{
            return (<div class={{
                'wp-calendar': true,
                "wp-calendar-lunar": this.$props.lunar
            }}>
                <div class={'wp-calendar-header'}>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow-left'}
                          onClick={this.prevYear}><DoubleLeftOutlined></DoubleLeftOutlined></Icon>
                    {this.$props.type !== 'year' ? <Icon class={'wp-calendar-header-icon'} name={'arrow-left'}
                          onClick={this.prevMonth}><LeftOutlined></LeftOutlined></Icon>: null}
                    <div class={'wp-calendar-header-title'}
                         onClick={this.herderTitleClick}>{titleRender()}</div>
                    {this.$props.type !== 'year' ? <Icon class={'wp-calendar-header-icon'} name={'arrow'}
                          onClick={this.nextMonth}><RightOutlined></RightOutlined></Icon> : null}
                    <Icon class={'wp-calendar-header-icon'} name={'arrow'}
                          onClick={this.nextYear}><DoubleRightOutlined></DoubleRightOutlined></Icon>
                </div>
                <div class={'wp-calendar-content'}>
                    {this.showYear ? yearRender() :
                        this.showMonth ? monthRender() :
                            [
                                daysHeaderRender(),
                                daysRender()
                            ]}
                </div>
            </div>)
        }
        const calendarPanelBtnsRender = ()=>(
            <div class={{
                "wp-calendar-layout-panel-btns": true,
            }}>
                <WpButton size='mini' onClick={() => this.goDay(0)}>返回今天</WpButton>
                <WpButton size='mini' onClick={() => this.goDay(-1)}>昨天</WpButton>
                <WpButton size='mini' onClick={() => this.goDay(-7)}>一周前</WpButton>
                <WpButton size='mini' onClick={() => this.goDay(7)}>一周后</WpButton>
                <WpButton size='mini' onClick={() => this.goDay(-30)}>一月前</WpButton>
                <WpButton size='mini' onClick={() => this.goDay(30)}>一月后</WpButton>
            </div>
        )
        const calendarPanelLunarRender = ()=>(
            <div class={{
                "wp-calendar-layout-lunar-panel-lunar": true,
            }}>
                <div class={{
                    "wp-calendar-layout-lunar-panel-lunar-day": true,
                }} title={this.today.year == this.year && this.today.month == this.month && this.today.date == this.date ? '今天' : ''} onClick={()=>this.goDay(0)}>{this.date}</div>
                <div class={{
                    "wp-calendar-layout-lunar-panel-lunar-text": true,
                }}>
                    <div>{this.currentDayObjData.calendar.IMonthCn} {this.currentDayObjData.calendar.IDayCn}</div>
                    <div>{this.currentDayObjData.calendar.gzYear}年 {this.currentDayObjData.calendar.Animal}</div>
                    <div>{this.currentDayObjData.calendar.gzMonth}月 {this.currentDayObjData.calendar.gzDay}日</div>
                    {[
                        this.currentDayObjData.calendar.lunarFestival,
                        this.currentDayObjData.calendar.festival,
                    ].filter(e=>e).map(e=>(<div class={{
                        "wp-calendar-layout-lunar-panel-lunar-text-festival": true,
                    }}>· {e}</div>))}
                </div>

            </div>
        )
        const calendarPanelLunarTaskRender=()=>{
            let tasks:any = this.$props.getIsEvent(this.currentDayObjData);
            if(Object.prototype.toString.call(tasks) !== '[object Array]'){
                return [];
            }
            return (
                <div class={{
                    "wp-calendar-layout-lunar-panel-lunar-task": true,
                }}>
                    {
                        tasks.map(task=>(<div  onClick={ev=>this.eventClick(ev,this.currentDayObjData,task)}>
                            {task.name}
                            <Icon size={18} class={{
                                "wp-calendar-content-day-event-cell-icon":true,
                            }}>{task.success ? <CarryOutFilled></CarryOutFilled> : <CarryOutOutlined></CarryOutOutlined>}</Icon>
                        </div>))
                    }
                </div>
            )
        }
        const calendarPanelRender = ()=>(
            <div class={{
                'wp-calendar-layout-panel': true,
                'wp-calendar-layout-lunar-panel': this.$props.lunar,
            }}>
                <div class={{
                    "wp-calendar-layout-panel-title":true,
                }}>{this.year}-{this.month}-{this.date}</div>
                {this.$props.lunar ? [calendarPanelLunarRender(), calendarPanelLunarTaskRender()] : calendarPanelBtnsRender()}
            </div>
        )
        return this.$props.showPanel ?  (
            <div class={{
                'wp-calendar-layout': true,
                'wp-calendar-layout-lunar': this.$props.lunar,
            }}>
                {calendarRender()}
                {calendarPanelRender()}
            </div>
        ) : calendarRender()
    }
})
