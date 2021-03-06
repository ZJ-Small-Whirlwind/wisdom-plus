<script lang="ts" setup>
import { Toast } from '@wisdom-plus/components'
</script>

# Toast 轻提示

### 介绍

长的像面包就叫面包了

### 全局引入

```js
import { createApp } from 'vue'
import { Toast } from 'wisdom-plus'

const app = createApp()
app.use(Toast)

// this.$toast
```

### 组件内引入

```js
import { Toast } from 'wisdom-plus'

Toast({
    message: 'Hello, world'
})
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-space>
        <wp-button @click="tip(false)">
            白色提示
        </wp-button>
        <wp-button @click="tip(true)">
            黑色提示
        </wp-button>
        <wp-button @click="tip2">
            VNode
        </wp-button>
        <wp-button @click="tip3">
            自定义色彩
        </wp-button>
    </wp-space>
</template>

<script lang="ts" setup>
import { h } from 'vue'
const tip = (dark = false) => Toast({
    dark,
    message: '这是一个提示'
})
const tip2 = () => Toast({
    message: h('span', {
        style: {
            fontSize: '20px',
            lineHeight: 2
        }
    }, '超级大提示'),
    placement: 'center'
})
const tip3 = () => Toast({
    message: '上传成功',
    placement: 'top',
    style: {
        color: 'green'
    }
})
</script>
```
:::

#### 预设

:::demo
```vue
<template>
    <wp-space>
        <wp-button @click="tip()">
            成功
        </wp-button>
        <wp-button @click="tip1()">
            警告
        </wp-button>
        <wp-button @click="tip2()">
            信息
        </wp-button>
        <wp-button @click="tip3()">
            错误
        </wp-button>
    </wp-space>
</template>

<script lang="ts" setup>
import { h } from 'vue'
const tip = () => Toast.success('我成功了！')
const tip1 = () => Toast.warning('我被警告了了！')
const tip2 = () => Toast.info('信息呢？')
const tip3 = () => Toast.error('出错了！')
</script>
```
:::

### 指定容器

:::demo
```vue
<template>
    <wp-space vertical>
        <div ref="divRef" style="height: 300px; position: relative; background: #eee" />
        <wp-button @click="tip(false)">
            提示
        </wp-button>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'

const divRef = ref()
const tip = (dark = false) => Toast({
    dark,
    message: '这是一个提示',
    to: divRef.value,
    placement: 'center'
})
</script>
```
:::

## API

### ToastOptions

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| drak      | 是否暗黑模式       | _boolean_          | false     |
| message     | 提示内容   | _VNode \| string_           | -      |
| duration  | 持续显示多久后消失 `ms`       | _number_                                                           | 3000  |
| placement      | 位置       | _'top'\| 'bottom' \| 'center'_                                                           | 'bottom'   |
| style | 自定义样式 | _string \| CSSProperties_ | - |
| transition | 过渡名 | _string_ | 'wp-toast-fade' |
| to | 指定容器 | _string \| RendererElement \| null \| undefined_ | 'body' |

### Preset

Toast 函数上有一些静态方法可供使用，他们的函数签名为

```ts
(message: string | VNode, options?: Omit<ToastOptions, 'message'>) => void
```

具体函数有

```ts
Toast.success()
Toast.info()
Toast.warning()
Toast.error()
```
