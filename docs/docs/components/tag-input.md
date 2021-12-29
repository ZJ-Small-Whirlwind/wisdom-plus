# TagInput 标签输入

### 介绍

还是需要给一些东西定标签

### 引入

```js
import { createApp } from 'vue'
import { WpTagInput } from 'wisdom-plus'

const app = createApp()
app.use(WpTagInput)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-tag-input placeholder="请输入标签" clearable :delimiter="[',', '，']"/>
</template>
```
:::

### 尺寸

:::demo
```vue
<template>
    <wp-space vertical :size="[0, 10]">
        <wp-tag-input placeholder="请输入标签" size="small" />
        <wp-tag-input placeholder="请输入标签"/>
        <wp-tag-input placeholder="请输入标签" size="medium" />
        <wp-tag-input placeholder="请输入标签" size="large" />
    </wp-space>
</template>
```
:::

### 显示最大值及限制

:::demo
```vue
<template>
    <wp-tag-input v-model="tags" :max="3" :limit="5" clearable :delimiter="[',']" trim />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tags = ref<string[]>(['1', '2', '3', '4'])
</script>
```
:::

### 自定义标签

:::demo
```vue
<template>
    <wp-tag-input v-model="tags" clearable :delimiter="[',']" :space-props="{ size: 5 }">
        <template #tag="{ tag, close }">
            <span @click="close" :style="{ lineHeight: 'var(--wp-taginput-line-height)' }">{{ tag }},</span>
        </template>
    </wp-tag-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>
```
:::

### 只读和禁用

:::demo
```vue
<template>
    <wp-space vertical :size="[0, 10]">
        <wp-tag-input v-model="tags" clearable readonly />
        <wp-tag-input v-model="tags" clearable disabled />
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tags = ref<string[]>(['标签1', '标签2', '标签3'])
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 双向绑定的数组       | _string[]_          | -     |
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

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 双向绑定的数组       | _(value: string[]) => void_          | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| tag | 标签插槽 | _tag: string, index: number, close: () => void_ |
| close-icon | 关闭图标插槽 | - |