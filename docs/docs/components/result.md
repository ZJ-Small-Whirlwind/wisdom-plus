# Result 结果

### 介绍

结果很重要

### 引入

```js
import { createApp } from 'vue'
import { WpResult } from 'wisdom-plus'

const app = createApp()
app.use(WpResult)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-result message="404 NOT FOUND" description="这里可能没有你想要的东西" />
</template>
```
:::

#### 修改图标

:::demo
```vue
<template>
    <wp-result icon="Authentication" message="401 Unauthorized" description="您可能未被授权访问本页面" />
</template>
```
:::

#### 使用插槽

:::demo
```vue
<template>
    <wp-result>
        <template #icon>
            😄
        </template>
        <template #message>
            让人开心，开了又开
        </template>
        <template #description>
            其实没啥好描述的
        </template>
    </wp-result>
</template>
```
:::

#### 额外的插槽

:::demo
```vue
<template>
    <wp-result>
        <template #icon>
            📱
        </template>
        <template #message>
            USE YOUR PHONE
        </template>
        <template #description>
            其实没啥好描述的
        </template>
        <template #suffix>
            <wp-button size="small" style="margin-top: 20px;">返回</wp-button>
        </template>
    </wp-result>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| icon   | 图标       | _'Authentication' \| 'LocationSearch' \| 'PageNotFound' \| 'SecureLogin' \| 'WaitingForYou'_          | 'PageNotFound'     |
| message     | 消息   | _string_           | -      |
| description   | 描述 | _string_ | -      |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| icon | 图标插槽 |
| message | 消息插槽 |
| description | 描述插槽 |
| suffix | 后置插槽 |