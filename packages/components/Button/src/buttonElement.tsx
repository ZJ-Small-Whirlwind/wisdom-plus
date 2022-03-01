import { computed, inject, defineComponent, Text, ref, watch } from 'vue'
import { useCssVar } from '@vueuse/core'
import { useFormItem, useGlobalConfig } from '@wisdom-plus/hooks'
import { buttonGroupContextKey } from '@wisdom-plus/tokens'
import { lighten, darken } from '@wisdom-plus/utils/color'
import { buttonEmits, buttonProps } from '@wisdom-plus/components/button/src/button'
import WpIcon from "@wisdom-plus/components/Icon";
import * as antdIcons from "@vicons/antd";
import Spin from "../../Spin";

export default defineComponent({
    name: 'WpButton',
    components: {WpIcon},
    props: buttonProps,
    emits: buttonEmits,
    setup(props, { emit, slots }) {
        const buttonRef = ref()
        const buttonGroupContext:any = inject(buttonGroupContextKey, undefined)
        const globalConfig = useGlobalConfig()
        const autoInsertSpace = computed(() => {
            return props.autoInsertSpace ?? globalConfig?.button.autoInsertSpace
        })
        // add space between two characters in Chinese
        const shouldAddSpace = computed(() => {
            const defaultSlot = slots.default?.()
            if (autoInsertSpace.value && defaultSlot?.length === 1) {
                const slot = defaultSlot[0]
                if (slot?.type === Text) {
                    const text = slot.children
                    return /^\p{Unified_Ideograph}{2}$/u.test(text as string)
                }
            }
            return false
        })
        const {
            form,
            size: buttonSize,
            disabled: buttonDisabled,
        } = useFormItem({
            size: computed(() => buttonGroupContext?.size),
            disabled: computed(() => buttonGroupContext?.disabled),
        })
        const buttonType = computed(
            () => props.type || buttonGroupContext?.type || 'default'
        )
        // calculate hover & active color by color
        const typeColor = computed(
            () => useCssVar(`--wp-color-${props.type}`).value
        )
        const buttonStyle = computed(() => {
            let styles = {}
            const buttonColor = props.color || typeColor.value
            if (buttonColor) {
                const darkenBgColor = darken(buttonColor, 0.1)
                if (props.plain) {
                    styles = {
                        '--wp-button-bg-color': lighten(buttonColor, 0.9),
                        '--wp-button-text-color': buttonColor,
                        '--wp-button-hover-text-color': 'var(--wp-color-white)',
                        '--wp-button-hover-bg-color': buttonColor,
                        '--wp-button-hover-border-color': buttonColor,
                        '--wp-button-active-bg-color': darkenBgColor,
                        '--wp-button-active-text-color': 'var(--wp-color-white)',
                        '--wp-button-active-border-color': darkenBgColor,
                    }
                } else {
                    const lightenBgColor = lighten(buttonColor)
                    styles = {
                        '--wp-button-bg-color': buttonColor,
                        '--wp-button-border-color': buttonColor,
                        '--wp-button-hover-bg-color': lightenBgColor,
                        '--wp-button-hover-border-color': lightenBgColor,
                        '--wp-button-active-bg-color': darkenBgColor,
                        '--wp-button-active-border-color': darkenBgColor,
                    }
                }
                if (buttonDisabled.value) {
                    const disabledButtonColor = lighten(buttonColor, 0.5)
                    styles['--wp-button-disabled-bg-color'] = disabledButtonColor
                    styles['--wp-button-disabled-border-color'] = disabledButtonColor
                }
            }
            return styles
        })
        const countdown = ref(false);
        const countdownIndex = ref(0);
        let timeIndex:any = null;
        const countdownStart = (start)=>{
            if(start){
                try {
                    clearTimeout(timeIndex)
                }catch (e) {}
                countdown.value = true;
                countdownIndex.value = Object.prototype.toString.call(props.countdown) === '[object Number]' && props.countdown !== 0 ? props.countdown : 60;
            }
            timeIndex = setTimeout(()=>{
                countdownIndex.value -= 1;
                if(countdownIndex.value <= 0){
                    countdown.value = false;
                }else {
                    countdownStart(false);
                }
            },1000)
        }
        const isCountdown = computed(()=>['[object Number]','[object Boolean]'].includes(Object.prototype.toString.call(props.countdown)) && props.countdown !== false)
        watch([computed(()=>props.countdown)],()=>{
            if(props.countdown === 0){
                countdownStart(true)
            }
        },{
            immediate:true,
        })
        const handleClick = (evt: MouseEvent) => {
            if (props.nativeType === 'reset') {
                form?.resetFields()
            }
            emit('click', evt, isCountdown.value ? ()=>{
                countdownStart(true)
            } : null)
        }
        return {
            buttonRef,
            buttonStyle,
            buttonSize,
            buttonType,
            buttonDisabled,
            shouldAddSpace,
            handleClick,
            countdown,
            countdownIndex,
        }
    },
    render() {
        return (
            <button
                ref="buttonRef"
                class={[
                    'wp-button',
                    this.buttonType ? 'wp-button--' + this.buttonType : '',
                    this.buttonSize ? 'wp-button--' + this.buttonSize : '',
                    {
                        'is-disabled':!!this.countdown || this.buttonDisabled,
                        'is-loading':!!this.countdown ||  this.loading,
                        'is-plain': this.plain,
                        'is-round': this.round,
                        'is-circle': this.circle,
                    }
                ]}
                disabled={!!this.countdown || this.buttonDisabled || this.loading}
                autofocus={this.autofocus}
                type={this.nativeType}
                style={this.buttonStyle}
                onClick={this.handleClick}
            >

                {
                    this.loading ? <Spin></Spin> : ( this.icon || this.$slots.icon ) ?
                        (
                            <wp-icon>{antdIcons[this.icon as any]?.render?.() || this.$slots.icon?.()}</wp-icon>
                        ) :
                        null
                }
                {
                    this.$slots.default && (
                        <span
                            class={{ 'wp-button__text--expand': this.shouldAddSpace }}
                        >
                            { this.$slots.default() }
                            {this.countdown ? `(${this.countdownIndex}s)` : null}
                        </span>
                    )
                }
            </button>
        )
    }
})
