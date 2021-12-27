# Overlay 遮罩

### 介绍

遮挡视线用

### 引入

```js
import { createApp } from 'vue'
import { WpOverlay } from 'wisdom-plus'

const app = createApp()
app.use(WpOverlay)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-overlay v-model="show" />
    <wp-button @click="show = !show">显示遮罩</wp-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

### 背景高斯模糊

:::demo
```vue
<template>
    <wp-overlay v-model="show" blur="20px" />
    <wp-button @click="show = !show">显示遮罩</wp-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 是否展示遮罩       | _boolean_          | -     |
| position     | Css position 属性   | _'fixed' \| 'absolute'_           | _'fixed'_      |
| background   | 背景 | _string_ | _'#00000099'_      |
| blur  | 背景高斯模糊，为字符串时代表背景高斯模糊程度       | _boolean \| string_                                                           | false  |
| zIndex      | Z 轴高度       | _number_                                                           | -   |
| to | Popover 元素存放在哪个位置，设为 `null` 则为父元素       | _string \| RendererElement \| null_                                                    | -     |
| clickToClose | 是否可以通过点击关闭遮罩 | _boolean_ | true |
| useVShow | 是否使用 v-show，为否时使用 v-if | _boolean_ | false |
| transitionName | 过渡类名 | _string_ | _'wp-overlay-fade'_ |
| preventScroll | 是否阻止 body 滚动 | _boolean_ | true |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 改变是否展示遮罩       | _(value: boolean) => void_          | -     |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |