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
    <wp-calendar ref="calendar"></wp-calendar>
</template>
```

:::

#### 农历模式

:::demo

```vue
<template>
    <wp-calendar ref="calendar" lunar></wp-calendar>
</template>
```

:::
