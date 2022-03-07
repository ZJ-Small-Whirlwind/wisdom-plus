import {defineComponent, computed, ref, watch} from 'vue'
import {Icon} from 'vant'
import CalendarData from 'lunar-calendar-panel'
import dayjs from 'dayjs'
import  '@/assets/less/Calendar.less'

export default defineComponent({
    props:{
        /**
         * 获取事件状态
         */
        getIsEvent:{type:Function, default:Function}
    },
    setup({getIsEvent}, {
        emit,
        expose
    }) {
        const currentData:dayjs.Dayjs = dayjs()
        const year = ref(currentData.year())
        const month = ref(currentData.month() + 1)
        const date = ref(currentData.date())
        const cd = new CalendarData()
        expose({
            year,
            month,
            date
        })
        /**
         * 星期头
         */
        const daysHeader = ['日','一','二','三','四','五','六'].map(e => (
            <div class={'calendar-tsx-content-day-header'}>
                <span>{e}</span>
            </div>
        ))

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
         * 具体日期
         */
        const days = computed(() => {
            return cd.returnDate(year.value, month.value).map(e => (
                <div class={`calendar-tsx-content-day ${e.type}`}>
                    <span  onClick={() => clickDays(e)} class={
                        [
                            e.dateYear == year.value && e.dateMonth == month.value && e.day == date.value ? 'isActive' : null,
                            (getIsEvent || new Function)(e) ? 'isEvent' : null,
                        ].join(' ')
                    }>{e.day}</span>
                </div>
            ))
        })

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

        return () => (
            <div class={'calendar-tsx'}>
                <div class={'calendar-tsx-header'}>
                    <Icon class={'calendar-tsx-header-icon'} name={'arrow-left'} onClick={prevMonth}></Icon>
                    <div class={'calendar-tsx-header-title'} onClick={herderTitleClick}>{title_str.value}</div>
                    <Icon class={'calendar-tsx-header-icon'} name={'arrow'} onClick={nextMonth}></Icon>
                </div>
                <div class={'calendar-tsx-content'}>{daysHeader.concat(days.value)}</div>
            </div>
        )
    }
})
