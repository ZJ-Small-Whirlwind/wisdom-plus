<script lang="ts" setup>
import { StarOutlined, PullRequestOutlined } from '@vicons/antd'
</script>

# ActionSheet 动作菜单

### 介绍

这是一个几乎只在手机端才会用到的组件，但我们支持了PC端（吧）

### 引入

```js
import { createApp } from 'vue'
import { WpActionSheet } from 'wisdom-plus'

const app = createApp()
app.use(WpActionSheet)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <wp-button @click="show = true">显示组件</wp-button>
        <wp-button @click="show2 = true">显示“对话框”样式组件</wp-button>
    </wp-space>
    <wp-action-sheet
        v-model="show"
        description="这是一段描述"
        from="bottom"
        :list="[
            {
                title: '收藏',
                icon: StarOutlined2
            },
            {
                title: '设为特别关注',
                description: '首页优先显示 TA 的内容',
                icon: PullRequestOutlined2,
                click: (record, done) => done()
            }
        ]"
    />
    <wp-action-sheet
        v-model="show2"
        description="这是一段描述"
        type="dialog"
        :handler="false"
        :list="[
            {
                title: '收藏',
                icon: StarOutlined2,
                disabled: true
            },
            {
                title: '设为特别关注',
                description: '首页优先显示 TA 的内容',
                icon: PullRequestOutlined2
            }
        ]"
    />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const StarOutlined2 = StarOutlined
const PullRequestOutlined2 = PullRequestOutlined

const show = ref(false)
const show2 = ref(false)
</script>
```
:::

## API

### Props

ActionSheet 组件可以使用全部 Modal 组件的 Props（预设默认值略有不同）。

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`   | 是否显示动作菜单       | _boolean_          | false     |
| showCancel     | 是否显示取消按钮   | _boolean_           | true      |
| cancelText | 取消按钮文本 | _string \| VNode_ | '取消' |
| description  | 描述       | _boolean_                                                           | - |

### 与 Props 的差异

本组件基于 Modal 组件，但以下 Props 的默认值略有不同

| 参数      | 默认值 |
| ---- | --- |
| type | 'drawer' |
| showClose | false |
| width | 400 |
| handler | true |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽，位置在描述与项之间 | - |
| description | 顶部描述 | - |
| item | 选项插槽 | ...ActionSheetRecord |
| cancel | 取消按钮插槽 | - |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| click | 每项点击事件 | _(record: DropdownRecord, done: () => void) => void_

## 类型

### ActionSheetRecord

| 名称 | 说明 | 类型 | 是否可选 |
| --- | --- | --- | --- |
| index | 唯一标识符 | _string \| number \| symbol_ | 是 |
| title | 标题 | _string \| VNode_ | 是 |
| icon | 图标 | _Component_ | 是 |
| disabled | 是否禁用 | _boolean_ | 是 |
| description | 描述 | _description_ | 是 |
| click | 点击事件，手动调用 done 关闭，返回 `true` 时不会将点击事件传到父级 | _(record?: ActionSheetRecord, done?: () => void) => void_ | 是 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-action-sheet-font-size | 16px | 字体大小 |
|    --wp-action-sheet-padding-top-bottom | 10px | 单项上下内边距 |
|    --wp-action-sheet-padding-left-right | 20px | 单项左右内边距 |
|    --wp-action-sheet-icon-right | 20px | 图标大小 |