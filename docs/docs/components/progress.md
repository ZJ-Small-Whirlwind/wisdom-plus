# Progress 进度条

### 介绍

一个假的进度条也可以代表你的关怀

### 引入

```js
import { createApp } from 'vue'
import { WpProgress } from 'wisdom-plus'

const app = createApp()
app.use(WpProgress)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-space>
            <wp-button @click="percentage += 10">+10</wp-button>
            <wp-button @click="percentage -= 10">-10</wp-button>
        </wp-space>
        <wp-progress :percentage="percentage" />
        <wp-space :size="20">
            <wp-progress :percentage="percentage" :color="['orange', 'red']" type="vertical" />
            <wp-progress :percentage="percentage" :size="40" type="vertical" align="center" appear/>
            <wp-progress :percentage="percentage" :size="20" type="vertical" align="end" :show-text="false" />
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const percentage = ref(50)
</script>
```
:::

#### 环形进度条

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-space>
            <wp-button @click="percentage += 10">+10</wp-button>
            <wp-button @click="percentage -= 10">-10</wp-button>
        </wp-space>
        <wp-space>
            <wp-progress :percentage="percentage" type="circle" :size="100" appear>
                <template v-if="percentage > 100">
                    爆表了
                </template>
                <template v-else>
                    ~ {{ percentage }}%
                </template>
            </wp-progress>
            <wp-progress :percentage="percentage" type="circle" :color="{ '0%': 'orange', '100%': 'red' }" :size="100" appear :clockwise="false">
                <template v-if="percentage > 100">
                    爆表了
                </template>
                <template v-else>
                    ~ {{ percentage }}%
                </template>
            </wp-progress>
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const percentage = ref(50)
</script>
```
:::

#### 网格进度条 `Beta`

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-space>
            <wp-button @click="percentage += 10">+10</wp-button>
            <wp-button @click="percentage -= 10">-10</wp-button>
        </wp-space>
        <div style="max-width: 400px">
            <wp-progress :percentage="percentage" type="grid" :color="{ '0%': 'orange', '100%': 'red' }" border-radius="0" />
        </div>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const percentage = ref(50)
</script>
```
:::

#### Indeterminate

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-progress indeterminate />
        <wp-progress indeterminate align="end" />
        <wp-space :size="20">
            <wp-progress :percentage="percentage" :color="['orange', 'red']" type="vertical" indeterminate />
            <wp-progress :percentage="percentage" :color="['orange', 'red']" type="vertical" indeterminate align="end" />
            <wp-progress :percentage="percentage" indeterminate type="circle" :color="{ '0%': 'skyblue', '100%': 'blue' }" :size="100" appear :clockwise="false" />
        </wp-space>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const percentage = ref(50)
</script>
```
:::

### 进度条颜色

进度条颜色可以接受以下类型

#### 1. 普通的颜色，适用于所有类型
```js
const color = '#fff'
```

#### 2. Background 参数，适用于 `horizontal` 或 `vertical` 或 `grid`
```js
const color = 'linear-gradient(to right, red, blue)'
```

#### 3. 数组，用于快速生成线性渐变，适用于 `horizontal` 或 `vertical` 或 `grid`
```js
const color = ['red', 'blue']
```

#### 4. 对象，用于快速生成线性渐变，适用于所有类型
```js
const color = {
    '0%': 'red',
    '100%': 'blue'
}
```

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| size      | 进度条轨道尺寸       | _string \| number_          | 10     |
| percentage     | 进度条百分比   | _number_           | 0      |
| type   | 类型 | _'horizontal' \| 'vertical' \| 'circle' \| 'grid'_ | 'horizontal'      |
| height  | 高度，仅 type 为 `vertical` 或 `circle` 时有效       | _number \| string_                                                           | 100  |
| align      | 对齐方式，仅 type 为 `horizontal` 或 `vertical` 或 `grid` 时有效       | _'start' \| 'end' \| 'center'_                                                           | 'start'   |
| borderRadius | 圆角大小，仅 type 为 `horizontal` 或 `vertical` 或 `grid` 时有效     | _string_                                                    | '10px'     |
| color | 进度条轨道颜色<br>type 为 `horizontal` 或 `vertical` 或 `grid` 支持所有类型<br>type 为 `circle` 支持字符串或对象       | _string \| string[] \| Record<string, string>_                                                    | -     |
| backgroundColor | 进度条轨道背景颜色<br>type 为 `horizontal` 或 `vertical` 或 `grid` 支持所有类型<br>type 为 `circle` 仅支持字符串       | _string \| string[] \| Record<string, string>_                                                    | -     |
| strokeLinecap | 进度条轨道末端形状，仅 type 为 `circle` 时有效 | _'square' \| 'butt' \| 'round'_ | 'round' |
| clockwise | 进度条是否顺时针旋转，仅 type 为 `circle` 时有效 | _boolean_ | `true` |
| startPosition | 进度条开始位置，仅 type 为 `circle` 时有效 | _'top' \| 'bottom' \| 'left' \| 'right'_ | 'top' |
| appear | 挂载时是否有动画 | _boolean_ | false |
| indeterminate | 加载进度不确定，通常用于 loading | _boolean_ | false |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽，进度条文本 |
| inner | 进度条内的文本 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-progress-font-size | 14px | 字体大小 |
| --wp-progress-duration | .4s | 过渡动画持续时间 |
| --wp-progress-default-height | 100px | 默认高度 |
| --wp-progress-default-color | #409eff | 默认轨道颜色 |
| --wp-progress-default-bg-color | #eee | 默认轨道背景颜色 |