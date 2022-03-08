# Cascader 级联选择器

## 代码演示

#### 基础用法

:::demo

```vue
<template>
    <wp-cascader :menus="menu"></wp-cascader>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const menu = ref([
    {
        id: 1,
        name: 'test',
        route: '/'
    },
    {
        id: 2,
        name: 'test2',
        route: '/',
        children: [
            {
                id: 1,
                name: 'test3',
                route: '/'
            },
            {
                id: 2,
                name: 'test4',
                route: '/'
            }
        ]
    },
    {
        id: 1,
        name: 'test33',
        route: '/'
    }
])
</script>
```

:::

#### 多选

:::demo

```vue
<template>
    <wp-cascader :menus="menu" multiple clearable></wp-cascader>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const menu = ref([
    {
        id: 1,
        name: 'test',
        title: '测试',
        route: '/'
    },
    {
        id: 2,
        name: 'test2',
        route: '/',
        children: [
            {
                id: 1,
                name: 'test3',
                route: '/'
            },
            {
                id: 2,
                name: 'test4',
                route: '/'
            }
        ]
    },
    {
        id: 1,
        name: 'test33',
        route: '/'
    }
])
</script>
```

:::

#### 禁用

:::demo

```vue
<template>
    <wp-cascader :menus="menu" modelValue="test" disabled :showPopoverWhenDisabled="false"></wp-cascader>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const menu = ref([
    {
        id: 1,
        name: 'test',
        route: '/'
    },
    {
        id: 2,
        name: 'test2',
        route: '/',
        children: [
            {
                id: 1,
                name: 'test3',
                route: '/'
            },
            {
                id: 2,
                name: 'test4',
                route: '/'
            }
        ]
    },
    {
        id: 1,
        name: 'test33',
        route: '/'
    }
])
</script>
```

:::

## API

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| modelValue `v-model` | 双向绑定的值       | _unknown \| unknown[]_                                                      | -                  |
| menus   | 菜单                  | _height_                                                            | 300                  |
| props | 自定义使用哪个字段作为 key, title 和 children                                     | _{ key?: string; title?: string; children?: string; disabled?: string; }_                                                           | _{ key: 'name', title: 'title', children: 'children' }_                  |
| multiple | 是否多选 | _boolean_ | false |
| disabled | 是否禁用 | _boolean_ | false |
| showPopoverWhenDisabled | 禁用时是否显示 Popover | _boolean_ | true |
| clearable | 是否可清空 | _boolean_ | false |
| size | 尺寸 | _'small' \| 'default' \| 'medium' \| 'large'_ | 'default' |
| max | 最多显示的 tag 数量 | _number_ | - |
| tagProps   | 标签的 Props | _Partial\<TagProps\> & Record\<string, any\>_ | {}      |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| tag | 标签插槽 | _tag: string, index: number, active: boolean, close: () => void_ |
| prefix | 前置插槽 | - |
| suffix | 后置插槽 | - |