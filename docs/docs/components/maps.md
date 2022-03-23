# Maps 地图

### 介绍

子子孙孙无穷匮也

### 引入

```js
import { createApp } from 'vue'
import { WpMaps } from 'wisdom-plus'

const app = createApp()
app.use(WpMaps)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <WpMaps showScale autoIp></WpMaps>
</template>
```
:::

#### 浏览器精确定位

:::demo
```vue
<template>
    <WpMaps autoGeolocation></WpMaps>
</template>
```
:::

## API

### Props

| 名称 | 说明                           | 类型                | 默认值   |
| ------- |------------------------------|-------------------|-------|
| config | 地图加载配置， 可设置密钥等               | `object`          | -     |
| plugins | 地图插件                         | `object`          | -     |
| mapConfig | 地图实例化配置， 可设置中心点、缩放等          | `object`          | -     |
| showScale | 是否显示标尺                       | `boolean`         | false |
| autoIp | 是否Ip定位                       | `boolean`         | false |
| autoGeolocation | 是否浏览器精确定位， 类型为object则为定位选项参数 | `boolean、object ` | false |

