# Table 表格

### 介绍
基于原生的表格

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
    <wp-table @add="add" :columns="columns" :data="data"></wp-table>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const columns = ref([
    {label: "日期", prop: "date", width: 120},
    {label: "姓名", prop: "name", align: 'center'},
    {label: "地址", prop: "address"},
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
const add = (item) => {
    console.log(item)
}
</script>
```
:::

#### 操作按钮

:::demo

```vue

<template>
    <wp-table @add="add" :columns="columns" :data="data"></wp-table>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const columns = ref([
    {label: "日期", prop: "date", width: 120},
    {label: "姓名", prop: "name", align: 'center'},
    {label: "地址", prop: "address"},
    {
        label: "操作", prop: "address", btns: [
            {name: '添加', type: 'primary', emit: 'add'},
            {name: '删除'},
            {name: '编辑'},
            {name: '详情', type:'text', class:"default_bg"},
            {name: '详情', type:'text', class:"success_bg"},
            {name: '详情', type:'text', class:"delete_bg"},
            {name: '详情', type:'text', class:"primary_bg"},
            {name: '详情', type:'text', class:"orange_bg"},
            {name: '详情', type:'text', class:"black_bg"},
            {name: '详情', type:'text', class:"primary"},
            {name: '详情', type:'text', class:"success"},
        ],
    },
    {
        label: "折叠操作菜单", prop: "address", btns: [
            {name: '添加', type: 'primary', emit: 'add'},
            {name: '删除'},
            {name: '编辑', class:'primary'},
            {name: '其他', children:[
                {name: '详情', type:'text', class:"default_bg"},
                {name: '详情', type:'text', class:"success_bg"},
                {name: '详情', type:'text', class:"delete_bg", groupName:"分组"},
                {name: '详情', type:'text', class:"primary_bg"},
                {name: '详情', type:'text', class:"orange_bg"},
                {name: '详情', type:'text', class:"black_bg"},
                {name: '详情', type:'text', class:"primary"},
                {name: '详情', type:'text', class:"success"},
            ]},
            
        ],
        dropdown:true,
    },
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
const add = (item) => {
    console.log(item)
}
</script>
```
:::

#### 双击单元格快捷编辑

:::demo

```vue

<template>
    <wp-table :columns="columns" :data="data" @edit-save="editSave"></wp-table>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const columns = ref([
    {label: "日期", prop: "date", width: 120, edit: true},
    {label: "姓名", prop: "name", edit: true, editIcon:true},
    {label: "地址", prop: "address", edit: true},
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

const editSave = (value, {next}) => {
    console.log(value);
    next();
}
</script>
```
:::

#### 排序、过滤、搜索、label过滤、Ellipsis文本省略

:::demo
```vue
<template>
    <wp-table ref="table" :columns="columns" :data="data" @clickFilter="clickFilter"></wp-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const table = ref(null)
const clickFilter = (...arg)=>{
    console.log(arg)
}
const columns = ref([
    {label:"日期", prop:"date", width:120, sort:true, filter:true,filterData:[
        {title:"自定义过滤数据",index:1}    
    ]},
    {label:"姓名", prop:"name", align:'center', filter:true},
    {label:"地址", prop:"address", sort:true},
    {label:"地址", prop:"address", search:true, placeholder:"请输入关键字",change:(v,column)=>{
        table.value.search(v,column)
    }},
    {label:"label过滤", prop:"status", labelFilter:({value})=>{
            return {
                1:"状态1",
                2:"状态2",
                3:"状态3",
                4:"状态4",
            }[value];
    }},
    {label:'Ellipsis文本省略', prop:'Ellipsis', ellipsis: true},
])
const data = ref([{
    date: '2016-05-02',
    name: '王小虎6',
    address: '6上海市普陀区金沙江路 1518 弄45789',
    status:1,
    Ellipsis:"很长的文字，阿斯顿咖啡上课就好阿四节课打瞌睡的贺卡上但很快就阿四大卡司打卡方式可哈萨克大发快三大卡司等哈就开始的贺卡阿斯顿咖啡上课就好阿四节课打瞌睡的贺卡上但很快就阿四大卡司打卡方式可哈萨克大发快三大卡司等哈就开始的贺卡===="
}, {
    date: '2016-05-04',
    name: '王小虎3',
    address: '3上海市普陀区金沙江路 1517 弄245',
    status:2,
    Ellipsis:"asdasd",
}, {
    date: '2016-05-01',
    name: '王小虎9',
    address: '9上海市普陀区金沙江路 1519 弄45787a',
    status:3,
    Ellipsis:"asdasd",
}, {
    date: '2016-05-03',
    name: '王小虎1',
    address: '1上海市普陀区金沙江路 1516 弄7897',
    status:4,
    Ellipsis:"asdasd",
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

#### 树形型表格、表格拖拽（拖拽、回调、过滤）、单选、复选

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
    <wp-table ref="table" :columns="columns" :data="data" tree="checkbox"
              draggable
              @draggable-change="draggableChange"
              :draggableFilter="draggableFilter"
    ></wp-table>
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
const draggableChange = (newdata)=>{
    console.log(newdata)
}
const draggableFilter = ({end_row, srart_row, inset})=>{
    // 只允许同级排序
    return srart_row.$$level === end_row.$$level && !inset
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
|   treeLevelDeep  | 树形箭头缩紧深度                                                                                                                 | _number_                                          | 15       |
|   treeChildrenFieldName  | 自定义树形children字段名称                                                                                                        | _string_                                          | children |
|   draggable  | 是否开启拖拽                                                                                                                   | _boolean_                                         | false    |
|   draggableFilter  | 拖拽过滤，可实现限制特定数据排序或者同级排序等功能                                                                                                | _({srart_row,end_row,index,ev,inset})=>boolean_                                   | -        |


### ColumnAttributes

| 参数          | 说明                                                                      | 类型                                          | 默认值                     |
|-------------|-------------------------------------------------------------------------|---------------------------------------------|-------------------------|
| label       | 显示的标题                                                                   | _string_                                    | -                       |
| prop        | 对应列内容的字段名，也可以使用 property 属性                                             | _string_                                    | -                       |
| width       | 对应列的宽度                                                                  | _string_                                    | -                       |
| min-width   | 对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | _string_                                    | -                       |
| max-width   | 对应列的最大                                                                  | _string_                                    | -                       |
| columns     | 多级表头                                                                    | _ColumnAttributes[]_                        | _[]_                    |
| fixed       | 对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | _string, boolean_                           | 可选（true, left, right）   |
| align       | 文本对齐方式                                                                  | _string_                                    | 可选（ left,center, right） |
| radio       | 单选栏目                                                                    | _boolean_                                   | false                   |
| checkbox    | 复选栏目                                                                    | _boolean_                                   | false                   |
| sort        | 是否需要排序                                                                  | _boolean_                                   | false                   |
| filter      | 是否需要数据过滤                                                                | _boolean_                                   | false                   |
| filterData  | 自定义下拉过滤数据                                                               | _Dropdown[]_                                | -                       |
| search      | 是否开启输入搜索模式, 可实现动态输入查询当前表数据                                              | _boolean_                                   | false                   |
| modelValue  | 输入搜索模式默认值                                                               | _string_                                    | -                       |
| change      | 输入搜索模式回调                                                                | _(value:string,column:object)=>void(0)_     | -                       |
| ellipsis    | 文本省略, 如果为对象请参考 ellipsis 组件参数                                            | _boolean, ellipsisConfig_                   |
| edit        | 文本省略, 如果为对象请参考 input 组件参数                                               | _boolean, editConfig_                       |
| placeholder | placeholder表单提示                                                         | _string_                                    | -                       |
| btns        | 操作按钮 ,ButtonConfig 请参考button 说明  ;emitData为提供额外数据，放置vue底层警告             | _{name, emit, emitData, ...ButtonConfig}[]_ | -                       |
| dropdown        | 是否收起菜单，btns存在生效                                                         | _boolean_                                   | false                   |

### Methods

| 参数             | 说明                                                                  | 类型/参数                                                   |
|----------------|---------------------------------------------------------------------|---------------------------------------------------------|
| getRadio       | 获取单选数据                                                              | _()=>row_                                               |
| setRadio       | 设置单选数据                                                              | _(rowIndex)=>void)_                                     |
| clearRadio     | 清除单选数据                                                              | _()=>void_                                              |
| getCheckbox    | 获取复选数据                                                              | _()=>row[]_                                             |
| setCheckbox    | 设置复选数据                                                              | _(rowIndexs:rowIndex[])=>void_                          |
| setCheckboxAll | 全选数据                                                                | _(bool:boolean = true)=>void_                           |
| clearCheckbox  | 清除复选数据                                                              | _()=>void_                                              |
| search         | 模糊查询数据,column字段可选，填写后仅对当前column下的字段数据有效,notResetRable 是否重新渲染表格，默认渲染 | _(value, column?:object,notResetRable?:boolean)=>row[]_ |

### Emits

| 参数                | 说明 | 参数                             |
|-------------------|--|--------------------------------|
| click-filter      | 过滤点击回调 | _(ev:any)=>void_                      |
| cell-dblclick        | 单元格双击回调 | _(ev:any)=>void_                      |
| cell-click        | 单元格点击回调 | _(ev:any)=>void_                      |
| cell-row-click    | 单行点击回调 | _(ev:any)=>void_                      |
| cell-header-click | 表头单元格点击回调 | _(ev:any)=>void_                      |
| draggable-change | 拖拽结束回调 | _(newdata:newrow[])=>void_                      |
| edit-save | 快捷编辑保存回调, 其中next执行后，快捷编辑才关闭，并写入最新数据 | _(value:any,{label,column, row, ev, next})=>void_                      |

### Slots

| 参数  | 说明     | 参数                                                 |
|-----|--------|----------------------------------------------------|
|  -  | 默认卡槽   | _column_                                           |
|  header  | 表头插槽   | _{ column, row, spanCell, rowIndex, columnIndex }_ |
|  headerFilter  | 表头过滤插槽 | _{ column, obj, row }_ |
|  edit  | 编辑插槽   | _{ label,column, row }_ |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明  |
|-----|-----|-----|
| -   | -   | -   |
