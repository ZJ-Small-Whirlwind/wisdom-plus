# Image 图片

### 介绍

Img 是 inline 元素，却有着 inline-block 的表现

### 引入

```js
import { createApp } from 'vue'
import { WpImage } from 'wisdom-plus'

const app = createApp()
app.use(WpImage)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space align="end">
        <wp-image size="100" src="" />
        <wp-image src="https://avatars.githubusercontent.com/u/26594629?v=4" />
    </wp-space>
</template>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| size | 图片的尺寸                                                      | _number \| string \| [number \| string, number \| string]_ | -      |
| src | 图片地址                                                        | _src_                                                   | -     |
| contain | 图片适应容器的方式 | _'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'_                                                   | -      |
| borderRadius | 图片的圆角程度 | _string_                                                   | -      |
| background | 图片背景 | _string_                                                   | '#f5f5f5'      |
| color | 图标和文字的颜色 | _string_                                                   | -      |
| alt | 图片的 alt 属性 | _string_                                                   | -      |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽，可以任意替换图片 |
| loading | 加载中状态的插槽 |
| error | 加载错误的插槽 |
| empty | src 为空时的插槽 |