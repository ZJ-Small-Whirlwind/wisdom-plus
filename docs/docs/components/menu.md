# Menu 菜单

### 介绍

服务员，这桌来一份菜单

### 引入

```js
import Vue from 'vue';
import { WpMenu } from 'wisdom-plus';

Vue.use(WpMenu);
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-menu v-model="menuActive" :list="menuList" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const menuActive = ref('1')
const menuList = [
    {
        title: '菜单一',
        index: '1',
        children: [
            {
                title: '菜单一-1',
                index: '3'
            },
            {
                title: '菜单一-2',
                index: '4',
                children: [
                    {
                        title: '菜单一-2-1',
                        index: '1-2-1'
                    },
                    {
                        title: '菜单一-2-1',
                        index: '1-1-2'
                    }
                ]
            }
        ]
    },
    {
        title: '菜单二',
        index: '2'
    }
]
</script>
```
:::

#### 纵向

:::demo
```vue
<template>
    <wp-menu v-model="menuActive" :list="menuList" vertical />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const menuActive = ref('3')
const menuList = [
    {
        title: '菜单一',
        index: '1',
        children: [
            {
                title: '菜单一-1',
                index: '3'
            }
        ]
    },
    {
        title: '菜单二',
        index: '2'
    }
]
</script>
```
:::

#### 折叠

:::demo
```vue
<template>
    <wp-space vertical>
        激活项： {{ menuActive }}
        <wp-button @click="collapse = !collapse">{{ collapse ? '展开' : '折叠' }}</wp-button>
        <wp-menu v-model="menuActive" :list="menuList" vertical :collapse="collapse" width="300px" />
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const collapse = ref(true)
const menuActive = ref('1')
const menuList = [
    {
        title: '菜单一',
        index: '1',
        children: [
            {
                title: '菜单一-1',
                index: '3'
            },
            {
                title: '菜单一-2',
                index: '4',
                children: [
                    {
                        title: '菜单一-2-1',
                        index: '1-2-1'
                    },
                    {
                        title: '菜单一-2-1',
                        index: '1-1-2'
                    }
                ]
            }
        ]
    },
    {
        title: '菜单二',
        index: '2'
    }
]
</script>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| modelValue `v-model`         | 激活项                                                        | _string \| number \| symbol_                                                   | -     |
| unfold `v-model:unfold`   | 展开项     | _(string \| number \| symbol)[]_                                                   | -      |
| vertical          | 是否纵向                                                      | _boolean_ | false      |
| list  | 渲染的菜单列表                                               | _MenuList_                                                   | []      |
| collapse   | 是否折叠     | _boolean_                                                   | false      |
| trigger   | Popover 呼出方式     | _'hover' \| 'click'_                                                   | 'click'      |
| showArrow | 是否显示指示箭头 | _boolean_ | true |
| width | 宽度（仅在纵向模式且非折叠的情况下有效） | _string_ | '400px' |

### Methods

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| update:modelValue         | 激活项                                                        | _(value: string \| number \| symbol) => void_                                                   | -     |
| update:unfold  | 展开项                                               | _(value: (string \| number \| symbol)[]) => void_                                                   | -      |
| click   | 点击任意项的事件回调，返回 _true_ 会阻止默认对激活项的修改     | _(value: MenuRecord) => void_                                                   | -      |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | -------- |
| title | 标题 | { ...MenuRecord } |

## 类型

### MenuRecord

| 名称 | 说明 | 类型 | 是否可选 |
| --- | --- | --- | --- |
| index | 唯一标识符 | _string \| number \| symbol_ | 否 |
| title | 标题 | _string_ | 是 |
| icon | 图标 | _Component_ | 是 |
| disabled | 是否禁用 | _boolean_ | 是 |
| info | 任何你想携带的信息 | _Record<string, any>_ | 是 |
| children | 子菜单 | _MenuList_ | 是 |

### MenuList

_MenuRecord[]_