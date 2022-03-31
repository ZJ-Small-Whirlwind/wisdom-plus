# CountDown 倒计时

### 介绍

为何如此匆匆

### 引入

```js
import { createApp } from 'vue'
import { WpCountDown } from 'wisdom-plus'

const app = createApp()
app.use(WpCountDown)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-count-down />
</template>
```
:::

#### 自定义时间与暂停

:::demo
```vue
<template>
    <wp-button @click="playing = !playing" :type="playing ? 'primary' : 'default'">
        <wp-count-down v-model="time" v-model:playing="playing" />
    </wp-button>
    <wp-button @click="time += 10">
        + 10
    </wp-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const time = ref(120)
const playing = ref(true)
</script>
```
:::

#### 使用插槽自定义渲染内容

:::demo
```vue
<template>
    <wp-count-down v-model="time" v-model:playing="playing" v-slot="{ count, playing, toggle }">
        <wp-button size="small" @click="toggle">切换</wp-button>
        {{ playing ? '播放中' : '暂停' }}
        {{ count }}s
    </wp-count-down>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const time = ref(120)
const playing = ref(true)
</script>
```
:::

#### 与 Input 结合

:::demo
```vue
<template>
    <wp-input>
        <template #suffix>
            <wp-button size="small" type="primary" :disabled="time !== 0" @click="time = 10">
                <template v-if="time !== 0">
                    <wp-count-down v-model="time" v-model:playing="playing" />
                </template>
                <template v-else>
                    获取验证码
                </template>
            </wp-button>
        </template>
    </wp-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const time = ref(0)
const playing = ref(true)
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 倒计时时间       | _number_          | 60    |
| playing `v-model`      | 是否开启播放       | _boolean_          | true    |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| play      | 播放开始的回调       | _() => void_          | -     |
| pause      | 播放暂停的回调       | _() => void_          | -     |
| stop      | 播放结束的回调       | _() => void_          | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽 | _count: number, playing: boolean, play: () => void, pause: () => void, toggle: () => void_ |
