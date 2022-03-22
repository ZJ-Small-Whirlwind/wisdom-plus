
# BackTop 回到顶部

### 介绍

它可以帮你回到你曾经到过的地方。不过时间是回不去了。

### 引入

```js
import { createApp } from 'vue'
import { WpBackTop } from 'wisdom-plus'

const app = createApp()
app.use(WpBackTop)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    
    <div ref="scrollContainer" style="overflow: auto; height: 200px; line-height: 1.5; position: relative">
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
    </div>
    <wp-back-top :listen-to="scrollContainer" :bottom="20" :right="150" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup () {
        const scrollContainer = ref<HTMLElement>(null as unknown as HTMLElement)
        return {
             scrollContainer,
        }
    }
})
</script>
```
:::

#### 可调显示距离

:::demo
```vue
<template>
    <div ref="scrollContainer" style="overflow: auto; height: 200px; line-height: 1.5; position: relative">
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
    </div>
    <wp-back-top :listen-to="scrollContainer" :visibilityHeight="10" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup () {
        const scrollContainer = ref<HTMLElement>(null as unknown as HTMLElement)
        return {
            scrollContainer
        }
    }
})
</script>
```
:::


#### 内部使用 可调显示距离

:::demo
```vue
<template>
    <div ref="scrollContainer" style="overflow: auto; height: 200px; line-height: 1.5; position: relative">
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        <wp-back-top :visibilityHeight="10" />
    </div>
</template>

```
:::

#### 插槽

:::demo
```vue
<template>
    <div ref="scrollContainer" style="overflow: auto; height: 200px; line-height: 1.5; position: relative">
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
    </div>
    <wp-back-top :listen-to="scrollContainer">
        <div style="width: 100px;height: 40px;line-height: 40px;text-align: center;font-size: 14px;">
            回到顶部
        </div>
    </wp-back-top>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup () {
        const scrollContainer = ref<HTMLElement>(null as unknown as HTMLElement)
        return {
            scrollContainer
        }
    }
})
</script>
```
:::


#### 自定义位置
:::demo
```vue
<template>
    <div ref="scrollContainer" style="overflow: auto; height: 200px; line-height: 1.5; position: relative">
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
        这块应该写一个有意思的笑话。<br>
    </div>
    <!--    使用teleport自定义组件显示的相对位置    -->
    <teleport to="body">
        <wp-back-top :listen-to="scrollContainer" :bottom="100" />
    </teleport>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup () {
        const scrollContainer = ref<HTMLElement>(null as unknown as HTMLElement)
        return {
            scrollContainer
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
| right      | 右侧距离      | _string \| number_        | 40   |
| bottom | 底部距离 | _string \| number_ | 40 |
| listen-to | 监听组件的ref   | _boolean_   | -      |
| visibilityHeight   | 显示组件的滚动距离 | _number_ | 180      |



