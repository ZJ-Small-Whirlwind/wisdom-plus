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
        <wp-pro-page-layout v-model:data="data" :table="{ columns }" :total="data.length"/>
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

### onPageEnter

针对 Keep-alive 的组件，使用 onPageEnter 函数可以在第一次进入时通过 created 生命周期执行函数，未来进入时通过 activated 生命周期执行函数。

```ts
import { onPageEnter } from 'wisdom-plus'
onPageEnter(handleQuery)
```

函数签名

```ts
const onPageEnter: (handleCreated: () => void, handleActivated?: (() => void) | undefined) => void
```

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| data `v-model` | 表格数据       | _unknown_                                                      | -                  |
| form   | 表单选项                  | _{ field: string, placehoder: string, queryAfterReset: boolean, hideReset: boolean, hideInput: boolean, hideSearch: boolean }_                                                            | -                  |
| table | 表格选项 | _{ props: WpTableProps, columns: WpTableProps['columns'], hideSelection: boolean, keepSelection: boolean }_ | -                  |
| apis | 接口 | _{ list: (data: Record\<string, any>, page: PageMap) => Promise\<ResponseType\<List\<any>>> }, delete: (ids: (number \| string)[]) => Promise\<ResponseType\<any>>_ | - |
| showCheckedDelete | 是否显示批量删除按钮 | _boolean_ | - |
| showPagination | 是否显示分页 | _boolean_ | - |
| total | 项目总数，会覆盖内部的项目总数 | _boolean_ | - |
| delete | 删除函数，填写本字段则不会使用 apis 内的 delete | _(items: any[]) => Promise\<unknown>_ | - |
| spaceProps | Space 组件的 Props | _Partial\<SpaceProps>_ | - |
| queryOnActive | 在激活的时候查询（仅 keep-alive 模式下有效） | _boolean_ | - |

### 插槽

本组件继承了 table 组件的所有插槽

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| form | 表单插槽 | - |
| formPrefix | 表单前置插槽 | - |
| buttons | 按钮插槽 | - |