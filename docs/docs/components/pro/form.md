<script lang="ts" setup>
import { WpInput, WpCheckbox } from '@wisdom-plus/components'
</script>

# Form 数据表单

### 介绍

青出于蓝而胜于蓝

### 引入

```js
import { createApp } from 'vue'
import { WpProForm } from 'wisdom-plus'

const app = createApp()
app.use(WpProForm)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-pro-form
        label-width="150px"
        ref="formRef"
        v-model="formData"
        :grid="{
            gap: [15, 0]
        }"
        :schemas="schemas"
        @submit="handleSubmit"
    />
    <wp-space justify="center">
        <wp-button type="primary" @click="formRef?.submit()">提交</wp-button>
        <wp-button type="info" @click="formRef?.reset()">重置</wp-button>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const formRef = ref<any>(null)
const formData = ref({})

const schemas = [
    {
        prop: 'title',
        label: '标题',
        component: WpInput,
        required: true
    },
    {
        prop: 'title2',
        label: '标题2',
        component: WpInput,
        grid: {
            span: 12
        },
        required: true
    },
    {
        prop: 'title3',
        label: '组件',
        component: WpCheckbox,
        grid: {
            span: 12
        },
        required: true
    }
]

const handleSubmit = async() => {
    console.log(JSON.stringify(formData.value))
}
</script>
```
:::

### 通过函数生成一个 ProForm

```js
import { createApp } from 'vue'
import { proFormGenerate } from 'wisdom-plus'

const app = createApp()
const DataForm = proFormGenerate('DataForm', ElForm, ElFormItem)
app.component('DataForm', DataForm)
```

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| modelValue `v-model` | 双向绑定的对象       | _Record\<string, any>_                                                      | -                  |
| enterToSubmit   | 是否可以通过回车提交表单                  | _boolean_                                                            | false                  |
| schemas | 表单生成参数，可以使用所有的 WpFormItem 的参数以及附加参数                                     | _Schema[]_                                                           | -                  |
| grid | 布局参数 | _Partial\<GridProps>_ | - |
| initReset | 组件创建时是否重置表单 | _boolean_ | - |
| rules | 表单整体的规则，优先级参考 Form | _Record\<string, any>_ | - |
| props | Form 的 Props | _Record\<string, any>_ | - |
| labelWidth | label 的统一宽度 | _string_ | - |
| plain | 是否是纯文本 | _boolean_ | - |
| onSubmit | 表单提交的回调 | _() => void_ | - |


### 插槽

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 任意内容，放置于表单内 | - |
| [prop] | 表单内容替换插槽，替换 prop 对应的表单项 | - |
| [prop]\_plain | 纯文本表单内容替换插槽，替换 prop 对应的纯文本表单项 | - |