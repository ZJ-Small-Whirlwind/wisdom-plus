# Dialog 对话框

### 介绍

对话框组件是 Modal 组件的别名，仅预设值略有不同

### 引入

```js
import { createApp } from 'vue'
import { WpDialog } from 'wisdom-plus'

const app = createApp()
app.use(WpDialog)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-dialog v-model="show" width="400px" title="对话框">
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
    </wp-dialog>
    <wp-button @click="show = !show">显示对话框</wp-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

### 使用 VShow 代替 VIf

:::demo
```vue
<template>
    <wp-dialog v-model="show" width="400px" title="对话框" :overlay="{ useVShow: true }">
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
    </wp-dialog>
    <wp-button @click="show = !show">显示对话框</wp-button>
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
| noOverlay | 是否需要 Overlay | _boolean_ | false |
| modelValue `v-model`     | 是否显示模态框   | _boolean_           | -      |
| transitionName   | 过渡类名 | _string_ | _o-modal-fade_      |
| width  | 模态框的宽度，不填则为自适应       | _string \| number_                                                           | -  |
| showClose      | 是否显示关闭图标       | _boolean_                                                           | true   |
| title | 标题     | _string_                                                    | -     |
| border | 是否显示 title 和 footer 的边框       | _boolean_                                                    | true     |
| borderRadius | 是否圆角或设置圆角的大小 | _boolean \| string_ | true |
| doNotCloseMe | 组件是否不受全局 closeAll 方法影响 | _boolean_ | false |
| type | 类型，可选对话框或抽屉 | _'dialog' \| 'drawer'_ | `dialog` |
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

### closeAllModals 函数

在路由跳转时使用此方法，可直接关闭所有的模态框

```js
import { closeAllModals } from 'wisdom-plus'
closeAllModals()
```

#### 函数签名
_() => void_

### Dialog 函数

快速创建一个对话框

```js
import { Dialog } from 'wisdom-plus'
Dialog({
    title: '提示',
    content: '提示的内容'
})
```

#### 函数签名
_(options?: DialogOptions) => Promise\<void\>_

#### DialogOptions 类型

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| title      | 标题       | _VNode \| string\| (() => VNode)_          | -     |
| content     | 内容   | _VNode \| string \| (() => VNode)_           | -      |
| cancelText   | 取消文本 | _VNode \| string_      | '取消' |
| confirmText  | 确认文本       | _VNode \| string_                                                           | '确认'  |
| footer | 自定义底部 |  _(close?: () =\> void) =\> VNode \| string_ | - |
| showFooter      | 是否显示底部       | _boolean_                                                           | true   |
| showCancel      | 是否显示取消       | _boolean_                                                           | true   |
| showConfirm      | 是否显示确认       | _boolean_                                                           | true   |
| spaceProps | Space 组件的 props     | _SpaceProps_                                                    | -     |
| cancelProps | 取消按钮组件的 props     | _ButtonProps_                                                    | -     |
| confirmProps | 确认按钮组件的 props     | _ButtonProps_                                                    | -     |
| props | 模态框的 props | _ModalProps_ | - |