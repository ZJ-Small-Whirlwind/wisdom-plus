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
    <wp-calendar></wp-calendar>
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
    <wp-calendar lunar :getIsEvent="getIsEvent"></wp-calendar>
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
