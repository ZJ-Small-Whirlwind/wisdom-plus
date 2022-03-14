# DatePicker 日期选择器

### 介绍

用于选择或输入日期

### 引入

```js
import { createApp } from 'vue'
import { WpDatePicker } from 'wisdom-plus'

const app = createApp()
app.use(WpDatePicker)
```

## 代码演示

#### 基础用法，选择日,带快捷选项

:::demo
```vue
<template>
    {{value}}
    <wp-space>
        <WpDatePicker v-model="value" clearable filterable></WpDatePicker>
        <WpDatePicker v-model="value" clearable filterable showPanel></WpDatePicker>
    </wp-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(null);
</script>
```
:::

## API

### Props

| 参数      | 说明 | 类型                             | 默认值        |
|---------|--|--------------------------------|------------|
| modelValue | 绑定值 | _object[], string , number , boolean_           | -         |
| format | 时间格式 | _ string_           | YYYY-MM-DD        |
| clearable | 可清除 | _boolean_           | false         |
| filterable | 可输入 | _boolean_           | false         |
| showPanel | 是否显示日期面板，即快捷选择面板 | _boolean_           | false         |
| calendarProps | calendarProps | _object_           | -         |

### Methods

### Slots
