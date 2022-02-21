# Table 表格

### 介绍
基于原生的表格，暂时没有特别的功能。

### 引入

```js
import { createApp } from 'vue'
import { WpTable } from 'wisdom-plus'

const app = createApp()
app.use(WpTable)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-table :columns="columns" :data="data"></wp-table>
</template>
<script setup lang="ts">
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

#### 带斑马纹表格

:::demo
```vue
<template>
    <wp-table :columns="columns" :data="data" stripe></wp-table>
</template>
<script setup lang="ts">
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

#### 带边框表格

:::demo
```vue
<template>
    <wp-table :columns="columns" :data="data" stripe border></wp-table>
</template>
<script setup lang="ts">
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

#### 固定列和表头

横纵内容过多时，可选择固定列和表头

:::demo
```vue
<template>
    <wp-table :columns="columns" :data="data" stripe border :height="250"></wp-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const columns = ref([
    {label:"日期", prop:"date"},
    {label:"姓名", prop:"name"},
    {label:"省份", prop:"province"},
    {label:"市区", prop:"city"},
    {label:"地址", prop:"address"},
    {label:"邮编1", prop:"zip"},
    {label:"邮编2", prop:"zip"},
    {label:"邮编3", prop:"zip"},
    {label:"邮编4", prop:"zip"},
    {label:"邮编5", prop:"zip"},
    {label:"邮编6", prop:"zip"},
    {label:"邮编7", prop:"zip"},
])
const data = ref([{
    date: '2016-05-03',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-02',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-04',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-01',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-08',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-06',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333
}, {
    date: '2016-05-07',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: "阿撒撒打算打算大撒打算大"
}])
</script>
```
:::

#### 合并表头及单元格

:::demo
```vue
<template>
    <wp-table :columns="columns" :data="data" :spanCell="spanCell" border></wp-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const columns = ref([
    {label:"a", prop:"name",columns:[
        {label:"a-1", prop:"a-1"},
        {label:"a-2", prop:"a-2"},
        {label:"a-3", prop:"a-3",btns:[
            {name:'编辑'},
        ]},
    ]},
    {label:"b", prop:"b"},
    {label:"c", prop:"c", btns:[
        {name:'编辑'},    
    ]},
    {label:"d", prop:"age", btns:[
        {name:'编辑'},    
    ],columns:[
        {label:"d-1", prop:"d-1"},
        {label:"d-2", prop:"d-2"},
        {label:"d-3", prop:"age" , btns:[
            {name:'编辑'},
        ],columns:[
            {label:"d-3-1", prop:"name",columns:[
                {label:"d-3-1-1", prop:"d-3-1-1"},
                {label:"d-3-1-2", prop:"d-3-1-2"},
            ]},
            {label:"d-3-2", prop:"d-3-2"},
            {label:"d-3-3", prop:"d-3-3", btns:[
                {name:'编辑'},
            ]},
        ]},
    ]},
])
const data = ref([
    {
        "a-1":'a-1',
        "a-2":'a-2',
        "a-3":'a-3',
        "b":'bbb',
        "c":'c',
        "d-1":'d-1',
        "d-2":'d-2',
        "d-3-1-1":"d-3-1-1",
        "d-3-1-2":"d-3-1-2",
        "d-3-2":"d-3-2",
        "d-3-3":"d-3-3",
    },
    {
        "a-1":'a-1',
        "a-2":'a-2',
        "a-3":'a-3',
        "b":'b',
        "c":'c',
        "d-1":'d-1',
        "d-2":'d-2',
        "d-3-1-1":"d-3-1-1",
        "d-3-1-2":"d-3-1-2",
        "d-3-2":"d-3-2",
        "d-3-3":"d-3-3",
    },
    {
        "a-1":'a-1',
        "a-2":'a-2',
        "a-3":'a-3',
        "b":'b',
        "c":'c',
        "d-1":'d-1',
        "d-2":'d-2',
        "d-3-1-1":"d-3-1-1",
        "d-3-1-2":"d-3-1-2",
        "d-3-2":"d-3-2",
        "d-3-3":"d-3-3",
    },
])
const spanCell = ({rowIndex, columnIndex})=>{
    if(rowIndex === 0 && columnIndex === 2){
        return [2,3]
    }
    if(rowIndex === 0 && columnIndex === 5){
        return [1,2]
    }
    if(rowIndex === 1 && columnIndex === 5){
        return [2,3]
    }
}
</script>
```
:::

## API

### Props

| 参数  | 说明                                                                                                                       | 类型                                                | 默认值   |
|-----|--------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|-------|
|   columns  | 表头栏目                                                                                                                     | _object[]_                                        | []    |
|   data  | 表格数据                                                                                                                     | _object[]_                                        | []    |
|   spanCell  | 合并单元格                                                                                                                    | _({column,row,rowIndex,columnIndex}) => number[]_ | -     |
|   stripe  | 是否为斑马纹 table                                                                                                             | _boolean_                                         | false |
|   border  | 是否带边框表格                                                                                                                  | _boolean_                                         | false |
|   height  | Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。 | _string/number_                                         | -     |

### Slots

| 参数  | 说明  | 参数                                                 |
|-----|-----|----------------------------------------------------|
|  -  | 默认卡槽  | _column_                                           |
|  header  | 表头插槽   | _{ column, row, spanCell, rowIndex, columnIndex }_ |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明  |
|-----|-----|-----|
| -   | -   | -   |
