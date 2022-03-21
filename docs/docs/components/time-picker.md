# Tag 标签

### 介绍

不要随便给人打上标签

### 引入

```js
import { createApp } from 'vue'
import { WpTimePicker, WpTimePanel } from 'wisdom-plus'

const app = createApp()
app.use(WpTimePicker)
app.use(WpTimePanel)
```

## 代码演示

#### 使用时间面板

:::demo
```vue
<template>
    <wp-space vertical>
        {{ time }}
        <wp-space>
            <wp-time-panel v-model="time" />
            <wp-time-panel use-12-hours v-model="time" />
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const time = ref(new Date())
</script>
```
:::