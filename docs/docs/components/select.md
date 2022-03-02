# 选择器

### 介绍

当选项过多时，使用下拉菜单展示并选择内容。

### 引入

```js
import { createApp } from 'vue'
import { WpSelect } from 'wisdom-plus'

const app = createApp()
app.use(WpSelect)
```

## 代码演示

#### 基础用法、可清除、选项禁用

:::demo
```vue
<template>
    <WpSelect :options="options" v-model="value" clearable></WpSelect>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const options = ref([{
    value: '选项1',
    label: '黄金糕'
}, {
    value: '选项2',
    label: '双皮奶',
    disabled: true
}, {
    value: '选项3',
    label: '蚵仔煎'
}, {
    value: '选项4',
    label: '龙须面'
}, {
    value: '选项5',
    label: '北京烤鸭'
}])

const value = ref('')
</script>
```
:::

#### 可搜索

:::demo
```vue
<template>
    <WpSelect :options="options" v-model="value" clearable filterable></WpSelect>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const options = ref([{
    value: '选项1',
    label: '黄金糕'
}, {
    value: '选项2',
    label: '双皮奶',
}, {
    value: '选项3',
    label: '蚵仔煎'
}, {
    value: '选项4',
    label: '龙须面'
}, {
    value: '选项5',
    label: '北京烤鸭'
}])

const value = ref('')
</script>
```
:::

#### 有禁用选项

:::demo
```vue
<template>
    <WpSelect disabled  :options="options" v-model="value" clearable></WpSelect>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const options = ref([{
    value: '选项1',
    label: '黄金糕'
}, {
    value: '选项2',
    label: '双皮奶',
    disabled: true
}, {
    value: '选项3',
    label: '蚵仔煎'
}, {
    value: '选项4',
    label: '龙须面'
}, {
    value: '选项5',
    label: '北京烤鸭'
}])

const value = ref('')
</script>
```
:::

## API

### Props

| 参数      | 说明 | 类型                             | 默认值        |
|---------|--|--------------------------------|------------|
| value / v-model | 绑定值 | _object[], string , number , boolean_           | -         |
| options | 选项数据 | _any[]_           | []         |
| disabled | 禁用选项 | _boolean_           | false         |
| labelName | 选项显示字段名称 | _string_           | label         |
| valueName | v-model绑定字段名称 | _string_           | value         |
| clearable | 可清除结果 | _boolean_           | false         |
| filterable | 可搜索 | _boolean_           | false         |
| placeholder | placeholder默认提示 | _string_           | '请选择'         |
| activeIconShow | 是否显示选中图标 | _boolean_           | true         |

### Slots

| 参数  | 说明     | 参数           |
|-----|--------|--------------|
|  -  | 默认卡槽   | _optionItem_ |

