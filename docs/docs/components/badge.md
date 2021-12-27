# Badge 徽章

### 介绍

强迫症福音

### 引入

```js
import { createApp } from 'vue'
import { WpBadge } from 'wisdom-plus'

const app = createApp()
app.use(WpBadge)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space align="center">
        <wp-badge />
        <wp-badge :value="200" :max="99" />
        <wp-badge :value="2">
            <wp-button>更多</wp-button>
        </wp-badge>
        <wp-badge>
            <wp-button>更多</wp-button>
        </wp-badge>
        <wp-badge value="任意字符串" />
    </wp-space>
</template>
```
:::

#### 定制

:::demo
```vue
<template>
    <wp-space align="center">
        <wp-badge value="任意字符串" />
        <wp-badge value="任意背景" color="#eee" style="--wp-badge-color: #333; --wp-badge-font-size: 12px;" />
        <wp-badge style="--wp-badge-font-size: 14px;" color="#469">
            <template #value>
                插槽
            </template>
            <wp-button>更多</wp-button>
        </wp-badge>
    </wp-space>
</template>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| value | Badge 显示的值，如果不填写，则显示为 dot 模式                                                      | _number \| string_ | -      |
| color         | 背景颜色                                                        | _string_                                                   | '#f56c6c'     |
| hidden  | 是否隐藏徽章 | _boolean_                                                   | false      |
| max | 徽章数字最大值，如果使用 slot 或者 value 的类型为 string 则无效     | _number_                                                   | -      |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| value | 值替换插槽 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-badge-size | 10px | 徽章大小 |
| --wp-badge-font-size | 13px | 徽章文字大小 |
| --wp-badge-color | #fff | 徽章文字颜色 |