# Grid 网格

### 介绍

生活是一张大网

### 引入

```js
import { createApp } from 'vue'
import { WpGrid, WpGridItem } from 'wisdom-plus'

const app = createApp()
app.use(WpGrid)
app.use(WpGridItem)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-grid :default-span="6">
        <wp-grid-item> Hello </wp-grid-item>
        <wp-grid-item> Hello </wp-grid-item>
        <wp-grid-item> Hello </wp-grid-item>
        <wp-grid-item> Hello </wp-grid-item>
    </wp-grid>
</template>
```
:::

### 间距

:::demo
```vue
<template>
    <wp-grid class="demo2" :default-span="1" :gap="[10, 15]" :cols="4">
        <wp-grid-item v-for="number in 20" :key="number" />
    </wp-grid>
</template>
<style>
.demo2 .wp-grid-item {
    background-color: #f5f5f5;
    height: 50px;
    border-radius: 5px;
}
</style>
```
:::
### 纵向排列

:::demo
```vue
<template>
    <wp-grid class="demo3" :default-span="1" :gap="[10, 15]" :cols="4">
        <wp-grid-item :row-span="2" class="auto" name="13232323" />
        <wp-grid-item :offset="1" />
        <wp-grid-item />
        <wp-grid-item />
        <wp-grid-item />
        <wp-grid-item />
    </wp-grid>
</template>
<style>
.demo3 .wp-grid-item {
    background-color: #f5f5f5;
    height: 50px;
    border-radius: 5px;
}
.demo3 .wp-grid-item.auto {
    height: auto;
}
</style>
```
:::

## Gird API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| gap          | 间距大小                                                      | _string \| number \| [string \| number, string \| number]_ | 0      |
| cols         | 总列数                                                        | _number_                                                   | 24     |
| defaultSpan  | 内部项默认 span                                               | _number_                                                   | 1      |
| placeItems   | align-items 和 justify-items 属性的简写，用于设置对齐模式     | _string_                                                   | -      |
| placeContent | align-content 和 justify-content 属性的简写，用于设置对齐模式 | _string_                                                   | -      |
| dense        | 是否行优先，设置为 `true` 后会优先填充空隙                    | _boolean_                                                  | false  |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |

## GirdItem API

### Props

| 参数        | 说明   | 类型     | 默认值 |
| ----------- | ------ | -------- | ------ |
| span        | 占据列 | _number_ | -      |
| rowSpan     | 占据行 | _number_ | -      |
| offset      | 左偏移 | _number_ | 0      |
| offsetRight | 右偏移 | _number_ | 0      |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |