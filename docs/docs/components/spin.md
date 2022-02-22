## Spin 加载中

### 介绍

方便在后台做一些事情

### 引入

```js
import { createApp } from 'vue'
import { WpSpin } from 'wisdom-plus'

const app = createApp()
app.use(WpSpin)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space align="center">
        <wp-spin size="36px" />
        <wp-spin size="24px" text="加载中…" />
        <wp-spin size="24px" text="加载中…" vertical color="#aaa" />
    </wp-space>
</template>
```
:::

#### 嵌套使用

:::demo
```vue
<template>
    <wp-spin size="24px" text="加载中…">
        <div style="height: 300px; width: 300px; background-color: #aaa;"></div>
    </wp-spin>
</template>
```
:::

#### 全屏

:::demo
```vue
<template>
    <wp-button @click="onLoading">开启</wp-button>
    <wp-spin size="24px" text="加载中…" fullscreen :loading="loading" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const loading = ref(false)
const onLoading = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 3000)
}
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| size      | 加载图标尺寸       | _number \| string_          | -     |
| color     | 加载图标颜色   | _string_           | -      |
| vertical   | 是否纵向排列文字 | _boolean_ | false      |
| textSize      | 文本尺寸       | _number \| string_          | -     |
| textColor     | 文本颜色   | _string_           | -      |
| text   | 文本内容 | _string_ | -      |
| loading  | 是否加载中，仅默认插槽中存在内容使用       | _boolean_                                                           | true  |
| fullscreen | 是否全屏 | _boolean_ | true |
| background | 自定义背景 | _stirng_ | - |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽，如果存在，则为嵌套使用 |
| text | 文本替换插槽 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-spin-spinner-size | 1em | 加载图标大小 |
| --wp-spin-spinner-color | var(--primary-color) | 加载图标颜色 |
| --wp-spin-text-font-size | 14px | 文本字体大小 |
| --wp-spin-text-color | var(--primary-color) | 文本颜色 |
| --wp-spin-spinner-animation-duration | 3s | 动画持续时长 |
| --wp-spin-background | rgba(255, 255, 255, .6) | 背景 |