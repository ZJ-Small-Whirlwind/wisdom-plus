# Collapse 折叠面板

### 介绍

空间折叠

### 引入

```js
import Vue from 'vue';
import { WpCollapse, WpCollapseItem } from 'wisdom-plus';

Vue.use(WpCollapse);
Vue.use(WpCollapseItem);
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
  <wp-collapse>
    <wp-collapse-item title="面板一"> 面板一的内容 </wp-collapse-item>
    <wp-collapse-item title="面板二"> 面板二的内容 </wp-collapse-item>
  </wp-collapse>
</template>
```
:::

<script lang="ts" setup></script>

#### 受控模式

:::demo
```vue
<template>
  <wp-collapse v-model="active">
    <wp-collapse-item title="面板一" :name="0"> 面板一的内容 </wp-collapse-item>
    <wp-collapse-item title="面板二" :name="1"> 面板二的内容 </wp-collapse-item>
  </wp-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const active = ref<number[]>([0])
</script>
```
:::

#### 手风琴模式

:::demo
```vue
<template>
  <wp-collapse v-model="active">
    <wp-collapse-item title="面板一" :name="0"> 面板一的内容 </wp-collapse-item>
    <wp-collapse-item title="面板二" :name="1"> 面板二的内容 </wp-collapse-item>
  </wp-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const active = ref<number>(0)
</script>
```
:::

## Collapse API

### Props

只要把 `v-model` 的值设为 `number` `symbol` `string` 的任意一种，就视为手风琴模式，只能展开至多任意一项

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue      | 激活的面板       | _string \| number \| symbol \| (string \| number \| symbol)[]_          | -     |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 修改激活的面板的函数       | _(value: string \| number \| symbol \| (string \| number \| symbol)[]) => void_          | -     |

## Collapse Item API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| title      | 标题       | _string_          | -     |
| name      | 识别符       | _string \| number \| symbol_          | Symbol()     |
| disabled      | 是否禁用       | _boolean_          | -     |
| showArrow      | 是否显示指示箭头       | _boolean_          | true     |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| change      | 激活参数改变的回调       | _(name: string \| number \| symbol) => void_          | -     |