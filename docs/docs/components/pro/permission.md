# Permission 权限

### 介绍

一个简单的权限配置组件

### 引入

```js
import { createApp } from 'vue'
import { useRoute } from 'vue-router'
import { WpProPermission, permissionConfig, usePermission } from 'wisdom-plus'

const app = createApp()
app.use(WpProPermission)

// 如此配置就不需要手动在每个组件中传输 useRoute 了
permissionConfig.useRoute = useRoute

// setup()
const { route, has, hasAll, permissions } = usePermission()
```

## 代码演示


#### 基础用法

:::demo
```vue
<template>
    <wp-pro-permission>
        <wp-button>我是有权限的</wp-button>
    </wp-pro-permission>
    <wp-pro-permission has="admin">
        <wp-button>我是没有权限的</wp-button>
    </wp-pro-permission>
</template>
```
:::


### Props

| 参数      | 说明                                          | 类型                                                                  | 默认值                |
| --------- |---------------------------------------------|---------------------------------------------------------------------|--------------------|
| useRoute | useRoute 方法       | _() => RouteLocationNormalizedLoaded_                                                      | -                  |
| has | 拥有其中的一个权限就会显示组件 | _string \| string[]_ | - |
| getData | 拥有所有的权限才会显示组件 | _string \| string[]_ | - |