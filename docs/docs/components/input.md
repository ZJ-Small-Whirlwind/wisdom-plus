<script lang="ts" setup>
import { SearchOutlined } from '@vicons/antd'
</script>

# Input 输入框

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-input placeholder='请输入' v-model="input" clearable :prefix="SearchIcon" />
        <wp-input v-model="input" readonly />
        <wp-input v-model="input" disabled />
    </wp-space>
</template>

<script lang="ts" setup>
const SearchIcon = SearchOutlined

import { ref } from 'vue'
const input = ref<string>()
</script>
```
:::

#### 密码

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-input type="password" />
    </wp-space>
</template>
```
:::

#### 尺寸

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-input size="small" />
        <wp-input />
        <wp-input size="medium" />
        <wp-input size="large" />
    </wp-space>
</template>

<script lang="ts" setup>
const SearchIcon = SearchOutlined
</script>
```
:::

#### 文本域

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-input type="textarea" />
        <wp-input type="textarea" :rows="5" show-word-size :maxlength="300" autosize />
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`      | 绑定的文本变量       | _string_          | -     |
| clearable     | 是否显示清空按钮   | _boolean_           | -      |
| type   | 文本框的类型，可选值为 textarea 和所有 input 标签支持的 type | _string_ | -      |
| placeholder  | 未输入时显示的文本       | _string_                                                           | '请输入'  |
| disabled  | 是否禁用       | _boolean_                                                           | false   |
| readonly | 是否是只读 | _boolean_ | false |
| prefix | 前缀图标 | _Component_ | - |
| suffix | 后缀图标 | _Component_ | - |
| maxlength | 最多输入的字符数 | _number_ | - |
| showWordSize | 是否显示字符统计 | _boolean_ | false |
| size | 尺寸 | _'small' \| 'default' \| 'medium' \| 'large'_ | 'default' |
| autofocus | 自动聚焦，原生属性 | _boolean_ | - |
| tabindex | 原生 tabindex 属性 | _string \| number_ | - |
| name | 原生 name 属性 | _string_ | - |
| resize | 可调整的维度 | _'none' \| 'both' \| 'horizontal' \| 'vertical'_ | - |
| rows | 文本域的默认高度，行 | _number_ | - |
| showPasswordIcon | 是否显示密码切换按钮 | _boolean_ | true |
| autosize | 是否自适应高度 | _boolean \| {minRows: number, maxRows: number}_ | - |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| prefix | 前缀替换插槽 | - |
| suffix | 后缀替换插槽 | - |
| close-icon | 关闭图标插槽 | - |