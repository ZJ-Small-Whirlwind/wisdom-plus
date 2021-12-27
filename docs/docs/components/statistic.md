# 统计数据 Statistic

### 介绍
UI 画的设计稿里喜欢用一大一小标注数据和单位，切图的时候总是让人很苦恼。

### 引入

```js
import Vue from 'vue'
import { WpStatistic } from 'wisdom-plus'

Vue.use(WpStatistic)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space :size="20" style="width: 200px;" vertical>
        <wp-statistic label="全国人口" value="13" prefix="约" suffix="亿人"/>
        <wp-statistic value="13" prefix="约" suffix="亿人"/>
        <wp-statistic label="全国人口" value="13" prefix="约" suffix="亿人" reverse/>
    </wp-space>
</template>
```
:::

#### 垂直模式

:::demo
```vue
<template>
    <wp-space :size="20" style="width: 200px;" vertical>
        <wp-statistic label="全国人口" value="13" prefix="约" suffix="亿人" vertical/>
        <wp-statistic vertical align="center">
            <template #label>
                世界主要国家和地区
            </template>
            190
            <template #suffix>
                多个
            </template>
        </wp-statistic>
        <wp-statistic vertical align="end" reverse>
            <template #label>
                世界主要国家和地区
            </template>
            190
            <template #suffix>
                多个
            </template>
        </wp-statistic>
    </wp-space>
</template>
```
:::

#### 做任何你想做的

:::demo
```vue
<template>
    <wp-space :size="20" style="width: 200px;" vertical>
        <wp-statistic
            label="全国人口"
            :label-style="{ color: 'blue' }"
            value="13"
            :value-style="{ fontWeight: 'bold', fontSize: '32px' }"
            prefix="约"
            suffix="亿人"
            vertical
        >
            <template #label>
                全国人口
            </template>
        </wp-statistic>
        <wp-statistic vertical align="center" :label-style="{ color: 'red', fontSize: '18px' }">
            <template #label>
                世界主要国家和地区
            </template>
            190
            <template #suffix>
                多个
            </template>
        </wp-statistic>
        <wp-statistic vertical align="end" reverse style="background-color: #f5f5f5; padding: 5px 15px 10px 15px;" value-style="color: green">
            <template #label>
                Pay for it Now!
            </template>
            300$
            <template #suffix>
                Off
            </template>
        </wp-statistic>
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| label      | 标签       | _string \| number_          | -     |
| value      | 数值       | _string \| number_          | -     |
| prefix      | 数值前缀       | _string \| number_          | -     |
| suffix      | 数值后缀       | _string \| number_          | -     |
| labelStyle | 标签样式 | _CSSProperties \| string_ | - |
| valueStyle | 数值样式 | _CSSProperties \| string_ | - |
| prefixStyle | 前缀样式 | _CSSProperties \| string_ | - |
| suffixStyle | 后缀样式 | _CSSProperties \| string_ | - |
| align     | 主轴对齐方式   | _'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'_           | -      |
| justify   | 交叉轴对齐方式 | _'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'_ | -      |
| vertical  | 是否垂直       | _boolean_                                                           | false  |
| reverse      | 是否反向       | _boolean_                                                           | false   |

### Slots

插槽的使用优先级会大于 Props

| 名称    | 说明     |
| ------- | -------- |
| default | 数值 |
| value | 数值（优先级低于 default） |
| prefix | 数值前缀 |
| suffix | 数值后缀 |
| label | 标签 |
| top | 上置的额外内容 |
| bottom | 下置的额外内容 |