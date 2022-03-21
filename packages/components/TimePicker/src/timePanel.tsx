import { useNamespace } from "@wisdom-plus/utils/namespace"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { computed, defineComponent, ExtractPropTypes, onMounted, PropType, reactive, ref, watch, type Ref } from "vue"

import dayjs from 'dayjs'

export const timePanelProps = buildProps({
    use12Hours: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: Object as PropType<Date>,
        default: undefined
    },
    layout: {
        type: Array as PropType<('hours' | 'minutes' | 'seconds')[]>,
        default: () => ['hours', 'minutes', 'seconds']
    }
})

export type TimePanelProps = ExtractPropTypes<typeof timePanelProps>

const numbersGen = (length: number) => new Array(length).fill(0).map((item, index) => index > 9 ? String(index) : `0${index}`)

const hours = numbersGen(24)
const hours12 = numbersGen(12)
hours12[0] = '12'

const minutes = numbersGen(60)
const seconds = numbersGen(60)

export default defineComponent({
    name: 'WpTimePanel',
    props: timePanelProps,
    setup(props, { emit }) {
        const { basic, is, of } = useNamespace('time-panel')

        // auto control
        const timeRef = ref(dayjs().set('hours', 0).set('minutes', 0).set('seconds', 0))
        const time = useAutoControl(timeRef, props, 'modelValue', emit)

        const active = reactive({
            hours: 0,
            minutes: 0,
            seconds: 0,
            a: 0
        })

        const getValue = () => {
            const date = dayjs(time.value)
            const hour = date.hour()
            if (props.use12Hours) {
                if (hour >= 12) {
                    active.hours = hour - 12
                    active.a = 1
                } else {
                    active.hours = hour
                }
                active.minutes = date.minute()
                active.seconds = date.second()
            } else {
                active.hours = hour
                active.minutes = date.minute()
                active.seconds = date.second()
            }
        }

        getValue()
        watch(time, () => {
            getValue()
        })

        // auto scroll
        const hoursRef = ref<HTMLDivElement>()
        const minutesRef = ref<HTMLDivElement>()
        const secondsRef = ref<HTMLDivElement>()
        const aRef = ref<HTMLDivElement>()
        const scrollIntoRef = (ref: Ref<HTMLDivElement | undefined>, is: keyof typeof active, smooth: boolean = true) => {
            if (ref.value) {
                if (ref.value.children[active[is]]) {
                    ref.value?.scrollTo({
                        top: (ref.value.children[active[is]] as HTMLDivElement).offsetTop - ref.value.offsetTop,
                        behavior: smooth ? 'smooth' : 'auto'
                    })
                }
            }
        }

        watch(() => active.hours, () => scrollIntoRef(hoursRef, 'hours'))
        watch(() => active.minutes, () => scrollIntoRef(minutesRef, 'minutes'))
        watch(() => active.seconds, () => scrollIntoRef(secondsRef, 'seconds'))
        watch(() => active.a, () => scrollIntoRef(aRef, 'a'))

        onMounted(() => {
            scrollIntoRef(hoursRef, 'hours', false)
            scrollIntoRef(minutesRef, 'minutes', false)
            scrollIntoRef(secondsRef, 'seconds', false)
            scrollIntoRef(aRef, 'a', false)
        })

        const elementsRender = (name: 'hours' | 'minutes' | 'seconds' | 'a', elements: string[]) => {
            const elementsPlus = [...elements, ...new Array(6).fill('blank')]
            return (
                <div
                    ref={`${name}Ref`}
                    class={[
                        is(name),
                        is('cells')
                    ]}
                >
                    {
                        elementsPlus.map((element, index) => (
                            <div
                                class={[
                                    is('cell'),
                                    {
                                        [of('blank', is('cell'))]: element === 'blank',
                                        [of('active', is('cell'))]: active[name] === index
                                    }
                                ]}
                                key={element}
                                onClick={() => {
                                    if (element === 'blank') return
                                    active[name] = index
                                    let dayjsMap = dayjs(time.value)
                                    if (name !== 'a') {
                                        dayjsMap = dayjsMap.set(name, index)
                                    } else {
                                        if (index === 1) {
                                            dayjsMap = dayjsMap.set('hours', active.hours + 12)
                                        } else {
                                            dayjsMap = dayjsMap.set('hours', active.hours)
                                        }
                                    }
                                    time.value = dayjsMap.toDate()
                                }}>
                                    { element === 'blank' ? '' : element }
                                </div>
                        ))
                    }
                </div>
            )
        }
        const cellsRender = {
            hours() {
                const elements = props.use12Hours ? hours12 : hours
                return elementsRender('hours', elements)
            },
            minutes: () => elementsRender('minutes', minutes),
            seconds: () => elementsRender('seconds', seconds),
            a: () => elementsRender('a', ['AM', 'PM'])
        }
        const layoutRender = computed(() => {
            const layout = props.use12Hours ? [...props.layout, 'a'] : props.layout
            return layout.map((item: string) => cellsRender[item]?.())
        })
        return {
            basic,
            layoutRender,
            hoursRef,
            minutesRef,
            secondsRef,
            aRef
        }
    },
    render() {
        return (
            <div class={[this.basic]}>
                { this.layoutRender }
            </div>
        )
    }
})