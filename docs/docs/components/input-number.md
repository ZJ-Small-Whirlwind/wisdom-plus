# Input 数字输入框

### 介绍

一个为数字而生的输入框

### 引入

```js
import { createApp } from 'vue'
import { WpInputNumber } from 'wisdom-plus'

const app = createApp()
app.use(WpInputNumber)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-input-number v-model="input0" controls="both" :precision="2" />
        <wp-input-number v-model="input1" step-strictly :step="20" />
        <wp-input-number v-model="input1" :controls="false"/>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input0 = ref<number>(0)
const input1 = ref<number>(0)
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 绑定的数字变量       | _number_          | -     |
| min | 最小值 | _number_ | - |
| max | 最大值 | _number_ | - |
| step | 步长 | _number_ | 1 |
| stepStrictly | 是否严格步长 | _boolean_ | false |
| controls | 是否显示控制器，可选值为 'both' | _boolean \| 'both' \| 'right'_ | true |
| precision | 精度 | _number_ | - |
| placeholder  | 未输入时显示的文本       | _string_                                                           | '请输入'  |
| disabled  | 是否禁用       | _boolean_                                                           | false   |
| readonly | 是否是只读 | _boolean_ | false |
| prefix | 前缀图标 | _Component_ | - |
| suffix | 后缀图标 | _Component_ | - |
| size | 尺寸 | _'small' \| 'default' \| 'medium' \| 'large'_ | 'default' |
| autofocus | 自动聚焦，原生属性 | _boolean_ | - |
| tabindex | 原生 tabindex 属性 | _string \| number_ | - |
| name | 原生 name 属性 | _string_ | - |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| prefix | 前缀替换插槽 | - |
| suffix | 后缀替换插槽 | - |