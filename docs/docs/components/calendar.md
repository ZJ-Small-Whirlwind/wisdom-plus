# 日历

### 介绍

快捷方便的查看日历，及添加待办

### 引入

```js
import { createApp } from 'vue'
import { WpCalendar } from 'wisdom-plus'

const app = createApp()
app.use(WpCalendar)
```

## 代码演示

#### 基础用法

:::demo

```vue
<template>
    <wp-calendar :getIsEvent="getIsEvent"></wp-calendar>
</template>
```

:::

#### 显示侧边面板

:::demo

```vue
<template>
    <wp-calendar showPanel></wp-calendar>
</template>
```

:::

#### 农历模式

:::demo

```vue
<template>
    <wp-calendar lunar></wp-calendar>
</template>
```

:::

#### 待办事件

:::demo

```vue
<template>
    <wp-calendar lunar :getIsEvent="getIsEvent" showPanel></wp-calendar>
</template>
<script setup lang="ts">
const getIsEvent = e=>{
    return e.week === 0 ? [
        {name:"待办事件1"},
        {name:"待办事件2", success:true},
    ] :false;
}
</script>
```

:::

## API

### Props

| 参数           | 说明       | 类型                                                                      | 默认值   |
|--------------|----------|-------------------------------------------------------------------------|-------|
| getIsEvent      | 获取任务     | _(dayData:object)=>false,{name:string, success:boolean, ...args:any}[]_ | ()=>false |
| lunar      | 是否启用农历模式 | _boolean_                                                               | false |
| showPanel      | 是否显示侧方面板 | _boolean_                                                               | false |
| disabledDate      | 是否禁止具体日期 | _(dayData:object)=>boolean_                                                               | ()=>false |

### Emits

|  参数   | 说明 | 参数         |
|-----|--|------------|
|  change   | 日期变化 | _([year,month, date])=>void_ |
|  arrow-change   | 月份箭头点击回调 | _(data:{year, month, date,}, type)=>void_ |
|  arrow-year-change   | 年份箭头点击回调 | _(data:{year, month, date,}, type)=>void_ |
|  herderTitleClick   | 头部选择回调 | _(data:{year, month, date})=>void_ |
|  event-click   | 待办任务回调 | _(data:{ev,day,task})=>void_ |
|  click-day   | 日期点击回调 | _(data:{year, month, date})=>void_ |
|  go-day   | 快捷按钮回调 | _(data:{year, month, date})=>void_ |
|  week-click   | 周点击回调 | _(week)=>void_ |
