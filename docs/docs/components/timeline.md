<script lang="ts" setup>
import { HomeFilled } from '@vicons/antd'
</script>

# Timeline 时间线

### 介绍

你的时间非常值钱 2

### 引入

```js
import { createApp } from 'vue'
import { WpTimeline, WpTimelineItem } from 'wisdom-plus'

const app = createApp()
app.use(WpTimeline)
app.use(WpTimelineItem)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space vertical>
        <wp-space>
            <wp-switch v-model="reverse" active-text="倒序" inactive-text="正序" width="55px"></wp-switch>
            <wp-switch v-model="relative" active-text="相对" inactive-text="不相对" width="70px"></wp-switch>
            <wp-switch v-model="vertical" active-text="纵向" inactive-text="横向" width="70px"></wp-switch>
        </wp-space>
        <wp-timeline :reverse="reverse" :relative="relative" :vertical="vertical">
            <wp-timeline-item label="2019-05-12">
                工程启动
            </wp-timeline-item>
            <wp-timeline-item label="2019-08-12">
                工程竣工
            </wp-timeline-item>
            <wp-timeline-item label="2019-05-12">
                庆祝
            </wp-timeline-item>
        </wp-timeline>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const reverse = ref(false)
const relative = ref(false)
const vertical = ref(false)
</script>
```
:::

#### 模式

:::demo
```vue
<template>
    <wp-space vertical :wrap="false">
        <wp-space>
            <wp-switch v-model="relative" active-text="相对" inactive-text="不相对" width="70px"></wp-switch>
            <wp-radio-group v-model="mode">
                <wp-radio value="left">居左</wp-radio>
                <wp-radio value="right">居右</wp-radio>
                <wp-radio value="alternate">居中</wp-radio>
            </wp-radio-group>
        </wp-space>
        <wp-timeline :mode="mode" :relative="relative">
            <wp-timeline-item label="2019-05-12" line-color="var(--wp-timeline-item-dot-color)">
                工程启动
            </wp-timeline-item>
            <wp-timeline-item label="2019-08-12" dot-color="orange" :line-color="finished ? 'var(--wp-timeline-item-dot-color)' : ''" :loading="!finished">
                工程竣工
            </wp-timeline-item>
            <wp-timeline-item :dot-color="finished ? 'red' : 'gray'" :icon="HomeFilledIcon">
                庆祝
                <template #label>
                    -
                </template>
            </wp-timeline-item>
        </wp-timeline>
        <wp-button @click="finished = !finished" size="small">切换完成状态</wp-button>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const finished = ref(false)
const mode = ref('left')
const relative = ref(false)
const HomeFilledIcon = HomeFilled
</script>
```
:::

## API

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| reverse | 是否倒序       | _boolean_                                                      | _false_                  |
| relative | 是否使用相对模式                                       | _boolean_                                                           | _false_            |
| mode   | 显示模式                  | _'left' \| 'right' \| 'alternate'_                                                            | 'left'                  |
| vertical | 是否使用纵向模式 | _boolean_ | false |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |

## Timeline Item API

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| label | 时间标签内容       | _string_                                                      | -                  |
| dotColor | 圆点颜色                                       | _string_                                                           | -            |
| lineColor   | 连接线颜色                  | _string_                                                            | -                  |
| icon | 图标                                     | _Component_                                                           | -                  |
| loading  | 是否在加载中                                    | _boolean_                              | false                  |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| label | 标签插槽 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-timeline-font-size | 14px | 内容字号大小 |
| --wp-timeline-gap | 25px | 间距 |
| --wp-timeline-line-width | 35px | 线条容器宽度 |
| --wp-timeline-label-width | 100px | 相对模式下的标签容器的宽度 |
| --wp-timeline-label-color | rgb(134, 144, 156) | 标签的颜色 |
| --wp-timeline-label-font-size | 12px | 标签的字号大小 |
| --wp-timeline-item-dot-color | var(--wp-color-primary) | 圆点颜色 |
| --wp-timeline-item-dot-size | 6px | 圆点尺寸 |
| --wp-timeline-item-dot-icon-size | 12px | 图标字体大小 |
| --wp-timeline-item-line-color | rgb(229, 229, 234) | 连接线颜色 |
| --wp-timeline-item-line-width | 2px | 连接线宽度 |
| --wp-timeline-duration | .2s | 过渡动画时长 |