<script lang="ts" setup>
import { RightOutlined } from '@vicons/antd'
</script>
#Button 按钮

### 介绍

常用的操作按钮。

### 引入

```js
import { createApp } from 'vue'
import { WpButton } from 'wisdom-plus'

const app = createApp()
app.use(WpButton)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <WpButton>默认按钮</WpButton>
        <WpButton type="primary">主要按钮</WpButton>
        <WpButton type="success">成功按钮</WpButton>
        <WpButton type="info">信息按钮</WpButton>
        <WpButton type="warning">警告按钮</WpButton>
        <WpButton type="danger">危险按钮</WpButton>
    </wp-space>

    <wp-space>
        <WpButton plain>朴素按钮</WpButton>
        <WpButton type="primary" plain>主要按钮</WpButton>
        <WpButton type="success" plain>成功按钮</WpButton>
        <WpButton type="info" plain>信息按钮</WpButton>
        <WpButton type="warning" plain>警告按钮</WpButton>
        <WpButton type="danger" plain>危险按钮</WpButton>
    </wp-space>

    <wp-space>
        <WpButton round>圆角按钮</WpButton>
        <WpButton type="primary" round>主要按钮</WpButton>
        <WpButton type="success" round>成功按钮</WpButton>
        <WpButton type="info" round>信息按钮</WpButton>
        <WpButton type="warning" round>警告按钮</WpButton>
        <WpButton type="danger" round>危险按钮</WpButton>
    </wp-space>

    <wp-space>
        <WpButton icon="SearchOutlined" circle></WpButton>
        <WpButton type="primary" icon="EditOutlined" circle></WpButton>
        <WpButton type="success" icon="CheckOutlined" circle></WpButton>
        <WpButton type="info" icon="MailOutlined" circle></WpButton>
        <WpButton type="warning" icon="StarOutlined" circle></WpButton>
        <WpButton type="danger" icon="DeleteOutlined" circle></WpButton>
    </wp-space>
</template>
```
:::


#### 禁用状态

:::demo
```vue
<template>
    <wp-space>
        <WpButton disabled>默认按钮</WpButton>
        <WpButton disabled type="primary">主要按钮</WpButton>
        <WpButton disabled type="success">成功按钮</WpButton>
        <WpButton disabled type="info">信息按钮</WpButton>
        <WpButton disabled type="warning">警告按钮</WpButton>
        <WpButton disabled type="danger">危险按钮</WpButton>
    </wp-space>

    <wp-space>
        <WpButton disabled plain>朴素按钮</WpButton>
        <WpButton disabled type="primary" plain>主要按钮</WpButton>
        <WpButton disabled type="success" plain>成功按钮</WpButton>
        <WpButton disabled type="info" plain>信息按钮</WpButton>
        <WpButton disabled type="warning" plain>警告按钮</WpButton>
        <WpButton disabled type="danger" plain>危险按钮</WpButton>
    </wp-space>
</template>
```
:::


#### 文字按钮

:::demo
```vue
<template>
    <wp-space>
        <WpButton type="text">文字按钮</WpButton>
        <WpButton disabled type="text">文字按钮</WpButton>
    </wp-space>
</template>
```
:::


#### 图标按钮

:::demo
```vue
<template>
    <wp-space>
        <WpButton type="primary" icon="EditFilled"></WpButton>
        <WpButton type="primary" icon="ShareAltOutlined"></WpButton>
        <WpButton type="primary" icon="DeleteFilled"></WpButton>
        <WpButton type="primary" icon="SearchOutlined">搜索</WpButton>
        <WpButton type="primary" icon="CloudUploadOutlined">上传</WpButton>
    </wp-space>
</template>
```
:::


#### 按钮组

:::demo

```vue

<template>
    <wp-space>
        <WpButtonGroup>
            <WpButton type="primary" icon="LeftOutlined">上一页</WpButton>
            <WpButton type="primary">下一页
                <WpIcon>
                    <component :is="RightOutlined2" />
                </WpIcon>
            </WpButton>
        </WpButtonGroup>
        <WpButtonGroup>
            <WpButton type="primary" icon="EditFilled"></WpButton>
            <WpButton type="primary" icon="ShareAltOutlined"></WpButton>
            <WpButton type="primary" icon="DeleteFilled"></WpButton>
        </WpButtonGroup>
    </wp-space>
</template>
<script lang="ts" setup>
const RightOutlined2 = RightOutlined
</script>
```
:::


#### 加载中

:::demo

```vue

<template>
    <WpButton type="primary" loading>加载中</WpButton>
</template>
```
:::


#### 倒计时


:::demo

```vue

<template>
    <wp-space>
        <WpButton @click="countdownClick" :countdown="0">点击看效果</WpButton>
    </wp-space>
</template>
<script lang="ts" setup>
const countdownClick = (e,next)=>{
    console.log(11)
    next();
}
</script>
```
:::


#### 不同尺寸

:::demo

```vue

<template>
    <wp-space>
        <WpButton>默认按钮</WpButton>
        <WpButton size="medium">中等按钮</WpButton>
        <WpButton size="small">小型按钮</WpButton>
        <WpButton size="mini">超小按钮</WpButton>
    </wp-space>
    <wp-space>
        <WpButton round>默认按钮</WpButton>
        <WpButton round size="medium">中等按钮</WpButton>
        <WpButton round size="small">小型按钮</WpButton>
        <WpButton round size="mini">超小按钮</WpButton>
    </wp-space>
</template>
```
:::


## API

### Props

|参数	| 说明                          | 	类型	              |可选值| 	默认    |
|----|-----------------------------|-------------------|----|--------|
| size	| 尺寸	                         | _string_	         | _medium / small / mini_| 	—     |
| type	| 类型	                         | _string_	         | _primary / success / warning / danger / info / text_	| —      |
| plain	| 是否朴素按钮	                     | _boolean_	        | —	| false  |
| round	| 是否圆角按钮	                     | _boolean_	        | —	| false  |
| circle	| 是否圆形按钮	                     | _boolean_	        | —	| false  |
| loading	| 是否加载中状态	                    | _boolean_	        | —	| false  |
| disabled	| 是否禁用状态	                     | _boolean_	        | —	| false  |
| icon	| 图标类名	                       | _string	          | —	| —      |
| autofocus	| 是否默认聚焦	                     | _boolean_	        | —	| false  |
| native-type	| 原生 type 属性	                 | _string_	         | _button / submit / reset_	| button |
| countdown	| 是否启用倒计时功能, 如果为 0 则自动执行默认时间	 | _boolean,number_	 | _boolean,number_	| 60秒    |

