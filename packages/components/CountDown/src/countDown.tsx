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

        const clear = () => {
            if (playTimer.value) {
                clearInterval(playTimer.value)
                playTimer.value = undefined
            }
        }

        const counting = () => {
            if (!countStart.value) return
            if ((count.value || 0) <= 0) {
                emit('stop')
                clear()
                return
            }
            count.value = Math.ceil(countFinal.value - ((performance.now() - countStart.value) / 1000))
            if (count.value <= 0) {
                count.value = 0
            }
        }

        const start = () => {
            countStart.value = performance.now()
            countFinal.value = count.value || 0
            playTimer.value = setInterval(counting, 200)
            emit('play')
        }

        watch(play, () => {
            clear()
            if (play.value) {
                start()
            } else {
                emit('pause')
            }
        }, {
            immediate: true
        })

        watch(count, (to, from) => {
            if ((to || 0) - (from || 0) !== -1) {
                countStart.value = performance.now()
                countFinal.value = count.value || 0
            }
            if (play.value && !playTimer.value) {
                clear()
                start()
            }
        })

        onUnmounted(clear)

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