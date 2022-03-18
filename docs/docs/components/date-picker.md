# DatePicker 日期选择器

### 介绍

用于选择或输入日期

### 引入

```js
import { createApp } from 'vue'
import { WpDatePicker } from 'wisdom-plus'

const app = createApp()
app.use(WpDatePicker)
```

## 代码演示

#### 基础用法，选择日,带快捷选项

:::demo
```vue
<template>
    <wp-space>
        <WpDatePicker v-model="value" clearable filterable></WpDatePicker>
        <WpDatePicker v-model="value" clearable filterable showPanel :calendarProps="calendarProps"></WpDatePicker>
    </wp-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref();
const calendarProps = ref({
    disabledDate({date}) {
        return date.toDate().getTime() > Date.now();
    },
})
</script>
```
:::

#### 其他日期单位

通过扩展基础的日期选择，可以选择周、月、年或多个日期

:::demo
```vue
<template>
    <wp-space>
        <div>
            年
            <WpDatePicker v-model="value" type="year" placeholder="选择年"></WpDatePicker>
        </div>
        <div>
            月
            <WpDatePicker v-model="value2" type="month" placeholder="选择月"></WpDatePicker>
        </div>
        <div>
            周
            <WpDatePicker clearable v-model="value4" type="week" placeholder="选择周"></WpDatePicker>
        </div>
        <div>
            多个日期
            <WpDatePicker filterable clearable v-model="value3" type="dates" placeholder="选择多个日期"></WpDatePicker>
        </div>
    </wp-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const value = ref()
const value2 = ref()
const value3 = ref()
const value4 = ref()
</script>
```
:::

#### 选择范围

可在一个选择器中便捷地选择一个时间范围

:::demo
```vue
<template>
    <wp-space>
        <div>
            选择日期范围
            <WpDatePicker v-model="value" type="daterange" placeholder="选择年" format="YYYY-MM-DD HH:mm:ss" clearable filterable></WpDatePicker>
        </div>
        <div>
            选择月份范围
            <WpDatePicker v-model="value2" type="monthrange" placeholder="选择月" clearable></WpDatePicker>
        </div>
        <div>
            选择年份范围{{value3}}
            <WpDatePicker v-model="value3" type="yearrange" placeholder="选择年" clearable filterable></WpDatePicker>
        </div>
    </wp-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const value = ref()
const value2 = ref()
const value3 = ref(["2010","2000"])
</script>
```
:::

## API

### Props

| 参数      | 说明 | 类型                             | 默认值        |
|---------|--|--------------------------------|------------|
| modelValue | 绑定值 | _object[], string , number , boolean_           | -         |
| format | 时间格式 | _ string_           | YYYY-MM-DD        |
| clearable | 可清除 | _boolean_           | false         |
| filterable | 可输入 | _boolean_           | false         |
| showPanel | 是否显示日期面板，即快捷选择面板 | _boolean_           | false         |
| calendarProps | calendarProps | _object_           | -         |
| selectProps | selectProps | _object_           | -         |
| type | 显示类型 | _[string] (year、month、dates、 week、daterange、monthrange、yearrange)_           | -         |
| placeholder | 选择提示语 | _string_           | -         |
| disabled | 是否禁用 | _boolean_           | false         |
| maxYearRange | 展示最大年份区间， 默认间隔12年，必须为正偶数存在 | _number_    | 12        |

### Methods

### Emits

| 参数  | 说明 | 参数                  |
|-----|--|---------------------|
|  clear  | 清除结果 | _        |

### Slots
