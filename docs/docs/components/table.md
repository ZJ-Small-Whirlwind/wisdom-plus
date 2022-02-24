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
    {label:"日期", prop:"date", width:120},
    {label:"姓名", prop:"name", align:'center'},
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

横纵内容过多时，可选择固定列和表头, 固定表头建议设置栏目width

:::demo
```vue
<template>
    <wp-table :columns="columns" :data="data" stripe border :height="250"></wp-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const columns = ref([
    {label:"日期A",prop:'date', width: 100,},
    {label:"姓名", prop:"name", width:120, fixed:true,offset:0,},
    {label:"省份", prop:"province", width:120, fixed:true,offset:120,},
    {label:"市区", prop:"city", width:120},
    {label:"地址", prop:"address", width:120,fixed:'right', offset: 0},
    {label:"邮编1", prop:"zip", width:120},
    {label:"邮编2", prop:"zip", width:100},
])
const data = ref([{
    date: '2016-05-03----start',
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
    date: '2016-05-07--end',
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

#### 树形型表格、表格拖拽、单选、复选

:::demo

```vue

<template>
    <div>数据效果查看控制台</div>
    <wp-button @click="updateData">点击动态更新数据</wp-button>
    <wp-button @click="getRadio">获取单选数据</wp-button>
    <wp-button @click="setRadio">设置单选数据</wp-button>
    <wp-button @click="getCheckbox">获取复选数据</wp-button>
    <wp-button @click="setCheckbox">设置复选数据</wp-button>
    <wp-button @click="setCheckboxAll">设置全选数据</wp-button>
    <wp-button @click="clearRadio">清除单选数据</wp-button>
    <wp-button @click="clearCheckbox">清除复选数据</wp-button>
    <wp-table ref="table" :columns="columns" :data="data" tree="checkbox" draggable></wp-table>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const columns = ref([
    {radio: true, label: "单选"},
    {checkbox: true, prop: 'checkbox'},
    {label: "index", prop: "index"},
    {label: "日期", prop: "date"},
    {label: "姓名", prop: "name"},
    {label: "地址", prop: "address"},
])
const data = ref([
{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1 弄',
    index: 1,
}, {
    date: '2016-05-04',
    name: '王小虎children',
    address: '上海市普陀区金沙江路 2 弄',
    index: 2,
    children: [{
        date: '2016-05-02',
        name: '王小虎1',
        index: 3,
        address: '上海市普陀区金沙江路 3 弄'
    }, {
        date: '2016-05-04',
        name: '王小虎2',
        index: 4,
        address: '上海市普陀区金沙江路 4 弄',
        children: [
            {name: "asdas", index: 5,},
            {
                name: "545", children: [
                    {
                        name: "asdas",
                        index: 7,
                    },
                    {
                        name: "545",
                        index: 8,
                    },
                ], index: 6,
            },
        ]
    }, {
        date: '2016-05-01',
        name: '王小虎3',
        address: '上海市普陀区金沙江路 9 弄',
        index: 9,
        children: [
            {
                name: "asdas",
                index: 10,
            },
            {
                name: "545",
                index: 11,
            },
        ]
    }, {
        date: '2016-05-03',
        name: '王小虎4',
        index: 12,
        address: '上海市普陀区金沙江路 12 弄'
    }]
}, {
    date: '2016-05-01',
    name: '王小虎',
    index: 13,
    address: '上海市普陀区金沙江路 13 弄'
}, {
    date: '2016-05-03',
    name: '王小虎',
    index: 14,
    address: '上海市普陀区金沙江路 14 弄'
}
])
const updateData = () => {
    data.value = [
        {
            date: '454544445454',
            name: '544',
            index: 45,
            address: '4545'
        }
    ]
    setTimeout(() => {
        columns.value = [
            {label: "index", prop: "index"},
            {label: "地址", prop: "address"},
        ]
    }, 2000)
}
const table = ref(null);
const getRadio = () => {
    console.log(table.value.getRadio())
}
const getCheckbox = () => {
    console.log(table.value.getCheckbox())
}
const setRadio = () => {
    table.value.setRadio((Math.random()*13).toFixed(0))
}
const setCheckbox = () => {
    table.value.setCheckbox([1,12,4,5])
}
const setCheckboxAll = () => {
    table.value.setCheckboxAll()
}
const clearRadio = () => {
    table.value.clearRadio()
}
const clearCheckbox = () => {
    table.value.clearCheckbox()
}
</script>
<style lang="scss">
#app .wp-table .wp-table-cell-row-radio td {
    background-color: #c2b3ff;
}

#app .wp-table .wp-table-cell-row-checkbox td {
    background-color: #00dcb3;
}
</style>
```

:::

## API

### Props

| 参数  | 说明                                                                                                                       | 类型                                                | 默认值      |
|-----|--------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|----------|
|   columns  | 表头栏目                                                                                                                     | _ColumnAttributes[]_                              | []       |
|   data  | 表格数据                                                                                                                     | _object[]_                                        | []       |
|   spanCell  | 合并单元格                                                                                                                    | _({column,row,rowIndex,columnIndex}) => number[]_ | -        |
|   stripe  | 是否为斑马纹 table                                                                                                             | _boolean_                                         | false    |
|   border  | 是否带边框表格                                                                                                                  | _boolean_                                         | false    |
|   height  | Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。 | _[string,number]_                                 | -        |
|   tree  | 是否开启树形表格，并可选执行放置的栏目位置，具体以栏目对应的prop值为准                                                                                    | _[string,boolean]_                                | false    |
|   treeLevelDeep  | 树形箭头缩紧深度                                                                                                                 | _number_                                   | 15       |
|   treeChildrenFieldName  | 自定义树形children字段名称                                                                                                        | _string_                                   | children |
|   draggable  | 是否开启拖拽                                                                                                                   | _boolean_                                   | false    |


### ColumnAttributes

| 参数        | 说明                                                                      | 类型                   | 默认值                     |
|-----------|-------------------------------------------------------------------------|----------------------|-------------------------|
| label     | 显示的标题                                                                   | _string_             | -                       |
| prop      | 对应列内容的字段名，也可以使用 property 属性                                             | _string_             | -                       |
| width     | 对应列的宽度                                                                  | _string_             | -                       |
| min-width | 对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | _string_             | -                       |
| max-width | 对应列的最大                                                                  | _string_             | -                       |
| columns   | 多级表头                                                                    | _ColumnAttributes[]_ | _[]_                    |
| fixed     | 对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | _string, boolean_    | 可选（true, left, right）   |
| align     | 文本对齐方式                                                                  | _string_             | 可选（ left,center, right） |
| radio     | 单选栏目                                                                    | _boolean_            | false                   |
| checkbox     | 复选栏目                                                                    | _boolean_             | false |

### Methods

| 参数  | 说明     | 参数                             |
|-----|--------|--------------------------------|
|  getRadio  | 获取单选数据 | _()=>row_                      |
|  setRadio  | 设置单选数据 | _(rowIndex)=>void)_            |
|  clearRadio  | 清除单选数据 | _()=>void_                     |
|  getCheckbox  | 获取复选数据 | _()=>row[]_                    |
|  setCheckbox  | 设置复选数据 | _(rowIndexs:rowIndex[])=>void_ |
|  setCheckboxAll  | 全选数据   | _(bool:boolean = true)=>void_  |
|  clearCheckbox  | 清除复选数据 | _()=>void_                       |

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
