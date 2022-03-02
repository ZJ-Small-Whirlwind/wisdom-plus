# Editor 编辑器

### 介绍

基于 wangeditor 的编辑器，支持数据的双向绑定

### 引入

```js
import { createApp } from 'vue'
import { WpProEditor } from 'wisdom-plus'

const app = createApp()
app.use(WpProEditor)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-pro-editor v-model="text" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const text = ref('')
</script>
```
:::

## API

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| modelValue `v-model` | 编辑的文本       | _string_                                                      | -                  |
| height   | 编辑器的高度                  | _height_                                                            | 300                  |
| excludeMenus | 排除的菜单                                     | _string[]_                                                           | -                  |
| api | 上传接口 | _(file: File \| Blob) => Promise\<any>_ | - |

### Methods

| 参数      | 说明                                        | 类型                                              | 默认值 |
| --------- |-------------------------------------------|-------------------------------------------------| ------ |
| mounted      | 编辑器挂载时的回调 | _() => void_                 | -     |
