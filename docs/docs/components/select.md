# 选择器

### 介绍

当选项过多时，使用下拉菜单展示并选择内容。

### 引入

```js
import { createApp } from 'vue'
import { WpSelect } from 'wisdom-plus'

const app = createApp()
app.use(WpSelect)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <WpSelect :options="options" v-model="value"></WpSelect>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const options = ref([{
    value: '选项1',
    label: '黄金糕'
}, {
    value: '选项2',
    label: '双皮奶'
}, {
    value: '选项3',
    label: '蚵仔煎'
}, {
    value: '选项4',
    label: '龙须面'
}, {
    value: '选项5',
    label: '北京烤鸭'
}])

const value = ref('')
</script>
```
:::

## API

### Props
