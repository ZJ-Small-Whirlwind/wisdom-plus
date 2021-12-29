# TagInput 标签输入

### 介绍

还是需要给一些东西定标签

### 引入

```js
import { createApp } from 'vue'
import { WpTagInput } from 'wisdom-plus'

const app = createApp()
app.use(WpTagInput)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-tag-input placeholder="请输入标签" clearable :delimiter="[',', ' ']"/>
</template>
```
:::

### 尺寸

:::demo
```vue
<template>
    <wp-space vertical :size="[0, 10]">
        <wp-tag-input placeholder="请输入标签" size="small" />
        <wp-tag-input placeholder="请输入标签"/>
        <wp-tag-input placeholder="请输入标签" size="medium" />
        <wp-tag-input placeholder="请输入标签" size="large" />
    </wp-space>
</template>
```
:::

### 自定义标签

:::demo
```vue
<template>
    <wp-tag-input v-model="tags" placeholder="请输入标签" clearable :delimiter="[',', ' ']">
        <template #tag="{ tag, index }">
            {{ tag }}
            <template v-if="index !== tags.length - 1">
                /
            </template>
        </template>
    </wp-tag-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tags = ref<number[]>([])
</script>
```
:::