# Ellipsis 文本省略

### 介绍

有些事情你永远不必问

### 引入

```js
import { createApp } from 'vue'
import { WpEllipsis } from 'wisdom-plus'

const app = createApp()
app.use(WpEllipsis)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical size="0">
        <wp-ellipsis style="width: 200px">
            你说你感到万分沮丧
        </wp-ellipsis>
        <wp-ellipsis style="width: 200px">
            你说你感到万分沮丧，甚至开始怀疑人生。
        </wp-ellipsis>
    </wp-space>
</template>
```
:::

#### 多行

:::demo
```vue
<template>
    <wp-ellipsis :line="2">
        早知道伤心总是难免的<br>
        你又何苦一往情深<br>
        因为爱情总是难舍难分<br>
        何必在意那一点点温存<br>
    </wp-ellipsis>
</template>
```
:::

#### 自定义内容

:::demo
```vue
<template>
    <wp-space vertical size="0">
        <wp-ellipsis title="何必在意那一点点温存" :line="2">
            早知道伤心总是难免的<br>
            你又何苦一往情深<br>
            因为爱情总是难舍难分<br>
            何必在意那一点点温存<br>
        </wp-ellipsis>
        <wp-ellipsis :line="2" :tooltip="{
            placement: 'bottom',
            dark: false
        }">
            <template #title>
                何必在意那一点点温存
            </template>
            早知道伤心总是难免的<br>
            你又何苦一往情深<br>
            因为爱情总是难舍难分<br>
            何必在意那一点点温存<br>
        </wp-ellipsis>
        <wp-ellipsis :line="2" no-tooltip>
            <template #title>
                何必在意那一点点温存
            </template>
            早知道伤心总是难免的<br>
            你又何苦一往情深<br>
            因为爱情总是难舍难分<br>
            何必在意那一点点温存<br>
        </wp-ellipsis>
    </wp-space>
</template>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| title | 替换展示的内容                                                      | _string_ | -      |
| tooltip         | Tooltip 组件的 props                                                        | _TooltipProps_                                                   | {}     |
| noTooltip  | 是否关闭 Tooltip | _boolean_                                                   | false      |
| line | 是否是多行模式     | _number_                                                   | 1      |
| force | 是否强制显示 Tooptip | _boolean_ | false |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| title | 内容替换插槽 |