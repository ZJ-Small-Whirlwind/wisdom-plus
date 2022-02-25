import { ref, computed, defineComponent, PropType, type ExtractPropTypes, watch, Teleport, Transition, onMounted } from 'vue'

const CircularIcon = (
    <svg class={'wp-spin__circular'} viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" fill="none" />
    </svg>
)

const isNumeric = (value?: number | string) => {
    return !isNaN(Number(value))
}

const getMaxZIndex = () => {
    const elements = Array.from(document.querySelectorAll('*'))
    const arr = elements.map(e => +window.getComputedStyle(e).zIndex || 0);
    return arr.length ? Math.max(...arr) + 1 : 1
}

export function addUnit(value?: string | number): string | undefined {
    if (typeof value !== 'undefined') {
        return isNumeric(value) ? `${value}px` : String(value)
    }
    return undefined
}

const numericProp = [Number, String] as PropType<number | string>

export const spinProps = {
    size: numericProp,
    color: String,
    vertical: Boolean,
    textSize: numericProp,
    textColor: String,
    text: String,
    loading: Boolean,
    fullscreen: Boolean,
    background: String
}

export type SpinProps = ExtractPropTypes<typeof spinProps>;

export default defineComponent({
    name: 'WpSpin',
    props: spinProps,
    setup(props, { slots }) {
        const renderText = () => {
            if (slots.text || props.text) {
                return (
                    <span
                        class={'wp-spin__text'}
                        style={{
                            fontSize: addUnit(props.textSize),
                            color: props.textColor ?? props.color
                        }}
                    >
                        {slots.text?.() || props.text}
                    </span>
                )
            }
        }

        const zIndex = ref(1)

        watch(() => props.loading, () => {
            if (props.loading && props.fullscreen) {
                zIndex.value = getMaxZIndex()
                document.body.style.overflowY = 'hidden'
            } else if (props.fullscreen) {
                document.body.style.overflowY = ''
            }
        })

        onMounted(() => {
            if (props.loading && props.fullscreen) {
                zIndex.value = getMaxZIndex()
                document.body.style.overflowY = 'hidden'
            }
        })

        return () => {
            const Spin = (
                <div class={[
                    'wp-spin',
                    {
                        'wp-spin--vertical': props.vertical
                    }
                ]} style={{
                    fontSize: addUnit(props.size),
                    color: props.color
                }}>
                    <span class={'wp-spin__spinner'}>
                        {CircularIcon}
                    </span>
                    {renderText()}
                </div>
            )
            return (
                slots.default || props.fullscreen ? (
                    <Teleport to='body' disabled={!props.fullscreen}>
                        <Transition name='wp-spin-transition'>
                            {
                                (!props.fullscreen || props.loading) ? (
                                    <div class='wp-spin-wrapper' style={props.fullscreen ? {
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        width: '100%',
                                        zIndex: zIndex.value
                                    } : undefined}>
                                        {slots.default?.()}
                                        <Transition name='wp-spin-transition'>
                                            {
                                                props.loading && (
                                                    <div class='wp-spin-wrapper--icon' style={{ background: props.background }}>
                                                        {Spin}
                                                    </div>
                                                )
                                            }
                                        </Transition>
                                    </div>
                                ) : null
                            }        
                        </Transition>                
                    </Teleport>
                ) : Spin
            )
        }
    }
})