<template>
  <button
    ref="buttonRef"
  >
      <slot></slot>
  </button>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import { buttonEmits, buttonProps } from './button'

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
