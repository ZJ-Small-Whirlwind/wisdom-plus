# Checkbox 复选框

### 介绍

选择是一件困难的事情

### 引入

```js
import { createApp } from 'vue'
import { WpCheckbox, WpCheckboxGroup } from 'wisdom-plus'

const app = createApp()
app.use(WpCheckbox)
app.use(WpCheckboxGroup)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <wp-checkbox/>
        <wp-checkbox label="带文字的复选框" />
        <wp-checkbox label="部分选中" indeterminate />
        <wp-checkbox label="禁用" disabled />
    </wp-space>
</template>
```
:::

#### 自定义尺寸

:::demo
```vue
<template>
    <wp-space>
        <wp-checkbox label="小" size="small" />
        <wp-checkbox label="默认"/>
        <wp-checkbox label="大" size="large" />
    </wp-space>
</template>
```
:::

#### 插槽

:::demo
```vue
<template>
    <wp-space>
        <wp-checkbox>
            勾选即代表您同意我们的<a href="#" @click.stop>《用户服务协议》</a>
        </wp-checkbox>
    </wp-space>
</template>
```
:::

#### 使用复选框组

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-checkbox v-model="checkedAll" label="全选" :indeterminate="checked.length > 0" />
        <wp-checkbox-group v-model="checked" size="large">
            <wp-checkbox v-for="value in values" :key="value" :value="value" :label="value" />
        </wp-checkbox-group>
        选中值：{{ checked.join(', ') }}
    </wp-space>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const values = ref<string[]>(['1', '2', '3'])
const checked = ref<string[]>(['1'])
const checkedAll = computed<boolean>({
    get: () => {
        return checked.value.length === values.value.length
    },
    set: (value) => {
        if (value) {
            checked.value = [...values.value]
        } else {
            checked.value = []
        }
    }
})
</script>
```
:::

#### 定制复选框圆角

:::demo
```vue
<template>
    <wp-space>
        <wp-checkbox label="20px" size="small" border-radius="20px" />
        <wp-checkbox label="30%" border-radius="30%"/>
        <wp-checkbox label="0" size="large" border-radius="0" />
    </wp-space>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`   | 可控模式值       | _boolean_          | -     |
| value     | 复选框值   | _string \| number \| symbol_           | -      |
| label | 复选框文本内容 | _string_ | - |
| disabled | 是否禁用 | _boolean_ | false |
| indeterminate | 是否部分选中 | _boolean_ | false |
| size | 复选框尺寸 | _'small' \| 'default' \| 'large'_ | 'default' |
| borderRadius | 复选框圆角大小 | _string_ | '2px' |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 复选框值更改的回调       | _(value: boolean) => void_          | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 复选框标签插槽 | - |
| indeterminate | 部分选中图标插槽 | - |
| checked | 选中图标插槽 | - |

## Checkbox Group API

Checkbox Group 组件可以使用所有 Space 组件的 Props

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`   | 可控模式值       | _(string \| number \| symbol)[]_          | -     |
| disabled     | 是否禁用   | _boolean_           | -      |
| size | 复选框尺寸 | _'small' \| 'default' \| 'large'_ | 'default' |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 复选框值更改的回调       | _(value: (string \| number \| symbol)[]) => void_          | -     |