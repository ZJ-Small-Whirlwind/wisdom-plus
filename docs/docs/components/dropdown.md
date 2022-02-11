<script lang="ts" setup>
import { HomeFilled } from '@vicons/antd'
</script>

# Dropdown 下拉菜单

### 介绍

能拉但是只能拉一点点

### 引入

```js
import { createApp } from 'vue'
import { WpDropdown } from 'wisdom-plus'

const app = createApp()
app.use(WpDropdown)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-dropdown :list="list" @click="index = $event.index">
        <wp-button>
            {{ index || '下拉' }}
        </wp-button>
    </wp-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const list = [
    { index: 1, icon: HomeFilled, title: '注销' },
    { index: 2, title: '选项',
        children: [
            { index: '2-1', title: '选项一', groupName: '分组' },
            { index: '2-2', title: '选项二', groupName: '分组二', divided: true }
        ]
    }
]
const index = ref('')
</script>
```
:::

#### 自定义标题

:::demo
```vue
<template>
    <wp-dropdown :list="list" @click="index = $event.title">
        <template #title="{ title }">
            标题-{{ title }}
        </template>
        <wp-button>
            {{ index || '下拉' }}
        </wp-button>
    </wp-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const list = [
    { index: 1, icon: HomeFilled, title: '注销' },
    { index: 2, title: '选项',
        children: [
            { index: '2-1', title: '选项一', groupName: '分组' },
            { index: '2-2', title: '选项二', groupName: '分组二', divided: true }
        ]
    }
]
const index = ref('')
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue `v-model`   | 是否显示菜单       | _boolean_          | false     |
| rootPopover | 根 Popover 组件的 Props | _Partial\<PopoverProps\> & Record\<string, any\>_           | {}      |
| popover     | Popover 组件的 Props，会改变父菜单及菜单的外层 Popover 容器   | _Partial\<PopoverProps\> & Record\<string, any\>_           | {}      |
| list   | 下拉菜单列表 | _DropdownRecord[]_ | []      |
| subMenuPlacement  | 子菜单弹出位置       | _PopoverPlacement_                                                           | 'right' |
| showArrow      | 是否显示指示箭头       | _boolean_                                                           | true   |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽 | - |
| title | 标题 | ...DropdownRecord |
| group | 分组 | ...DropdownRecord |

## 类型

### DropdownRecord `interface`

| 名称 | 说明 | 类型 | 是否可选 |
| --- | --- | --- | --- |
| index | 唯一标识符 | _string \| number \| symbol_ | 是 |
| title | 标题 | _string_ | 是 |
| icon | 图标 | _Component_ | 是 |
| disabled | 是否禁用 | _boolean_ | 是 |
| divided | 是否在菜单前插入分割线 | _boolean_ | 是 |
| groupName | 分组名称 | _string_ | 是 |
| click | 点击事件，返回 true 会阻止事件传递到父级 | _(record?: DropdownRecord) => void_ | 是 |
| children | 子菜单 | _DropdownRecord[]_ | 是 |
