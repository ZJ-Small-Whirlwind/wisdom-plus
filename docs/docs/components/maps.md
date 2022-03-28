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

点击地图添加覆盖物并弹出信息框

:::demo

```vue
<template>
    <div>
        <WpButton @click="onClick({lnglat:[116.397428, 39.910907]})">添加覆盖物</WpButton>
        <WpButton @click="onClear">删除覆盖物</WpButton>
    </div>
    <WpMaps @mapClick="onClick" @load="load" ref="map"></WpMaps>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const map = ref()
const mapObj = ref()
const Markers = ref([])
const onClick = ({lnglat, ...ev}) => {
    Markers.value.push(map.value.createMarker({position:lnglat, ...ev}))
}
const onClear = ()=> {
    const m = Markers.value.pop();
    m?.remove();
};
const load = ({map,AMap}) => {
    mapObj.value = map;
    onClick({lnglat:[116.397428, 39.910907],content:"asdas"});
}
</script>
```
:::



#### 右键菜单

:::demo
```vue
<template>
    <WpMaps :menu="menu" @menuClick1="menuClick1" @load="load"></WpMaps>
</template>
<script setup>
import { ref } from 'vue'
const menu = ref([
    {content:'放大一级', emit:'menuClick1'},
    {content:'缩小一级', emit:map=>map.zoomOut()},
    {content:'缩放至全国范围', emit:map=>map.setZoomAndCenter(4, [108.946609, 34.262324])},
    {content:'添加标记', emit:(map,ev)=>{
        new AMap.Marker({
            map: map,
            position: ev.pos //基点位置
        })
    }},
])
const menuClick1 = map=>map.zoomIn();
const load = ({map,AMap})=>{
    //创建右键菜单
    var contextMenu = new AMap.ContextMenu();

    //右键放大
    contextMenu.addItem("放大一级", function () {
        map.zoomIn();
    }, 0);

    //右键缩小
    contextMenu.addItem("缩小一级", function () {
        map.zoomOut();
    }, 1);
    var lnglat = new AMap.LngLat(116.397, 39.918);
    var marker = new AMap.Marker({
        map: map,
        position: lnglat
    });

    map.setCenter(marker.getPosition());
    //绑定鼠标右击事件——弹出右键菜单
    marker.on('rightclick', function (e) {
        contextMenu.open(map, e.lnglat);
    });
}
</script>
```
:::


#### 自动完成搜索

:::demo
```vue
<template>
    <h2>autoComplete</h2>
    <WpMaps autoComplete @auto-complete-change="change"></WpMaps>
    <h2>placeSearch</h2>
    <div>自动定位，并在宁波检索</div>
    <WpMaps placeSearch @auto-complete-change="change1" city="宁波" autoIp></WpMaps>
</template>
<script setup>
import { ref } from 'vue'
const change = (v, {map, AMap})=>{
    try {
        map.clearMap();
        new AMap.Marker({
            map,
            position:v.location
        })
        map.setCenter(v.location)
    }catch (e){ }
}
const change1 = (v)=>{
    console.log(v,333)
}
</script>
```
:::


#### 自定义搜索结果、侧方面板插槽

:::demo
```vue
<template>
    <WpMaps ref="map" placeSearch panel  @panel-confirm="confirm" :panelList="panelList" @mapClick="mapClick">
        <template #autoCompleteItem="{value}">
            <div>{{value.name}}</div>
        </template>
        <template #panelItem="{element}">
            <div>
                <div>{{element.result.regeocode.formattedAddress}}</div>
                <div>{{element.ev.pos.join()}}</div>
            </div>
        </template>
    </WpMaps>
</template>
<script setup>
import { ref } from 'vue'
const map = ref([]);
const panelList = ref([]);
const confirm = ({data})=>{
    console.log(panelList.value, data)
}
const mapClick = ev=>{
    map.value.GeocoderServe.getAddress(ev.lnglat, (status, result)=> {
        panelList.value = panelList.value.concat([{ev,result}])
    })
}
</script>
```
:::

## API

### Props

| 名称 | 说明                           | 类型                | 默认值 |
| ------- |------------------------------|-------------------|--|
| config | 地图加载配置， 可设置密钥等               | `object`          | - |
| plugins | 地图插件                         | `object`          | - |
| mapConfig | 地图实例化配置， 可设置中心点、缩放等          | `object`          | - |
| showScale | 是否显示标尺                       | `boolean`         | false |
| autoIp | 是否Ip定位                       | `boolean`         | false |
| autoGeolocation | 是否浏览器精确定位， 类型为object则为定位选项参数 | `boolean、object ` | false |
| menu | 右键菜单                         | `menu `       | - |
| autoComplete | 自动完成搜索                         | `boolean｜ object`       | false |
| placeSearch | POI搜索                         | `boolean｜object `       | false |
| city | 当前城市                         | `string|object `       | 全国 |
| autoCompleteLabelName | 搜索完成后显示名字段名称                         | `string `       | name |
| panel | 是否显示侧方面板                         | `boolean `       | false |
| panelItemLabelName | 侧方面板列表显示名字段名称                     | `string `       | name |

#### menu
| 名称      | 说明 | 类型    | 默认值 |
|---------|--|-------|-----|
| content | 内容 | `any` | -   |
| emit    | 回调 | `string ｜ (ev:{item,ev,pos})=>void` | -   |


### Methods

| 名称 | 说明 | 参数 |
| ---- |--| ---- |
| search | 搜索, 必须开启autoComplete或placeSearch  | `(keywords)=>Promise<any>` |
| createMarker | 创建覆盖物  | `(config:{position:LngLat, content:any,showInfoWindow:boolean})=>void` |


### Emits

| 名称 | 说明 | 参数 |
| ---- |--| ---- |
| load | 地图初始化加载完成 | `(mapObj)=>void` |
| mapClick | 地图点击事件 | `ev` |
| mapRightclick | 地图右键 | `ev` |
| auto-complete-change | 自动完成搜索选择完成 | `result, mapObj` |
| searchChange | 搜索结果回调  | `status, result, mapObj` |
| panel-cancel | 面板取消按钮  | `{ev:any}` |
| panel-confirm | 面板确定按钮  | `{ev:any, data:any[]}}` |


### Slots

| 名称 | 说明 | 参数 |
| ---- |--| ---- |
| autoCompleteItem | 搜索完成下拉插槽 | `(value:any)=>any` |
| panel | 地图侧方面板 | `-` |
| panelItem | 地图侧方面板列表元素插槽 | `-` |

