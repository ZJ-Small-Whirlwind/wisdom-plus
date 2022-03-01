# PersonTree 人员树

### 介绍

自带虚拟列表的人员大树

### 引入

```js
import { createApp } from 'vue'
import { WpPersonTree } from 'wisdom-plus'

const app = createApp()
app.use(WpPersonTree)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-pro-person-tree :list="list" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const list = ref(new Array(100).fill({
    id: 1,
    name: ''
}).map((item, index) => {
    return {
        id: index + 1,
        name: `人员${index + 1}`
    }
}))
</script>
```
:::

#### 单选

:::demo
```vue
<template>
    <wp-pro-person-tree :list="list" use-radio />
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
| checkedItems   | 选中项（对象）                  | _TreeListItemCustom[]_                                                            | -                  |
| useRadio | 是否使用单选                                     | _boolean_                                                           | -                  |
| handleDelete | 多选状态下的全部删除操作回调 | _() => void_ | - |
| list | 列表项 | _TreeListItemCustom[]_ | - |
| exclude | 排除项 | _(string | number | symbol)[]_ | - |
| noFilterCount | 获取全选数值时是否包括过滤项 | _boolean_ | - |
| getData | 在没有 list 选项时，可以设置 getData 由组件内部管理数据 | _() => Promise<TreeListItemCustom[]_ | - |

### 插槽

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| checked | 已选数字的替代插槽 | _checked: TreeListItemCustom[], list: TreeListItemCustom[], count: number, itemsCount: number_ |