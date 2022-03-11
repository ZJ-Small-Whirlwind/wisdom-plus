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
    <wp-switch />
</template>
```
:::

#### 调整 active 的值

:::demo
```vue
<template>
    <wp-switch v-model="data" :active-value="1" :inactive-value="0" />
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
| width | 宽度 | _string \| number_ | - |
| height | 高度 | _string \| number_ | - |
| borderRadius | 圆角 | _string \| number_ | - |
| disabled | 是否禁用 | _boolean_ | false |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| change | 值改变的事件 | _(value: any) => void_ | - |

