# List 列表

### 介绍

子子孙孙无穷匮也

### 引入

```js
import { createApp } from 'vue'
import { WpList } from 'wisdom-plus'

const app = createApp()
app.use(WpList)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-list style="max-height: 150px; overflow: auto;" :load="handleLoad" :finished="finished">
        <div style="height: 30px; display: flex; align-items: center; justify-content: center;" v-for="i in number">
            {{ i }}
        </div>
    </wp-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const finished = ref(false)
const number = ref(20)
const handleLoad = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            number.value += 20
            if (number.value === 100) finished.value = true
            resolve()
        }, 1000)
    })
}
</script>
```
:::

#### 错误提示和下拉刷新

:::demo
```vue
<template>
    <wp-list style="max-height: 150px; overflow: auto;" :load="handleLoad" :finished="finished" pull-refresh>
        <div style="height: 30px; display: flex; align-items: center; justify-content: center;" v-for="i in number">
            {{ i }}
        </div>
    </wp-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const finished = ref(false)
const number = ref(20)
const handleLoad = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject()
        }, 1000)
    })
}
</script>
```
:::

#### 虚拟渲染

:::demo
```vue
<template>
    <wp-list style="max-height: 150px;" :finished="finished" :items="items" :load="handleLoad" virtual>
        <template #="{ item, index }">
            <div style="display: flex; align-items: center; justify-content: center;" :style="{ height: `${item.height}px` }" :key="item.key">
                {{ item.key }}
            </div>
        </template>
    </wp-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const finished = ref(false)
const items = ref(new Array(30).fill(0).map((item, index) => ({
    height: Math.random() * 30 + 50,
    key: index + 1
})))
const handleLoad = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            new Array(30).fill(0).forEach(item => {
                items.value.push({
                    height: Math.random() * 30 + 50,
                    key: items.value.length + 1
                })
            })
            if (items.value.length >= 150) finished.value = true
            resolve()
        }, 1000)
    })
}
</script>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| loading `v-model:loading`         | 是否在加载中                                                        | _boolean_                                                   | -     |
| error `v-model:error`   | 是否错误     | _boolean_                                                   | -      |
| finished    | 是否完成                                                      | _boolean_ | false      |
| virtual  | 是否使用虚拟列表渲染                                               | _boolean_                                                   | false      |
| loadingText   | 加载中文本     | _string_                                                   | '加载中'      |
| errorText | 错误文本 | _string_ | '加载失败' |
| finishedText   | 完成文本     | _string_                                                   | '没有更多了'      |
| rootMargin `non-virtual` | IntersectionObserver API 的 rootMargin 属性，仅非虚拟列表可用 | _string_ | - |
| threshold `non-virtual` | IntersectionObserver API 的 threshold 属性，仅非虚拟列表可用 | _number_ | - |
| direction | 列表渲染方向，可选项为 'up'     | _'down' \| 'up'_                                                   | 'down'      |
| items `virtual` | 虚拟列表渲染项，仅虚拟列表可用 | _Record\<string, any>[]_ | - |
| itemSize `virtual` | 虚拟列表渲染项高度，仅虚拟列表可用 | _number_ | 10 |
| virtualListProps `virtual` | 虚拟列表的 Props，仅虚拟列表可用 | _Partial\<VirtualListProps> & Record\<string, any>_ | - |
| load | 加载函数 | _() => Promise\<void>_ | - |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽 | `virtual` item, index |
| loading | 加载中插槽 | - |
| error | 错误插槽 | - |
| finished | 完成插槽 | - |