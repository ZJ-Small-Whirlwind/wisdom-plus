import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import {
    ref,
    defineComponent,
    ExtractPropTypes,
    watch,
    onUnmounted
} from "vue"

export const countDownProps = buildProps({
    modelValue: Number,
    playing: {
        type: Boolean,
        default: undefined
    }
})

export type CountDownProps = ExtractPropTypes<typeof countDownProps>

export default defineComponent({
    name: 'WpCountDown',
    props: countDownProps,
    emits: {
        'update:modelValue': (value?: number) => (void value, true),
        'update:playing': (playing?: boolean) => (void playing, true),
        play: () => true,
        pause: () => true,
        stop: () => true
    },
    setup(props, { emit }) {
        const playRef = ref(true)
        const play = useAutoControl(playRef, props, 'playing', emit)

        const countRef = ref(60)
        const count = useAutoControl(countRef, props, 'modelValue', emit)

        const playTimer = ref<ReturnType<typeof setInterval>>()
        const countStart = ref<number>()
        const countFinal = ref<number>(0)
        const counting = () => {
            if (!countStart.value) return
            if ((count.value || 0) <= 0) {
                emit('stop')
                if (playTimer.value) clearInterval(playTimer.value)
                return
            }
            count.value = countFinal.value - Math.abs(Math.round((countStart.value - new Date().getTime()) / 1000))
            if (count.value <= 0) {
                count.value = 0
            }
        }

        const start = () => {
            countStart.value = new Date().getTime()
            countFinal.value = count.value || 0
            playTimer.value = setInterval(counting, 1000)
            emit('play')
        }

        watch(play, () => {
            if (playTimer.value) clearInterval(playTimer.value)
            if (play.value) {
                start()
            } else {
                emit('pause')
            }
        }, {
            immediate: true
        })

        watch(count, () => {
            countStart.value = new Date().getTime()
            countFinal.value = count.value || 0
            if (play.value) {
                if (playTimer.value) clearInterval(playTimer.value)
                start()
            }
        })

        onUnmounted(() => {
            if (playTimer.value) clearInterval(playTimer.value)
        })

        return {
            count,
            play
        }
    },
    render() {
        return (
            this.$slots.default?.({
                count: this.count,
                playing: this.play,
                play: () => this.play = true,
                pause: () => this.play = false,
                toggle: () => this.play = !this.play
            }) ?? `${this.count} 秒`
        )
    }
})