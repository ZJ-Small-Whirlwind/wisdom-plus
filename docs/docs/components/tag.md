<script lang="ts" setup>
import { HomeFilled, NodeCollapseOutlined } from '@vicons/antd'
</script>


# Tag 标签

### 介绍

不要随便给人打上标签

### 引入

```js
import { createApp } from 'vue'
import { WpTag } from 'wisdom-plus'

const app = createApp()
app.use(WpTag)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space align="center">
        <wp-tag size="small">
            Hello, world.
        </wp-tag>
        <wp-tag closable :icon="HomeFilled2">
            Hello, world.
        </wp-tag>
        <wp-tag size="medium">
            Hello, world.
        </wp-tag>
        <wp-tag size="large">
            Hello, world.
        </wp-tag>
    </wp-space>
</template>

<script lang="ts" setup>
const HomeFilled2 = HomeFilled
</script>
```
:::

#### 自定义颜色

:::demo
```vue
<template>
    <wp-space align="center">
        <wp-tag :color="['#fff', 'green']">
            Hello, world.
        </wp-tag>
        <wp-tag :color="['#fff', 'blue']">
            Hello, world.
        </wp-tag>
        <wp-tag :color="['#fff', 'orange']">
            Hello, world.
        </wp-tag>
        <wp-tag :color="['#000', '#fff']">
            Hello, world.
        </wp-tag>
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| label      | 标签内容       | _string_          | -     |
| icon     | 图标   | _Component_           | -      |
| closable   | 是否可关闭 | _boolean_ | -      |
| color  | 颜色数组，格式为 \[字体颜色, 背景色\]       | _\[string, string\]_                                                           | -  |
| size      | 尺寸       | _'small' \| 'default' \| 'medium' \| 'large'_                                                           | 'default'   |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| close      | 点击关闭后的回调       | _(e: Event) => void_          | -     |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| icon | 图标插槽 |
| close-icon | 关闭图标插槽 |
