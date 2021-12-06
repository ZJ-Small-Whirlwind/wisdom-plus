<template>
    <button
        ref="buttonRef"
        :class="[
      'wp-button',
      buttonType ? 'wp-button--' + buttonType : '',
      buttonSize ? 'wp-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
      },
    ]"
        :disabled="buttonDisabled || loading"
        :autofocus="autofocus"
        :type="nativeType"
        :style="buttonStyle"
        @click="handleClick"
    >
        <wp-icon></wp-icon>
        <span
            v-if="$slots.default"
            :class="{ 'wp-button__text--expand': shouldAddSpace }"
        >
      <slot></slot>
    </span>
    </button>
</template>

<script lang="ts">
import { computed, inject, defineComponent, Text, ref } from 'vue'
import { useCssVar } from '@vueuse/core'
import { useFormItem, useGlobalConfig } from '@wisdom-plus/hooks'
import { buttonGroupContextKey } from '@wisdom-plus/tokens'
import { lighten, darken } from '@wisdom-plus/utils/color'
import { buttonEmits, buttonProps } from '@wisdom-plus/components/button/src/button'
import {WpIcon} from "@wisdom-plus/components";
export default defineComponent({
    name: 'ElButton',
    components: {WpIcon},
    props: buttonProps,
    emits: buttonEmits,
    setup(props, { emit, slots }) {
        const buttonRef = ref()
        const buttonGroupContext = inject(buttonGroupContextKey, undefined)
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
        const handleClick = (evt: MouseEvent) => {
            if (props.nativeType === 'reset') {
                form?.resetFields()
            }
            emit('click', evt)
        }
        return {
            buttonRef,
            buttonStyle,
            buttonSize,
            buttonType,
            buttonDisabled,
            shouldAddSpace,
            handleClick,
        }
    },
})
</script>