# Radio 单选框

### 介绍

选择是一件困难的事情

### 引入

```js
import { createApp } from 'vue'
import { WpRadio, WpRadioGroup } from 'wisdom-plus'

const app = createApp()
app.use(WpRadio)
app.use(WpRadioGroup)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <wp-radio/>
        <wp-radio label="带文字的单选框" />
        <wp-radio label="禁用" disabled />
    </wp-space>
</template>
```
:::

#### 自定义尺寸

:::demo
```vue
<template>
    <wp-space>
        <wp-radio label="小" size="small" />
        <wp-radio label="默认"/>
        <wp-radio label="大" size="large" />
    </wp-space>
</template>
```
:::

#### 使用单选框组

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-button @click="disabled = !disabled">禁用</wp-button>
        <wp-radio-group v-model="checked" :disabled="disabled" size="large">
            <wp-radio v-for="value in values" :key="value" :value="value" :label="value" />
        </wp-radio-group>
        选中值：{{ checked }}
    </wp-space>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const values = ref<string[]>(['1', '2', '3'])
const checked = ref<string>('1')
const disabled = ref(false)
</script>
```
:::

#### 定制单选框圆角

:::demo
```vue
<template>
    <wp-space>
        <wp-radio label="20px" size="small" border-radius="20px" />
        <wp-radio label="30%" border-radius="30%"/>
        <wp-radio label="0" size="large" border-radius="0" />
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`   | 可控模式值，若没有 value，则判断值是否为真，若存在 value，则判断值是否与 value 相等       | _string \| number \| symbol \| boolean_          | -     |
| value     | 单选框值   | _string \| number \| symbol_           | -      |
| label | 单选框文本内容 | _string_ | - |
| disabled | 是否禁用 | _boolean_ | false |
| size | 单选框尺寸 | _'small' \| 'default' \| 'large'_ | 'default' |
| borderRadius | 单选框圆角大小 | _string_ | '2px' |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 单选框值更改的回调       | _(value: string \| number \| symbol \| boolean) => void_          | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 单选框标签插槽 | - |
| checked | 选中图标插槽 | - |
| unchecked | 未选中插槽 | - |

## Radio Group API

Radio Group 组件可以使用所有 Space 组件的 Props

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`   | 可控模式值       | _string \| number \| symbol_          | -     |
| disabled     | 是否禁用   | _boolean_           | -      |
| size | 单选框尺寸 | _'small' \| 'default' \| 'large'_ | 'default' |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 单选框值更改的回调       | _(value: string \| number \| symbol) => void_          | -     |