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
        {label:"a-3", prop:"age",btns:[
            {name:'编辑'},
        ]},
    ]},
    {label:"b", prop:"age"},
    {label:"c", prop:"age", btns:[
        {name:'编辑'},    
    ]},
    {label:"d", prop:"age", btns:[
        {name:'编辑'},    
    ],columns:[
        {label:"d-1", prop:"name"},
        {label:"d-2", prop:"age"},
        {label:"d-3", prop:"age" , btns:[
            {name:'编辑'},
        ],columns:[
            {label:"d-3-1", prop:"name",columns:[
                {label:"asda", prop:"age"},
                {label:"asda", prop:"age"},
            ]},
            {label:"d-3-2", prop:"age"},
            {label:"d-3-3", prop:"age", btns:[
                {name:'编辑'},
            ]},
        ]},
    ]},
])
const data = ref([
    {name:'张三', age:21},
    {name:'小明', age:18},
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
