<script lang="ts" setup>
import { HomeFilled } from '@vicons/antd'
</script>

# Breadcrumb 面包屑导航

### 介绍

用来找回去的路

### 引入

```js
import { createApp } from 'vue'
import { WpBreadcrumb } from 'wisdom-plus'

const app = createApp()
app.use(WpBreadcrumb)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-breadcrumb :list="[
        {
            index: '1',
            title: h('a', {
                href: '/'
            }, 'Home 首页')
        },
        {
            index: '2',
            title: h('a', {
                href: '/components/'
            }, 'Components 组件')
        },
        {
            index: '2',
            title: 'Breadcrumb 面包屑导航'
        }
    ]" />
</template>

<script lang="ts" setup>
import { h } from 'vue'
</script>
```
:::

#### 替换分隔符和每项内容

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-breadcrumb :list="[
            {
                index: '1',
                title: h('a', {
                    href: '#'
                }, '首页')
            },
            {
                index: '2',
                title: '当前页'
            }
        ]">
            <template #separator>
                ~
            </template>
        </wp-breadcrumb>
        <wp-breadcrumb :list="[
            {
                index: '1',
                title: '首页'
            },
            {
                index: '2',
                title: '当前页'
            }
        ]">
            <template #item="{ index, title }">
                {{ index }} is {{ title }}
            </template>
            <template #separator>
                ~
            </template>
        </wp-breadcrumb>
    </wp-space>
</template>

<script lang="ts" setup>
import { h } from 'vue'
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| list   | 面包屑列表       | _BreadcrumbList[]_          | []     |
| separator     | 分隔符   | _string \| VNode_           | '/'      |
| spaceProps | Space 组件的 Props，可以用来控制分隔符和面包屑列表之间的间距、对齐方式等属性 | _Partial\<SpaceProps\> & Record\<string, any\>_ | {} |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| click      | 点击面包屑任意一项的回调函数       | _(item: BreadcrumbList) => void_          | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| item | 项 | ...BreadcrumbList |
| separator | 分隔符 | - |

## 类型

### BreadcrumbList

| 名称 | 说明 | 类型 | 是否可选 |
| --- | --- | --- | --- |
| index | 标识符 | _string \| number \| symbol_ | 是 |
| title | 标题 | _string \| VNode_ | 是 |
| to | 路由的跳转目标 | _RouteLocationRaw_ | 是 |
| replace | 是否使用replace，默认为 `false` | _boolean_ | 是 |
