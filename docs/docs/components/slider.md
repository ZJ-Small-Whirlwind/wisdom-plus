# Slider 滑块

### 介绍

一个可以互动的进度条

### 引入

```js
import { createApp } from 'vue'
import { WpSlider } from 'wisdom-plus'

const app = createApp()
app.use(WpSlider)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-slider v-model="data"/>
        <wp-slider v-model="data" reverse />
        <wp-space>
            <wp-slider v-model="data" vertical :marks="{ 30: '30%', 50: 'middle', 80: '80%' }" />
            <wp-slider v-model="data" vertical reverse :marks="{ 0: '', 30: '30%', 50: 'middle', 80: '80%' }" />
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const data = ref(60)
</script>
```
:::

#### 范围选择

:::tip
开启范围选择的方式很简单，只需要传入一个数组。
:::

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-slider v-model="data"/>
        <wp-slider v-model="data" reverse />
        <wp-space>
            <wp-slider v-model="data" vertical />
            <wp-slider v-model="data" vertical reverse />
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const data = ref([20, 60])
</script>
```
:::

#### 标记

:::tip
标记可以传入数组或者对象
:::

:::demo
```vue
<template>
    <wp-slider v-model="data" :marks="{ 30: '30%', 50: 'middle', 80: '80%' }"/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const data = ref([20, 60])
</script>
```
:::

#### 步长和显示提示

:::demo
```vue
<template>
    <wp-slider v-model="data" :marks="{ 30: '30%', 50: 'middle', 80: '80%' }" :show-tip="true" :step="10"/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const data = ref(20)
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 滚动条的值，可以为一个数组       | _number \| number[]_          | -     |
| max     | 最大值   | _number_           | 100      |
| min   | 最小值 | _number_ | 0      |
| step  | 步长       | _number_                                                           | 1  |
| vertical      | 是否是纵向       | _boolean_                                                           | false   |
| height | 如果是纵向，滚动条的高度     | _number \| string_                                                    | 100     |
| reverse | 是否翻转       | _boolean_                                                    | false     |
| marks | 标记       | _Record\<number, string> \| number[]_                                                    | -     |
| showTip | 是否显示提示 | _boolean_ | false |

## 定制

因为 slider 本身修改样式比较困难，所以提供了大量的 css 变量供定制

#### 轨道 Track

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-slider-track-background | #f5f5f5 | 轨道的背景颜色 |
| --wp-slider-track-height | 5px | 轨道的高度 |
| --wp-slider-track-border-radius | 5px | 轨道的圆角 |
| --wp-slider-track-active-background | var(--wp-color-primary) | 激活轨道的背景颜色 |

#### 滑块 Thumb

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-slider-thumb-height | 20px | 滑块高度 |
| --wp-slider-thumb-width | 20px | 滑块宽度 |
| --wp-slider-thumb-border-radius | 50% | 滑块的圆角 |
| --wp-slider-thumb-duration | .2s | 滑块过渡的时长 |
| --wp-slider-thumb-border | 4px solid #f5f5f5 | 滑块默认状态下的 border |
| --wp-slider-thumb-background | var(--wp-color-primary) | 滑块默认状态下的背景 |
| --wp-slider-thumb-transform | none | 滑块默认状态下的 transform |
| --wp-slider-thumb-shadow | none | 滑块默认状态下的 drop-shadow |
| --wp-slider-thumb-hover-border | 3px solid #f5f5f5 | 滑块 hover 状态下的 border |
| --wp-slider-thumb-hover-background | var(--wp-color-primary) | 滑块 hover 状态下的背景 |
| --wp-slider-thumb-hover-transform | none | 滑块 hover 状态下的 transform |
| --wp-slider-thumb-hover-shadow | none | 滑块 hover 状态下的 drop-shadow |
| --wp-slider-thumb-active-border | 3px solid #f5f5f5 | 滑块 active 状态下的 border |
| --wp-slider-thumb-active-background | var(--wp-color-primary) | 滑块 active 状态下的背景 |
| --wp-slider-thumb-active-transform | none | 滑块 active 状态下的 transform |
| --wp-slider-thumb-active-shadow | none | 滑块 active 状态下的 drop-shadow |

#### 标记 Mark

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-slider-mark-background | var(--wp-slider-track-background) | 标记的背景 |
| --wp-slider-mark-active-background | var(--wp-slider-track-active-background) | 标记被激活的背景 |
| --wp-slider-mark-color | #666 | 标记文字的颜色 |
| --wp-slider-mark-font-size | 12px | 标记文字的大小 |
| --wp-slider-mark-width | 2px | 标记的宽度 |
| --wp-slider-mark-height | 8px | 标记的高度 |

#### 提示 Tip

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-slider-tip-color | #fff | 提示文字的颜色 |
| --wp-slider-tip-background | rgba(0, 0, 0, .8) | 提示的背景颜色 |
| --wp-slider-tip-padding | 1px 5px | 提示的 padding |
| --wp-slider-tip-border-radius | 4px | 提示的圆角 |