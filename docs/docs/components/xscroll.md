# X-Scroll 横向滚动

### 介绍

别的组件竖着走，这个组件横着走

### 全局引入

```js
import { createApp } from 'vue'
import { WpXScroll } from 'wisdom-plus'

const app = createApp()
app.use(WpXScroll)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-x-scroll>
        {{ new Array(3).fill('不滚动').join('') }}
    </wp-x-scroll>
    <wp-x-scroll>
        {{ new Array(50).fill('滚动').join('') }}
    </wp-x-scroll>
    <wp-x-scroll smooth>
        {{ new Array(30).fill('平滑滚动').join('') }}
    </wp-x-scroll>
</template>
```
:::

#### 配合菜单使用

:::demo
```vue
<template>
    <wp-x-scroll smooth>
        <wp-menu :list="new Array(30).fill('菜单').map((text, index) => {
            return {
                index,
                title: `${text}_${index}`
            }
        })" />
    </wp-x-scroll>
</template>

<style scoped>
.wp-menu.wp-menu__row {
    max-width: auto;
    overflow: visible;
}
</style>
```
:::

#### 动态计算滚动距离

:::demo
```vue
<template>
    <wp-x-scroll :delta="width => width" smooth>
        <wp-menu class="custom-menu" :list="new Array(50).fill('菜单').map((text, index) => {
            return {
                index,
                title: `${text}_${index}`
            }
        })" />
    </wp-x-scroll>
</template>

<style scoped>
.wp-menu.wp-menu__row {
    max-width: auto;
    overflow: visible;
}
.custom-menu.wp-menu.wp-menu__row > .wp-menu-item {
    width: 20%;
}
</style>
```
:::

#### 配合 Space 组件 和 Tag 标签 使用

:::demo
```vue
<template>
    <wp-x-scroll smooth>
        <wp-space :wrap="false">
            <wp-tag v-for="tag in 30" :key="tag" closable>
                标签 {{ tag }}
            </wp-tag>
        </wp-space>
    </wp-x-scroll>
</template>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| showScrollbar | 是否显示原生滚动条       | _boolean_          | false     |
| disabled | 禁用横向滚动切换 | _boolean_           | false      |
| lockScrollIn | 触及边缘时是否阻止滚动事件 | _boolean_ | true |
| showButton | 是否显示左右滚动按钮 | _boolean_ | true |
| delta | 左右按钮点击滚动时的距离 | _number \| ((offsetWidth: number) => number)_ | 200 |
| onScroll | 滚动时的回调 | _(event: Event) => void_ | - |
| smooth | 使用滚轮时是否平滑滚动 | _boolean_ | false |
| throttle | 频率节流间隔（即每多少 ms 获取一次滚动位置）| _number_ | - |

### Expose

| 方法名 | 说明 | 类型 |
| -- | -- | -- |
| scrollTo | 滚动到指定位置（浏览器原生事件） | _(...args: any[]) => void_ |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | -- |
| default | 默认插槽 | - |
| leftArrow | 左箭头替换插槽 | _click: () => void_ |
| rightArrow | 右箭头替换插槽 | _click: () => void_ |

## 定制

### 全局 CSS 变量

| 变量名 | 默认值 | 说明 |
| ---- | ---- | ---- |
| --wp-x-scroll-arrow-width | 30px | 箭头按钮宽度 |
| --wp-x-scroll-arrow-color | #333 | 箭头按钮颜色 |
| --wp-x-scroll-arrow-color-hover | var(--primary-color) | 箭头按钮 Hover 颜色 |
| --wp-x-scroll-arrow-left-bg | linear-gradient(to right, #fff, transparent) | 左箭头按钮背景颜色 |
| --wp-x-scroll-arrow-right-bg | linear-gradient(to left, #fff, transparent) | 右箭头按钮背景颜色 |
| --wp-x-scroll-duration | .2s | 过渡动画时长 |
