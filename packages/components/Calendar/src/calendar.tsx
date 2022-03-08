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
    }
})

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export default defineComponent({
    name:"WpCalendar",
    props:calendarProps,
    setup({getIsEvent}, {emit}) {
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
        }

        /**
         * 下一年
         */
        const nextYear = ()=>{
            year.value += 1;
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
        /**
         * 具体日期
         */
        const daysRender = ()=> this.days.map(e => (
            <div class={`wp-calendar-content-day ${e.type}`}>
                <span  onClick={() => this.clickDays(e)} class={{
                    isActive:e.dateYear == this.year && e.dateMonth == this.month && e.day == this.date,
                    isEvent:this.$props.getIsEvent(e),
                }}>{e.day}</span>
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
                }} onClick={()=>(this.month = month, this.showMonth = false)}>{month}月</span>
            </div>
        ))

        /**
         * 年月
         */
        const titleRender = ()=>[
            <span onClick={()=>this.showYear = true}>{this.year}年</span>,
            <span onClick={()=>this.showMonth = true}>{this.month}月</span>,
        ]


        return (
            <div class={'wp-calendar'}>
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
