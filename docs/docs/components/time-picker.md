# TimePicker 时间选择器

### 介绍

你的时间非常值钱

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
            <wp-time-panel v-model="time" format="HH:mm:ss" />
            <wp-time-panel use-12-hours v-model="time" format="HH:mm:ss" />
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const time = ref('10:27:30')
</script>
```
:::

## Time Panel API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 双向绑定的时间，如果有 `format`，会被修改为字符串，如果没有，则会被设置为 Date       | _Date \| string \| number \| dayjs.Dayjs_          | -     |
| use12Hours     | 使用 12 小时制   | _boolean_           | false      |
| layout   | 显示的组件 | _('hours', 'minutes', 'seconds')[]_ | -      |
| format  | 格式化时间       | _string_                                                           | -  |

### Expose

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| getDayjs      | 获取 Dayjs 对象       | _() => dayjs.Dayjs_          | -     |