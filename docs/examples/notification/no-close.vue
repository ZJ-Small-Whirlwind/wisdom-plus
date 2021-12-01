<template>
  <el-button plain @click="open"> Hide close button </el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElNotification } from 'wisdom-plus'

export default defineComponent({
  setup() {
    const open = () => {
      ElNotification.success({
        title: 'Info',
        message: 'This is a message without close button',
        showClose: false,
      })
    }

    return {
      open,
    }
  },
})
</script>
