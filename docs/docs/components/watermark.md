# Watermark 水印

### 介绍

满屏的干扰视线的玩意

### 全局引入

```js
import { createApp } from 'vue'
import { WpWatermark } from 'wisdom-plus'

const app = createApp()
app.use(WpWatermark)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-watermark
        content="有法必依，违法必究"
        cross
        selectable
        :font-size="13"
        :line-height="13"
        :width="192"
        :height="128"
        :x-offset="12"
        :y-offset="28"
        :rotate="15"
    >
        <div style="height: 200px;" />
    </wp-watermark>
</template>
```
:::

#### 全屏

:::demo
```vue
<template>
  <wp-watermark
    v-if="show"
    content="智加Software"
    cross
    fullscreen
    :font-size="16"
    :line-height="16"
    :width="384"
    :height="384"
    :x-offset="12"
    :y-offset="60"
    :rotate="-15"
  />
  <wp-switch v-model="show" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    return {
      show: ref(false)
    }
  }
})
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| cross | 是否交错显示       | _boolean_          | false     |
| fullscreen | 是否全屏 | _boolean_           | false      |
| width   | 宽度 | _number_ | 32      |
| height | 高度       | _number_                                                           | 32  |
| zIndex  | 层级     | _number_                                                           | 10   |
| xGap | X 轴间距 | _number_ | 0 |
| yGap | Y 轴间距 | _number_ | 0 |
| xOffset | X 轴偏移 | _number_ | - |
| yOffset | Y 轴偏移 | _number_ | 0 |
| rotate | 旋转角度 | _number_ | 0 |
| image | 图片的地址 | _string_ | - |
| imageOpacity | 图片的不透明度 | _number_ | 1 |
| imageHeight | 图片高度 | _number_ | - |
| imageWidth | 图片宽度 | _number_ | - |
| content | 文字内容 | _string_ | - |
| selectable | 是否可被选择 | _boolean_ | true |
| fontSize | 字号大小 | _number_ | 14 |
| fontFamily | 字体 | _string_ | - |
| fontStyle | 字体类型 | _'normal' \| 'italic' \| 'oblique' \| `oblique ${number}deg`_ | - |
| fontVariant | 字形 | _string_ | - |
| fontWeight | 字重 | _number_ | 400 |
| fontColor | 字体颜色 | _rgba(128, 128, 128, .3)_ | - |
| fontStretch | 伸缩变形 | _string_ | - |
| lineHeight | 行高 | _number_ | 14 |
