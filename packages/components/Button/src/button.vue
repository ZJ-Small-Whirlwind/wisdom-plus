<template>
    <button
        ref="buttonRef"
        :class="[
      'wp-button',
      buttonType ? 'wp-button--' + buttonType : '',
      buttonSize ? 'wp-button--' + buttonSize : '',
    ]"
    >
      <slot></slot>
    </button>
</template>

<script lang="ts">
import { computed, inject, defineComponent, Text, ref } from 'vue'
import { buttonEmits, buttonProps } from '@wisdom-plus/components/Button/src/button'
export default defineComponent({
    name: 'WpButton',
    components: {
    },
    props: buttonProps,
    emits: buttonEmits,
    setup(props, { emit, slots }) {

        return {
        }
    },
})
</script>