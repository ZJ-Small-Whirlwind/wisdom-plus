# Modal 模态框

### 介绍

不想切换页面的时候用

### 引入

```js
import Vue from 'vue';
import { WpModal } from 'wisdom-plus';

Vue.use(WpModal);
```

## 代码演示

### 基础用法

:::demo
```vue
<template>
    <wp-modal v-model="show" width="400px" title="对话框">
        这里是内容
        <template #footer>
            <wp-space justify="end">
                <wp-button @click="show = !show" size="medium">
                    取消
                </wp-button>
                <wp-button @click="show = !show" size="medium" type="primary">
                    确认
                </wp-button>
            </wp-space>
        </template>
    </wp-modal>
    <wp-button @click="show = !show">显示模态框</wp-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const show = ref(false)
</script>
```
:::

## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| overlay      | Overlay 组件的 Props       | _Partial\<OverlayProps\>_          | {}     |
| modelValue `v-model`     | 是否显示模态框   | _boolean_           | -      |
| transitionName   | 过渡类名 | _string_ | _wp-modal-fade_      |
| width  | 模态框的宽度，不填则为自适应       | _string \| number_                                                           | -  |
| showClose      | 是否显示关闭图标       | _boolean_                                                           | true   |
| title | 标题     | _string_                                                    | -     |
| border | 是否显示 title 和 footer 的边框       | _boolean_                                                    | true     |