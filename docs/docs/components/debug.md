# Debug 调试

### 介绍

打印模板变量的利器，记得在生产环境删除

### 引入

```js
import { createApp } from 'vue'
import { WpDebug } from 'wisdom-plus'

const app = createApp()
app.use(WpDebug)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-debug :log="log" mark="log" />
    <wp-button @click="log += 1">修改值 {{log}}，记得看控制台</wp-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const log = ref(0)
</script>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| log | 需要打印在控制台的值                                                      | _any_ | -      |
| mark | 对于值的标记                                                      | _string_ | -      |