import {defineComponent, computed, ref, watch, PropType, ExtractPropTypes} from 'vue'
import CalendarData from 'lunar-calendar-panel'
import dayjs from 'dayjs'
import {buildProps} from "@wisdom-plus/utils/props";
import Icon from "../../Icon";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@vicons/antd";
export const calendarProps = buildProps({
    /**
     * 获取事件状态
     */
    getIsEvent:{
        type: Function as PropType<(day:any) => boolean>,
        default: ()=>()=>false
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
        const cd = new CalendarData();

        const days = computed(()=>cd.returnDate(year.value, month.value))

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
         * 年月
         */
        const title_str = computed(() => {
            return `${year.value}年${month.value}月`
        })

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
            title_str,
            days,
            clickDays,
            prevMonth,
            nextMonth,
            year,
            month,
            date
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
        return (
            <div class={'wp-calendar'}>
                <div class={'wp-calendar-header'}>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow-left'} onClick={this.prevMonth}><ArrowLeftOutlined></ArrowLeftOutlined></Icon>
                    <div class={'wp-calendar-header-title'} onClick={this.herderTitleClick}>{this.title_str}</div>
                    <Icon class={'wp-calendar-header-icon'} name={'arrow'} onClick={this.nextMonth}><ArrowRightOutlined></ArrowRightOutlined></Icon>
                </div>
                <div class={'wp-calendar-content'}>
                    {daysHeaderRender()}
                    {daysRender()}
                </div>
            </div>
        )
    }
})
