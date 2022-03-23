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

#### 覆盖物

点击地图添加覆盖物

:::demo

```vue
<template>
    <div>
        <WpButton @click="onClick({lnglat:[116.397428, 39.910907]})">添加覆盖物</WpButton>
        <WpButton @click="onClear">删除覆盖物</WpButton>
    </div>
    <WpMaps @mapClick="onClick" @load="load"></WpMaps>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const mapObj = ref()
const Markers = ref([])
const onClick = ({lnglat, ...ev}) => {
    Markers.value.push(new AMap.Marker({
        map:mapObj.value,
        position:lnglat
    }))
}
const onClear = ()=> {
    const m = Markers.value.pop();
    m?.remove();
};
const load = (map,AMap) => {
    mapObj.value = map;
    onClick({lnglat:[116.397428, 39.910907]});
}
</script>
```
:::



#### 右键菜单

:::demo
```vue
<template>
    <WpMaps :menu="menu"></WpMaps>
</template>
<script setup>
const menu = ref([
    {name:'缩小'},
    {name:'放大'},
    {name:'距离测量'},
    {name:'添加标记'},
])
</script>
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

