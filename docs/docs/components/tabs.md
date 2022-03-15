# Tabs 标签页

### 介绍

一个符合直觉的设计

### 引入

```js
import { createApp } from 'vue'
import { WpTabs, WpTab } from 'wisdom-plus'

const app = createApp()
app.use(WpTabs)
app.use(WpTab)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-tabs>
        <wp-tab title="test">
            内容
        </wp-tab>
        <wp-tab title="test2">
            内容2
        </wp-tab>
        <wp-tab title="test">
            <template #title>
                插槽
            </template>
            内容3
        </wp-tab>
    </wp-tabs>
</template>
```
:::

#### 可关闭，卡片式

:::tip
子组件设置 closable 会覆盖父组件的 closable
:::

:::demo
```vue
<template>
    <wp-tabs closable card>
        <wp-tab title="首页" :closable="false">
            首页
        </wp-tab>
        <wp-tab title="测试页面1">
            测试页面1
        </wp-tab>
        <wp-tab>
            <template #title>
                测试页面2
            </template>
            测试页面2
        </wp-tab>
        <wp-tab>
            <template #title>
                这个标题很长所以需要耐心的看
            </template>
            这个标题很长所以需要耐心的看
        </wp-tab>
    </wp-tabs>
</template>
```
:::

#### 惰性渲染

:::demo
```vue
<template>
    <wp-tabs closable lazy line-width="20">
        <wp-tab title="test">
            <template #title>
                插槽
            </template>
            sddsds
        </wp-tab>
        <wp-tab title="test2">
            内容2
        </wp-tab>
        <wp-tab title="test">
            <template #title>
                插槽
            </template>
            sddsds
        </wp-tab>
        <wp-tab title="test">
            <template #title>
                插槽大叔大婶大所阿斯达撒大萨达阿萨斯阿斯达阿斗
            </template>
            sddsds
        </wp-tab>
        <wp-tab title="test">
            <template #title>
                插槽asdasadsdssssssssssssss
            </template>
            sddsds
        </wp-tab>
    </wp-tabs>
</template>
```
:::

#### 仅输出标题

:::demo
```vue
<template>
    <wp-tabs closable lazy title-only>
        <wp-tab>
            <template #title>
                只要热烈，都好过温存
            </template>
            1
        </wp-tab>
        <wp-tab title="几经冷漠，也不屑容忍" />
        <wp-tab title="清风徐来，水波不兴" />
        <wp-tab title="那个剧本，没有分生" />
    </wp-tabs>
</template>
```
:::

## API

### Props

WpTab 上组件的 attrs 会被集成到 标题对应的 dom 上

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 激活项       | _string \| symbol \| number \| boolean_          | -     |
| closable     | 是否可关闭   | _boolean_           | false      |
| spaceProps   | Space 组件的 Props | _Partial\<SpaceProps\> & Record\<string, any\>_ | -      |
| xScrollProps  | XScroll 组件的 Props       | _Partial\<XScrollProps\> & Record\<string, any\>_                                                           | -  |
| duration | 过渡动画持续时长 | _number_ | 300 |
| showLine | 是否显示下划线，仅非 card 模式下可用 | _boolean_ | true |
| lineWidth | 下划线的宽度，如果不设置，则与标题的宽度一致 | _number \| string_ | - |
| titleOnly | 是否仅显示标题 | _boolean_ | false |
| lazy | 是否惰性渲染（使用 v-if）| _boolean_ | false |
| card | 是否使用卡片模式 | _boolean_ | false |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| close      | tab 关闭的回调       | _(index: string \| symbol \| number \| boolean) => void_          | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽 | - |
| prefix | 标题前置插槽 | - |
| suffix | 标题后置插槽 | - |
| close | 关闭按钮替换插槽 | - |

## WpTab API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| title      | 标题       | _string_          | -     |
| index     | 唯一识别码，如果不设置，则为组件的索引   | _string \| symbol \| number \| boolean_           | -      |
| closeable   | 是否可关闭 | _boolean_ | -      |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽 | - |
| title | 标题替换插槽 | - |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-tabs-active-color | var(--wp-color-primary) | 激活颜色 |
| --wp-tabs-title-border | 1px solid #eee | 标题下边框 |
| --wp-tabs-title-font-size | 14px | 标题字号大小 |
| --wp-tabs-title-padding | 0 10px | 标题内边距 |
| --wp-tabs-title-cell-padding | 10px 0 | 标题每项内边距 |
| --wp-tabs-title-close-font-size | 12px | 标题关闭按钮字号 |
| --wp-tabs-title-close-margin-left | 10px | 标题关闭按钮左边距 |
| --wp-tabs-title-close-color | #666 | 标题关闭按钮颜色 |
| --wp-tabs-line-height | 2px | 标题下划线高度 |
| --wp-tabs-tab-padding | 10px | tab 页内边距 |
| --wp-tabs-tab-padding | 14px | tab 页字号大小 |
| --wp-tabs-card-title-background | #eee | 卡片模式下的标题背景 |
| --wp-tabs-card-title-active-background | #fff | 卡片模式下的标题激活背景 |
| --wp-tabs-card-title-padding | 0 | 卡片模式下的标题内边距 |
| --wp-tabs-card-title-cell-padding | 10px 15px | 卡片模式下的标题每项内边距 |
| --wp-tabs-card-title-font-size | 13px | 卡片模式下的标题字号 |
| --wp-tabs-card-title-color | #333 | 卡片模式下的标题颜色 |