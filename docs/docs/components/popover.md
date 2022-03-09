# Popover 气泡弹出框

### 介绍

可以存放一些简单的提示和操作

### 引入

```js
import { createApp } from 'vue'
import { WpPopover } from 'wisdom-plus'

const app = createApp()
app.use(WpPopover)
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
  <wp-popover :dark="dark">
    <template #reference> 点我 </template>
    <wp-button @click="dark = !dark">
      {{ dark ? '黑夜' : '白天' }}
    </wp-button>
  </wp-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const dark = ref(false)
</script>
```
:::

### 位置

:::demo
```vue
<template>
  <wp-popover placement="bottom">
    <template #reference> 点我 </template>
    你好
  </wp-popover>
</template>
```
:::

### 触发方式

:::demo
```vue
<template>
  <wp-space>
    <wp-popover>
      <template #reference>
        <wp-button> 点击 Click </wp-button>
      </template>
      你好
    </wp-popover>
    <wp-popover trigger="hover">
      <template #reference>
        <wp-button> 鼠标 Hover </wp-button>
      </template>
      你好
    </wp-popover>
    <wp-popover trigger="focus">
      <template #reference>
        <wp-button> 聚焦 Focus </wp-button>
      </template>
      你好
    </wp-popover>
    <wp-popover v-model="show" trigger="none">
      <template #reference>
        <wp-button @dblclick="show = !show"> 主动 None （双击触发） </wp-button>
      </template>
      你好
    </wp-popover>
  </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

### 手动设置 x y 值

:::demo
```vue
<template>
  <wp-space>
    <wp-popover v-model="show" trigger="none" :x="x" :y="y" use-v-show>
      你好
    </wp-popover>
    <div @click="showPopover" style="height: 200px; width: 200px; background: #eee;" />
  </wp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const show = ref(false)
const x = ref(0)
const y = ref(0)
const showPopover = (e) => {
  if (!show.value) {
    show.value = true
    x.value = e.x
    y.value = e.y
  }
}
</script>
```
:::

### 嵌套

嵌套时请将子元素的 `to` 属性设为 `false`

:::demo
```vue
<template>
  <wp-popover>
    <template #reference>
      <wp-button> 点我 </wp-button>
    </template>
    <wp-popover :to="false">
      <template #reference>
        <wp-button> 点我 </wp-button>
      </template>
      <wp-popover :to="false">
        <template #reference>
          <wp-button> 点我 </wp-button>
        </template>
        <wp-popover :to="false">
          <template #reference>
            <wp-button> 点我 </wp-button>
          </template>
          没了
        </wp-popover>
      </wp-popover>
    </wp-popover>
  </wp-popover>
</template>
```
:::

## API

### Props

可以调用全局的 closeAllPopovers 关闭所有的 popover

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| modelValue      | 是否展示 popover       | _boolean_          | -     |
| trigger     | 触发方式   | _'click' \| 'hover' \| 'focus' \| 'none'_           | click      |
| placement   | 展示位置 | _'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'_ | top      |
| arrow  | 是否显示指示箭头       | _boolean_                                                           | true  |
| zIndex      | Z 轴高度       | _number_                                                           | -   |
| raw | 不附加样式     | _boolean_                                                    | false     |
| to | Popover 元素存放在哪个位置，设为 `false` 则为父元素       | _string \| HTMLElement \| false_                                                    | -     |
| width | 宽度，设为 `trigger` 或 `target` 则与触发元素宽度相同 | _number \| 'trigger' \| 'target'_ | - |
| flip | 在空间不足时，是否移动 popover 到其他位置 | _boolean_ | true |
| duration | Hover 触发模式，鼠标在元素间移动的等待时长 | _boolean_ | 100 |
| dark | 是否是黑暗模式 | _boolean_ | false |
| transition | 过渡动画 | _string_ | `popover-transition` |
| closeOnClickOutside | 点击外部是否关闭 popover | _boolean_ | true |
| popoverClass | Popover 元素的 class | _string \| Record<string, boolean>_ | - |
| popoverStyle | Popover 元素的 style | _string \| CSSProperties_ | - |
| offset | 偏移，`[x, y]` | _number[]_ | - |
| doNotCloseMe | 是否不受全局 closeAllPopovers 函数影响 | _boolean_ | - |
| x | 主动设置 X 轴位置 | _number_ | - |
| y | 主动设置 Y 轴位置 | _number_ | - |
| useVShow | 是否使用 v-show 代替 v-if | _boolean_ | false |

### Methods

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| update:modelValue      | 改变是否展示 popover       | _(value: boolean) => void_          | -     |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
| reference | 触发元素 |
