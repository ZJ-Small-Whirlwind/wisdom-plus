import {defineComponent, computed, ref, watch, PropType, ExtractPropTypes} from 'vue'
import CalendarData from 'lunar-calendar-panel'
import dayjs from 'dayjs'
import {buildProps} from "@wisdom-plus/utils/props";
import Icon from "../../Icon";
import {DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined} from "@vicons/antd";
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
    }
})

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export default defineComponent({
    name:"WpCalendar",
    props:calendarProps,
    setup(props, {emit}) {
        const currentData:dayjs.Dayjs = dayjs()
        const year = ref(currentData.year())
        const month = ref(currentData.month() + 1)
        const date = ref(currentData.date())
        const showYear = ref(false)
        const showMonth = ref(false)
        const cd = new CalendarData();

        const days = computed(()=>cd.returnDate(year.value, month.value))
        const yearList = computed(()=>{
            return new Array(10).fill(0).map((e,k)=>year.value - 5 + k);
        })
        const monthList = ref(new Array(12).fill(0).map((e,k)=> k+1))

        /**
         * 监听日期变化
         */
        watch([year,month, date],(arg) => {
            emit('change',arg)
        },{deep:true,immediate:true})

        /**
         * 日期点击
         */
        const clickDays = (e:any) => {
            year.value = e.dateYear
            month.value = e.dateMonth
            date.value = e.day
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

        return {
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
        const daysRender = ()=> this.days.map(e => (
            <div  onClick={() => this.$props.lunar ? this.clickDays(e) : null} class={{
                'wp-calendar-content-day':true,
                isActive:e.dateYear == this.year && e.dateMonth == this.month && e.day == this.date,
                isWeek:[0,6].includes(e.week),
                [e.type]:true,
            }}>
                <span onClick={() => !this.$props.lunar ? this.clickDays(e) : null} class={{
                    isActive:e.dateYear == this.year && e.dateMonth == this.month && e.day == this.date,
                    isEvent:this.$props.getIsEvent(e),
                    'wp-calendar-content-day-cell':true,
                }}>{e.day}</span>
                {this.$props.lunar ? (<span class={{
                    "wp-calendar-content-day-lunar":true
                }}>{e.calendar.IDayCn} </span>) : null}
            </div>
        ))
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
                }} onClick={()=>(this.year = year, this.showYear = false, this.showMonth = true)}>{year}</span>
            </div>
        ))

        const monthRender = ()=> this.monthList.map(month => (
            <div class={{
                "wp-calendar-content-month":true
            }}>
                <span class={{
                    active:this.month === month
                }} onClick={()=>(this.month = month, this.showMonth = false)}>{toChinesNum(month, true)}月</span>
            </div>
        ))

        /**
         * 年月
         */
        const titleRender = ()=>[
            <span onClick={()=>this.showYear = true}>{this.year}年</span>,
            <span onClick={()=>(this.showYear = false, this.showMonth = true)}>{this.month}月</span>,
        ]


        return (
            <div class={{
                'wp-calendar':true,
                "wp-calendar-lunar":this.$props.lunar
            }}>
                <div class={'wp-calendar-header'}>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow-left'} onClick={this.prevYear}><DoubleLeftOutlined></DoubleLeftOutlined></Icon>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow-left'} onClick={this.prevMonth}><LeftOutlined></LeftOutlined></Icon>
                    <div class={'wp-calendar-header-title'} onClick={this.herderTitleClick}>{titleRender()}</div>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow'} onClick={this.nextMonth}><RightOutlined></RightOutlined></Icon>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow'} onClick={this.nextYear}><DoubleRightOutlined></DoubleRightOutlined></Icon>
                </div>
                <div class={'wp-calendar-content'}>
                    {this.showYear ? yearRender() :
                        this.showMonth ? monthRender() :
                            [
                                daysHeaderRender(),
                                daysRender()
                            ]}
                </div>
            </div>
        )
    }
})
