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

#### 基础多选

:::demo
```vue
<template>
    <WpSpace>
        <WpSelect :options="options" v-model="value" clearable multiple filterable></WpSelect>
        <WpSelect :options="options" v-model="value" clearable multiple></WpSelect>
        <WpSelect :options="options" v-model="value" clearable multiple collapseTags></WpSelect>
        <WpSelect :options="options" clearable multiple collapseTags filterable></WpSelect>
    </WpSpace>
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

const value = ref(['选项1','选项2','选项3','选项4','选项5']);
</script>
```
:::

#### 分组

:::demo
```vue
<template>
    <WpSelect :options="options" v-model="value" clearable></WpSelect>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const options = ref([{
    label: '热门城市',
    options: [{
        value: 'Shanghai',
        label: '上海'
    }, {
        value: 'Beijing',
        label: '北京'
    }]
}, {
    label: '城市名',
    disabled:true,
    options: [{
        value: 'Chengdu',
        label: '成都'
    }, {
        value: 'Shenzhen',
        label: '深圳'
    }, {
        value: 'Guangzhou',
        label: '广州'
    }, {
        value: 'Dalian',
        label: '大连'
    }]
}])

const value = ref('')
</script>
```
:::

#### 远程搜索

请输入 123看效果

:::demo
```vue
<template>
    <WpSpace>
        <WpSelect :remote="remote" v-model="value" :options="options" clearable filterable multiple></WpSelect>
        <WpSelect :remote="remote" v-model="value" :options="options" clearable collapseTags filterable multiple></WpSelect>
        <WpSelect :remote="remote" v-model="value2" :options="options" clearable filterable></WpSelect>
    </WpSpace>
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
const value2 = ref(null);
const value = ref(['选项1','选项2']);
const remote = value=>{
    return new Promise(resolve => {
        resolve(value.split("").map(k=>([
            {
                value: 'Chengdu',
                label: '成都'
            },
            {
                value: 'Shenzhen',
                label: '深圳'
            },
            {
                value: 'Guangzhou',
                label: '广州'
            },
            {
                value: 'Dalian',
                label: '大连'
            }
        ])[k]).filter(e=>e))
    })
}
</script>
```
:::

## API

### Props

| 参数      | 说明 | 类型                             | 默认值        |
|---------|--|--------------------------------|------------|
| value / v-model | 绑定值 | _object[], string , number , boolean_           | -         |
| options | 选项数据 | _optionItem[]_           | []         |
| disabled | 禁用选项 | _boolean_           | false         |
| labelName | 选项显示字段名称 | _string_           | label         |
| valueName | v-model绑定字段名称 | _string_           | value         |
| clearable | 可清除结果 | _boolean_           | false         |
| filterable | 可搜索 | _boolean_           | false         |
| placeholder | placeholder默认提示 | _string_           | '请选择'         |
| activeIconShow | 是否显示选中图标 | _boolean_           | true         |
| multiple | 是否多选 | _boolean_           | false         |
| collapseTags | 多选时是否将选中值按文字的形式展示 | _boolean_           | false         |
| remote | 是否为远程搜索， 必须为可搜索模式 | _(searchValue:string)=>Promise<optionItem[]>_           | -         |
| PopoverConfig | Popover相关配置 | _object_           | -         |

### optionItem

| 参数      | 说明 | 类型                             | 默认值        |
|---------|--|--------------------------------|------------|
| label | 显示内容 | _string_           | _any_         |
| value | 绑定内容 | _string_           | _any_         |
| disabled | 禁用 | _boolean_           | _boolean_         |
| options | 分组 | _optionItem[]_           | -        |

### Slots

| 参数  | 说明 | 参数                  |
|-----|--|---------------------|
|  -  | 默认卡槽 | _optionItem_        |
|  panel  | 面板插槽 | _(vm:object)=>any)_ |
|  prefixIcon  | 前缀图标 | _ |

