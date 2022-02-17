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
    <wp-table :columns="columns" :data="data">
    </wp-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const columns = ref([
    {label:"a", prop:"name",columns:[
        {label:"a-1", prop:"name"},
        {label:"a-2", prop:"age"},
        {label:"a-3", btns:[
            {name:'编辑'},
        ]},
    ]},
    {label:"b", prop:"age"},
    {label:"c", btns:[
        {name:'编辑'},    
    ]},
    {label:"d", btns:[
        {name:'编辑'},    
    ],columns:[
        {label:"d-1", prop:"name"},
        {label:"d-2", prop:"age"},
        {label:"d-3", btns:[
            {name:'编辑'},
        ],columns:[
            {label:"d-3-1", prop:"name"},
            {label:"d-3-2", prop:"age"},
            {label:"d-3-3", btns:[
                    {name:'编辑'},
                ]},
        ]},
    ]},
])
columns.value = [
    {lable:"日期"},
    {label:"配送信息",columns:[
        {label:"姓名",},
        {label:"地址",columns:[
            {label:"省份",},
            {label:"市区",},
            {label:"地址",},
            {label:"邮编",},
        ]},
    ]},
]
const data = ref([
    {name:'张三', arg:21},
    {name:'小明', arg:18},
])
</script>
```
:::

## API

### Props

| 参数  | 说明  | 类型  | 默认值 |
|-----|-----|-----| ------ |
| -   | -   | _-_ | -     |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明  |
|-----|-----|-----|
| -   | -   | -   |
