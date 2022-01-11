# Drawer 抽屉

### 介绍

抽屉组件是 Modal 组件的别名，仅预设值略有不同

### 引入

```js
import { createApp } from 'vue'
import { WpDrawer } from 'wisdom-plus'

const app = createApp()
app.use(WpDrawer)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-drawer v-model="show" width="400px" title="对话框">
        这里是内容
        <template #footer>
            <wp-space justify="end">
                <wp-button @click="show = !show" size="medium">
                    取消
                </wp-button>
                <wp-button @click="show = !show" size="medium" type="primary">
                    确认
                </wp-button>
            </wp-space>
        </template>
    </wp-drawer>
    <wp-button @click="show = !show">显示抽屉</wp-button>
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
| overlay      | Overlay 组件的 Props       | _Partial\<OverlayProps\> & Record\<string, any\>_          | {}     |
| modelValue `v-model`     | 是否显示模态框   | _boolean_           | -      |
| transitionName   | 过渡类名 | _string_ | _o-modal-fade_      |
| width  | 模态框的宽度，不填则为自适应       | _string \| number_                                                           | -  |
| showClose      | 是否显示关闭图标       | _boolean_                                                           | true   |
| title | 标题     | _string_                                                    | -     |
| border | 是否显示 title 和 footer 的边框       | _boolean_                                                    | true     |
| borderRadius | 是否圆角或设置圆角的大小 | _boolean \| string_ | true |
| doNotCloseMe | 组件是否不受全局 closeAll 方法影响 | _boolean_ | false |
| type | 类型，可选对话框或抽屉 | _'dialog' \| 'drawer'_ | `drawer` |
| from | 如果类型为抽屉，从哪边呼出 | _'left' \| 'right' \| 'top' \| 'bottom'_ | `bottom` |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue     | 是否显示模态框   | _(value: boolean) => void_           | -      |
| open     | 打开的回调   | _() => void_           | -      |
| afterOpen     | 打开动画结束后的回调   | _() => void_           | -      |
| close     | 关闭的回调   | _() => void_           | -      |
| afterClose     | 关闭动画结束后的回调   | _() => void_           | -      |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| title | 标题（头部） |
| footer | 尾部 |