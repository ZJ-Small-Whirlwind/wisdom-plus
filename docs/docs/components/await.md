# Await 等待

### 介绍

等啥呢？

### 引入

```js
import { createApp } from 'vue'
import { WpAwait } from 'wisdom-plus'

const app = createApp()
app.use(WpAwait)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical>
        <div>
            <wp-await :promise="promise">
                <wp-spin size="30" />
                <template #then="{ value }">
                    {{ value }}
                </template>
                <template #catch="{ error }">
                    {{ error }}
                </template>
            </wp-await>
        </div>
        <div>
            <wp-button @click="() => promise = getANewPromise()">做得到的</wp-button>
            <wp-button @click="() => promise = getANewPromiseReject()">做不到的</wp-button>
        </div>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const getANewPromise = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('我做到了！' + Math.random())
        }, 3000)
    })
}
const getANewPromiseReject = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('我做不到' + Math.random())
        }, 1000)
    })
}
const promise = ref(getANewPromise())
</script>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| promise | Promise 对象                                                      | _Promise\<any>_ | -      |

### Slots

| 名称    | 说明     | 参数         |
| ------- | -------- |------------|
| default | 默认插槽，Pending 状态时显示 | - |
| then | 成功，Resolved 状态显示 | _value: any_ |
| catch | 失败，Rejected 状态显示 | _error: any_ |