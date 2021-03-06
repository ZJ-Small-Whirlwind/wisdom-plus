# Upload 上传

### 介绍

对接业务的上传组件，添加了一些业务独有的功能

### 引入

```js
import { createApp } from 'vue'
import { WpProUpload } from 'wisdom-plus'

const app = createApp()
app.use(WpProUpload)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-pro-upload ref="wpProUpload" v-model="files" auto-upload :delete="handleDelete" :upload="handleUpload" multiple :limit="5" accept=".jpg,.png,.webp">
        <template #description>
            允许的文件格式 .jpg,.png,.webp，已上传 {{ files?.length || 0 }} 个文件
        </template>
    </wp-pro-upload>
    <wp-button type="danger" @click="deleteAllFiles">删除所有文件</wp-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const files = ref()
const handleDelete = file => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('删除了文件')
            resolve()
        }, 300)
    })
}

const handleUpload = filterFiles => {
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            filterFiles.forEach(file => {
                if (!file.progress && file.progress !== 0) {
                    file.progress = 0
                }
                file.progress += 1
            })
        }, 15)
        setTimeout(() => {
            filterFiles.forEach(file => file.status = 0)
            resolve()
            console.log('上传了文件')
            clearInterval(timer)
        }, 1500)
    })
}

const wpProUpload = ref()
const deleteAllFiles = () => {
    wpProUpload.value.upload.deleteAllFiles().then(() => {
        console.log('删除成功')
    })
}
</script>
```
:::

#### 拖拽上传

:::demo
```vue
<template>
    <wp-pro-upload auto-upload :upload="handleUpload" multiple drop />
</template>

<script lang="ts" setup>
const handleUpload = filterFiles => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            filterFiles.forEach(file => file.status = 0)
            resolve()
        }, 300)
    })
}
</script>
```
:::

#### 仅使用文件列表

:::demo
```vue
<template>
    <wp-pro-upload :model-value="list" :show-button="false" multiple drop disabled>
        <template #description>
            已上传文件：
        </template>
    </wp-pro-upload>
</template>

<script lang="ts" setup>
const list = [
    {
        name: 'a.jpg',
        url: '#'
    },
    {
        name: 'b.jpg'
    }
]
</script>
```
:::

#### 使用卡片预设

:::demo
```vue
<template>
    <wp-pro-upload :model-value="list" multiple drop preset="card" />
</template>

<script lang="ts" setup>
const list = [
    {
        name: 'a.jpg',
        url: 'https://avatars.githubusercontent.com/u/26594629?v=4'
    },
    {
        name: 'b.jpg'
    },
    {
        name: 'c.jpg',
        status: 2
    },
    {
        name: 'd.jpg',
        status: 3
    }
]
</script>
```
:::

#### 禁用

:::demo
```vue
<template>
    <wp-pro-upload auto-upload :upload="handleUpload" multiple accept=".jpg,.png,.webp" disabled />
    <wp-pro-upload auto-upload :upload="handleUpload" multiple drop disabled />
</template>

<script lang="ts" setup>
const handleUpload = filterFiles => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            filterFiles.forEach(file => file.status = 0)
            resolve()
        }, 300)
    })
}
</script>
```
:::

####  大文件切片上传

:::demo
```vue
<template>
    <wp-pro-upload auto-upload chunk :chunk-size="100000" :limit="2" :upload="handleUpload" multiple />
</template>

<script lang="ts" setup>
const handleUpload = filterFiles => {
    return new Promise(async(resolve, reject) => {
        for (const file of filterFiles) {
            if (file.chunks) {
                for (const chunk of file.chunks) {
                    if (!chunk.status) continue
                    await new Promise(resolve => setTimeout(resolve, 20))
                    chunk.status = 0
                }
            }
            file.status = 0
        }
        resolve()
    })
}
</script>
```
:::

## API

### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| modelValue `v-model` | 文件列表，如果该 Prop 为 `undefined`，则组件为非受控模式       | _FileItem[] \| UploadFile[]_                                                      | -                  |
| multiple | 是否可多选                                       | _boolean_                                                           | _false_            |
| accept   | 接收的文件格式，如 ".jpg,.png,.gif"                  | _string_                                                            | -                  |
| drop | 是否可拖拽上传                                     | _boolean_                                                           | -                  |
| delete  | 删除前的回调函数                                    | _(file: UploadFile) => Promise\<void>_                              | -                  |
| upload | 上传前的回调函数，filterFiles 为仅 Waiting 状态的文件，file 为所有文件 | _(filterFiles: UploadFile[], file: UploadFile[]) => Promise\<void>_ | -                  |
| pin | 列表是否固定（禁止删除）                                | _boolean_                                                           | false              |
| autoUpload | 是否在选择文件后自动上传                                | _boolean_                                                           | false              |
| limit | 文件数量限制                                      | _number_                                                            | -                  |
| showFileList | 是否显示文件列表                                    | _boolean_                                                           | true               |
| showButton | 是否显示上传按钮                                    | _boolean_                                                           | true               |
| disabled | 是否为禁用状态                                     | _boolean_                                                           | false              |
| preset | 预设，可选值为 card                                | _boolean_                                                           | 'list'             |
| preview | 是否开启预览                                      | _boolean_                                                           | true               |
| cover | 在达到文件数量限制，是否覆盖文件                            | _boolean_                                                           | true               |
| chunk | 是否开启大文件切片                                   | _boolean_                                                           | false              |
| chunkSize | 切片单元大小（字节）                                      | _number_                                                            | 默认2M 即 `1024*1024*2` |
| chunkFileFilter | 切片过滤                                        | _(file: UploadFile) => boolean_               | - |
| retry | 失败后是否允许重试 | _boolean_ | true |
| extra | 接口的附加内容 | _Record\<string, any>_ | - |
| api | 接口 | _{ upload?: (file: File \| Blob, extra?: Record\<string, any>, onProgress?: (progress: number) => void) => Promise\<any>, delete?: (file: FileItem & UploadFile) => Promise\<any> }_ | - |

