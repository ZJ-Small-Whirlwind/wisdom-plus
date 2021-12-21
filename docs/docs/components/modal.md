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