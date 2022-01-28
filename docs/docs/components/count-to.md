# CountTo 数值动画

### 介绍

领导：不会有人觉得不高级吧？

### 引入

```js
import { createApp } from 'vue'
import { WpCountTo } from 'wisdom-plus'

const app = createApp()
app.use(WpCountTo)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <wp-count-to :to="500" />
        <wp-count-to :to="500" :precision="2" />
    </wp-space>
</template>
```
:::

#### 添加分割符

:::demo
```vue
<template>
    <wp-space>
        <wp-count-to :to="50000000" format :duration="2000" />
        <wp-count-to :to="50000000" format :format-number="4" :duration="2000" />
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| from      | 数值起始值       | _number_          | 0     |
| to     | 数值结束值，更新时也会有动画   | _number_           | 0      |
| precision   | 数值精度（保留多少位小数） | _number_      | 0 |
| duration      | 动画持续时间 `ms`       | _number_                                                           | 500   |
| title | 标题     | _string_                                                    | -     |
| format | 是否为数字添加间隔符       | _boolean_                                                    | false     |
| formatNumber | 间隔多少位会为数字添加间隔符 | _number_ | 3 |
| formatString | 用于间隔的字符串 | _string_ | , |
| appear | 是否有进入动画 | _boolean_ | true |