### Methods

| 参数      | 说明                                        | 类型                                              | 默认值 |
| --------- |-------------------------------------------|-------------------------------------------------| ------ |
| update:modelValue      | 文件列表更新，若 `modelValue` 的值为 `undefined`，则该值也无效 | _(files: FileItem[] \| UploadFile[]) => void_                 | -     |
| itemClick | 列表项点击事件                                   | _(e: Event, value: UploadFile) => void_         | - |
| handleIconClick | 文件状态icon点击事件️️                           | _(file: UploadFile, index: number, status:number) => void_ | - |
| success | 单个文件上传成功的回调                                   | _(file: UploadFile) => void_         | - |
| error | 单个文件上传失败的回调                                   | _(file: UploadFile) => void_         | - |
| finished | 一批文件上传成功的回调                                   | _(files: UploadFile[]) => void_         | - |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 上传按钮插槽 | _start: () => void, dragover: boolean_ |
| description | 描述插槽，位置在上传按钮和文件列表之间 | - |
| lists | 列表整体替换插槽 | _files: UploadFile[]_ |
| list | 单个列表替换插槽 | _file: UploadFile_ |

### Expose

| 方法名 | 说明 | 类型 |
| -- | -- | -- |
| submit | 手动上传函数 | _() => Promise\<void>_ |
| addUpload | 手动添加上传文件 | _(files: FileList \| File[]) => Promise\<void>_ |
| getFileHash | 获取文件唯一Hash， 用于大文件上传 | _(file: File) => Promise\<Hash>_ |

## 类型

### UploadFile

| 名称 | 说明 | 类型 | 是否可选 |
| --- | --- | --- | --- |
| name | 显示的文件名 | _string_ | 否 |
| status | 文件状态，不填则为 Success | _UploadFileStatus_ | 是 |
| file | 文件 | _File_ | 是 |
| pin | 是否固定（禁止被删除） | _boolean_ | 是 |
| url | 文件链接，设置后在列表会被渲染被 a 标签 | _string_ | 是 |
| progress | 上传进度，仅在状态为 Loading 的时候被显示 | _number_ | 是 |
| isChunk | 是否是切片 | _boolean_ | 是 |
| chunks | 切片 | _UploadFile[]_ | 是 |
| [x: string] | 任意内容 | _any_ | 是 |

### UploadFileStatus

| 指代值 | 实际值 | 说明 |
| --- | --- | --- |
| Success | _0_ | 成功 |
| Waiting | _1_ | 等待上传 |
| Loading | _2_ | 上传中 |
| Fail | _3_ | 上传失败 |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-upload-success | green | 成功状态图标颜色 |
| --wp-upload-waiting | rgb(66, 141, 252) | 等待上传状态图标颜色 |
| --wp-upload-fail | red | 上传失败状态图标颜色 |
| --wp-upload-loading | #d9d9d9 | 加载中状态图标颜色 |
| --wp-upload-drag-icon-color | #d9d9d9 | 拖动图标颜色 |
| --wp-upload-drag-icon-size | 64px | 拖动图标大小 |
| --wp-upload-font-size | 13px | 文本字体大小 |
| --wp-upload-icon-size | 15px | 图标字体大小 |
| --wp-upload-active-color | rgb(66, 141, 252) | 激活颜色 |
| --wp-upload-item-padding | 5px | 列表项内边距 |
| --wp-upload-item-hover-bg | #fcfcfc | 列表项 Hover 背景 |
| --wp-upload-card-color | rgb(215, 217, 219) | Card 预设下的字体颜色 |
| --wp-upload-card-bg | rgb(246, 247, 249) | Card 预设下的背景颜色 |
| --wp-upload-card-active-bg | rgb(240, 241, 243) | Card 预设下的激活背景颜色 |
| --wp-upload-card-overlay-bg | rgba(0, 0, 0, 153) | Card 预设下的遮罩背景颜色 |