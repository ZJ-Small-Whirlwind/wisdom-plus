# PopConfirm 气泡确认框

### 介绍

一般来说比较危险的操作都需要确认

### 引入

```js
import { createApp } from 'vue'
import { WpPopConfirm } from 'wisdom-plus'

const app = createApp()
app.use(WpPopConfirm)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-pop-confirm title="提示" :confirm-props="{ type: 'danger' }">
        <template #reference>
            <wp-button type="danger">删除</wp-button>
        </template>
        真的要删除吗？
    </wp-pop-confirm>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 是否展示确认框       | _boolean_          | -     |
| popover | Popover 的 Props | _Partial\<PopoverProps\> & Record<string, any\>_ | {} |
| confirmText | 确认文本 | _string_ | '确认' |
| cancelText | 取消文本 | _string_ | '取消' |
| confirmProps | 确认按钮的 Props | _Partial\<ButtonProps\> & Record<string, any\>_ | {} |
| cancelProps | 取消按钮的 Props | _Partial\<ButtonProps\> & Record<string, any\>_ | {} |
| spaceProps | Space 组件的 Props | _Partial\<SpaceProps\> & Record<string, any\>_ | {} |
| title | 标题 | _string_ | - |
| showFooter | 是否显示底部 | _boolean_ | `true` |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 改变是否展示确认框       | _(value: boolean) => void_          | -     |
| cancel      | 取消按钮点击后的回调       | _() => void_          | -     |
| confirm      | 确认按钮点击后的回调       | _() => void_          | -     |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| reference | 触发元素 |
| title | 标题 |
| footer | 底部替换元素 |