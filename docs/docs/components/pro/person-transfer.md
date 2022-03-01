# PersonTransfer 人员穿梭框

### 介绍

一般用在权限管理的穿梭框

### 引入

```js
import { createApp } from 'vue'
import { WpProPersonTransfer } from 'wisdom-plus'

const app = createApp()
app.use(WpProPersonTransfer)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-pro-person-transfer :list="list" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const list = ref(new Array(100).fill({
    id: 1,
    name: ''
}).map((item, index) => {
    return {
        id: index + 1,
        name: `组织${index + 1}`,
        children: new Array(100).fill({}).map((_, i) => {
            return {
                id: `${index + 1}_${i}`,
                name: `人员${index + 1}_${i}`,
            }
        })
    }
}))
</script>
```
:::

### Props


| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| modelValue `v-model` | 选中项       | _(string \| number \| symbol)[]_                                                      | -                  |
| list | 列表项 | _TreeListItemCustom[]_ | - |
| getData | 在没有 list 选项时，可以设置 getData 由组件内部管理数据 | _() => Promise<TreeListItemCustom[]_ | - |