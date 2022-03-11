# Switch 开关

### 介绍
从 iPhone 元年开始，我才知道还有这么丝滑的组件

### 引入

```js
import { createApp } from 'vue'
import { WpSwitch } from 'wisdom-plus'

const app = createApp()
app.use(WpSwitch)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <wp-switch />
        <wp-switch active-text="激活" inactive-text="不激活" width="70" />
    </wp-space>
</template>
```
:::

#### 调整 active 的值

:::demo
```vue
<template>
    <wp-switch v-model="data" :active-value="1" :inactive-value="0" :active-text="String(data)" :inactive-text="String(data)" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const data = ref(1)
</script>
```
:::

#### 调整尺寸、圆角和颜色

:::demo
```vue
<template>
    <wp-switch v-model="data" :active-value="1" :inactive-value="0" width="200" border-radius="4" active-color="orange" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const data = ref(1)
</script>
```
:::

#### 禁用

:::demo
```vue
<template>
    <wp-switch disabled />
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 双向绑定的值       | _any_          | -     |
| activeValue     | 激活的值   | _any_           | true      |
| inactiveValue   | 未激活的值 | _any_ | true      |
| activeColor  | 激活的颜色       | _string_                                                           | -  |
| inactiveColor  | 未激活的颜色       | _string_                                                           | -   |
| activeText  | 激活的文字       | _string_                                                           | -  |
| inactiveText  | 未激活的文字       | _string_                                                           | -   |
| activeText | 激活的文本 | _string_ | - |
| inactiveText | 未激活的文本 | _string_ | - |
| width | 宽度 | _string \| number_ | - |
| height | 高度 | _string \| number_ | - |
| borderRadius | 圆角 | _string \| number_ | - |
| disabled | 是否禁用 | _boolean_ | false |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| change | 值改变的事件 | _(value: any) => void_ | - |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| activeText | 激活的文字 |
| inactiveText | 未激活的文字 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-switch-active-color | var(--wp-color-primary) | 激活的颜色 |
| --wp-switch-inactive-color | rgb(215, 218, 226) | 未激活的颜色 |
| --wp-switch-width | 40px | 开关的宽度 |
| --wp-switch-height | 18px | 开关的高度 |
| --wp-switch-button-width | var(--wp-switch-height) | 按钮的宽度 |
| --wp-switch-border-radius | 20px | 圆角大小 |
| --wp-switch-border | 4px solid var(--wp-switch-inactive-color) | 边框样式 |
| --wp-switch-duration | .3s | 动画的持续时间 |
| --wp-switch-text-font-size | 12px | 文本的尺寸 |
| --wp-switch-text-padding | 0 5px | 文本的padding |
| --wp-switch-text-color | #fff | 文本的颜色 |

