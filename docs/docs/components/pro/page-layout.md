# PageLayout 页面脚手架

### 介绍

冰，水为之而寒于水

### 引入

```js
import { createApp } from 'vue'
import { WpProPageLayout } from 'wisdom-plus'

const app = createApp()
app.use(WpProPageLayout)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <div style="background-color: #f5f5f5; padding: 20px;">
        <wp-pro-page-layout v-model:data="data" :table="{ columns }" />
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const columns = ref([
    {label:"日期", prop:"date"},
    {label:"姓名", prop:"name"},
    {label:"地址", prop:"address"},
])
const data = ref([{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
}, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
}, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
}, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
}])
</script>
```
:::

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