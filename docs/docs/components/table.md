# Table 表格

### 介绍
基于原生的表格，暂时没有特别的功能。

### 引入

```js
import { createApp } from 'vue'
import { WpTable } from 'wisdom-plus'

const app = createApp()
app.use(WpTable)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-table>
        <tr>
          <th>月份</th>
          <th>存款</th>
        </tr>
        <tr>
          <td>一月</td>
          <td>￥100</td>
        </tr>
        <tr>
          <td>二月</td>
          <td>￥200</td>
        </tr>
        <tr>
          <td>三月</td>
          <td>￥300</td>
        </tr>
    </wp-table>
</template>
```
:::

#### 斑马纹和纵向边框

:::demo
```vue
<template>
    <wp-table stripe border>
        <tr>
          <th>月份</th>
          <th>存款</th>
        </tr>
        <tr>
          <td>一月</td>
          <td>￥100</td>
        </tr>
        <tr>
          <td>二月</td>
          <td>￥200</td>
        </tr>
        <tr>
          <td>三月</td>
          <td>￥300</td>
        </tr>
    </wp-table>
</template>
```
:::

#### 合并单元格

:::demo
```vue
<template>
    <wp-table border>
        <tr>
          <th>月份</th>
          <th colspan="2">存款</th>
        </tr>
        <tr>
          <td rowspan="2">一月</td>
          <td>￥100</td>
          <td>￥300</td>
        </tr>
        <tr>
          <td>￥200</td>
          <td>￥300</td>
        </tr>
        <tr>
          <td rowspan="2">三月</td>
          <td>￥300</td>
          <td>￥300</td>
        </tr>
        <tr>
          <td>￥300</td>
          <td>￥300</td>
        </tr>
        <tr>
          <td colspan="3">小计：￥300</td>
        </tr>
    </wp-table>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| stripe      | 是否使用斑马纹       | _boolean_          | -     |
| border      | 是否有纵向边框       | _boolean_          | -     |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-table-font-size | 14px | 字体大小 |
| --wp-table-border | 1px solid #eee | 表格边框 |
| --wp-table-padding | 10px 15px | 表格项的内边距 |
| --wp-table-stripe-background | #fcfcfc | 斑马纹表格背景 |
| --wp-table-hover-background | #f8f8f8 | hover 时的表格背景 |