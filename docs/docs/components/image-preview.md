<script lang="ts" setup>
import { Preview } from '@wisdom-plus/components'
</script>

# Image Preview 图片预览

### 介绍

可以快速预览一些图片

### 引入

```js
import { createApp } from 'vue'
import { WpImagePreview } from 'wisdom-plus'

const app = createApp()
app.use(WpImagePreview)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-button @click="show = !show">显示</wp-button>
    <wp-image-preview v-model="show" :list="['https://avatars.githubusercontent.com/u/26594629?v=4', 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg']" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

#### 函数调用

:::demo
```vue
<template>
    <wp-button @click="open">显示</wp-button>
</template>

<script lang="ts" setup>
const open = () => {
    Preview([
        'https://avatars.githubusercontent.com/u/26594629?v=4',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
    ], 1)
}
</script>
```
:::

## API

### Props

| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| modelValue `v-model` | 是否显示图片预览                                                      | _boolean_ | -      |
| index `v-model` | 显示图片索引                                                        | _boolean_                                                   | -     |
| list | 图片列表 | _string[] \| PreviewImage[]_                                                   | -      |
| overlayProps | 遮罩组件的 Props | _Partial\<OverlayProps> & Record\<string, any>_ | - |

### PreviewImage

| 参数         | 说明                                                          | 类型                                                       | 必填 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| src | 图片地址                                                      | _string_ | -      |                                                 | 是      |

## Preview 函数

快速创建一个预览

```js
import { Preview } from 'wisdom-plus'
Preview(['https://avatars.githubusercontent.com/u/26594629?v=4'], 0, {
    overlayProps: {}
})
```

#### 函数参数
| 参数         | 说明                                                          | 类型                                                       | 默认值 |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| list | 列表                                                      | _string[] \| PreviewImage[]_ | -      |
| flag | 识别符                                                        | _number \| string \| PreviewImage_                                                   | -     |
| props | ImagePreview 的 Props | _ImagePreviewProps_                                                   | -      |

