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

#### 基础用法，选择日

:::demo
```vue
<template>
    {{value}}
    <WpDatePicker v-model="value"></WpDatePicker>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(null);
</script>
```
:::

## API

### Props

### Methods

### Slots
