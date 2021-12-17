# Space 空间

### 介绍

每个组件都需要一个私人空间

### 引入

```js
import Vue from 'vue';
import { WpSpace } from 'wisdom-plus';

Vue.use(WpSpace);
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
    </wp-space>
</template>
```
:::

### 垂直

:::demo
```vue
<template>
    <wp-space vertical>
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
    </wp-space>
</template>
```
:::

### 单独设置每项的样式

:::demo
```vue
<template>
    <wp-space :item-style="{
        0: {
            flex: 1
        }
    }">
        <div>Hello</div>
        <div>Hello</div>
        <div>Hello</div>
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| size      | 间距大小       | _string \| number \| [string \| number, string \| number]_          | 10     |
| align     | 主轴对齐方式   | _'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'_           | -      |
| justify   | 交叉轴对齐方式 | _'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'_ | -      |
| vertical  | 是否垂直       | _boolean_                                                           | false  |
| wrap      | 是否换行       | _boolean_                                                           | true   |
| itemStyle | 每项的样式     | _SpaceItemStyle_                                                    | {}     |
| itemClass | 每项的类       | _SpaceItemClass_                                                    | {}     |

#### SpaceItemStyle

| 参数          | 说明          | 类型            | 是否可选 |
| ------------- | ------------- | --------------- | -------- |
| common        | 公共样式      | _CSSProperties_ | 是       |
| [ x: number ] | x 对应 的样式 | _CSSProperties_ | 是       |

#### SpaceItemClass

| 参数          | 说明        | 类型                      | 是否可选 |
| ------------- | ----------- | ------------------------- | -------- |
| common        | 公共类      | _Record<string, boolean>_ | 是       |
| [ x: number ] | x 对应 的类 | _Record<string, boolean>_ | 是       |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |