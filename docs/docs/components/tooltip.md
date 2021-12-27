# Tooltip 文字提示

### 介绍

就类似于原生的 title，不过比它更快一些

### 引入

```js
import { createApp } from 'vue'
import { WpTooltip } from 'wisdom-plus'

const app = createApp()
app.use(WpTooltip)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
  <wp-space>
    <wp-tooltip title="这是我的内容"> 你好 </wp-tooltip>
    <wp-tooltip title="这是我的内容" :dark="false"> 你好 </wp-tooltip>
  </wp-space>
</template>
```
:::

## API

### Props

本组件可以使用任意 Popover 的 Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| title          | 文字提示内容                                                      | _string_ | -      |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| title | 文字提示内容 |