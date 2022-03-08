# Basic Select 基础选择器

### 介绍

道生一，一生二

### 引入

```js
import { createApp } from 'vue'
import { WpBasicSelect } from 'wisdom-plus'

const app = createApp()
app.use(WpBasicSelect)
```

## 代码演示

:::demo
```vue
<template>
    <wp-basic-select>
        here will be the thing selecting
    </wp-basic-select>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 双向绑定的数组       | _string[]_          | -     |
| input `v-model` | 输入的内容 | _string_ | - |
| clearable     | 是否显示清空按钮   | _boolean_           | -      |
| tagProps   | 标签的 Props | _Partial\<TagProps\> & Record\<string, any\>_ | {}      |
| placeholder  | 未输入时显示的文本       | _string_                                                           | '请输入标签'  |
| allowRepeat  | 是否允许标签重复       | _boolean_                                                           | false   |
| delimiter | 分隔符，当输入分隔符时就会新增一个标签 | _string[]_ | [] |
| readonly | 是否是只读 | _boolean_ | false |
| disabled | 是否是禁用 | _boolean_ | false |
| size | 尺寸 | _'small' \| 'default' \| 'medium' \| 'large'_ | 'default' |
| spaceProps | Space 组件的 Props，用于设置标签之间的距离 | _Partial\<SpaceProps\> & Record\<string, any\>_ | {} |
| max | 最多显示的 tag 数量 | _number_ | - |
| limit | 限制最多可输入的 tag 数量 | _number_ | - |
| trim | 是否去除两边空格 | _boolean_ | false |
| keyboardDelete | 是否启用键盘删除 | _boolean_ | true |
| auto | 是否自动添加标签 | _boolean_ | false |
| popoverProps | Popover 的 props | _Partial\<PopoverProps> & Record\<any, any>_ | - |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 双向绑定的数组       | _(value: string[]) => void_          | -     |
| update:input      | 双向绑定的输入内容       | _(value: string) => void_          | -     |
| blur | 输入框失去焦点时的事件 | _(e: Event) => void_ | - |
| focus | 输入框获得焦点时的事件 | _(e: Event) => void_ | - |
| keydown | 输入框中按下按键的事件 | _(e: KeyboardEvent) => void_ | - |
| input | 输入框中输入的事件 | _(e: Event) => void_ | - |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| tag | 标签插槽 | _tag: string, index: number, active: boolean, close: () => void_ |
| close-icon | 关闭图标插槽 | _clearable: boolean, clear: () => void_ |
| prefix | 前置插槽 | - |
| suffix | 后置插槽 | - |