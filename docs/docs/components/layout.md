# Layout 布局

### 介绍

一个项目很有可能只会有一次组织布局的机会

### 引入

```js
import { createApp } from 'vue'
import { WpLayout, WpLayoutContent, WpLayoutAside } from 'wisdom-plus'

const app = createApp()
app.use(WpLayout)
app.use(WpLayoutContent)
app.use(WpLayoutAside)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <div style="height: 400px">
        <wp-layout>
            <wp-layout-aside padding="10px 0" style="border-bottom: 1px solid #eee">
                <wp-space align="center" :wrap="false">
                    <div class="block" :class="{ collapse }" />
                    <wp-button @click="collapse = !collapse">
                        {{ collapse ? '展开' : '收起' }}
                    </wp-button>
                    <wp-breadcrumb :list="[
                        {
                            index: '1',
                            title: h('a', {
                                href: '/'
                            }, '首页')
                        },
                        {
                            index: '2',
                            title: '关于我们'
                        }
                    ]" />
                </wp-space>
            </wp-layout-aside>
            <wp-layout row>
                <wp-layout-aside style="border-right: 1px solid #eee">
                    <wp-menu modelValue="2" :collapse="collapse" :list="[
                        {
                            title: '首页',
                            index: '1'
                        },
                        {
                            title: '关于我们',
                            index: '2'
                        },
                    ]" vertical width="200px"/>
                </wp-layout-aside>
                <wp-layout-content class="content-block" padding="10px">
                    <p>轻轻的我走了，</p>
                    <p>正如我轻轻的来；</p>
                    <p>我轻轻的招手，</p>
                    <p>作别西天的云彩。</p>
                    <br>
                    <p>那河畔的金柳，</p>
                    <p>是夕阳中的新娘；</p>
                    <p>波光里的艳影，</p>
                    <p>在我的心头荡漾。</p>
                    <br>
                    <p>软泥上的青荇，</p>
                    <p>油油的在水底招摇；</p>
                    <p>在康河的柔波里，</p>
                    <p>我甘心做一条水草！</p>
                    <br>
                    <p>那榆荫下的一潭，</p>
                    <p>不是清泉，</p>
                    <p>是天上虹；</p>
                    <p>揉碎在浮藻间，</p>
                    <p>沉淀着彩虹似的梦。</p>
                    <br>
                    <p>寻梦？撑一支长篙，</p>
                    <p>向青草更青处漫溯；</p>
                    <p>满载一船星辉，</p>
                    <p>在星辉斑斓里放歌。</p>
                    <br>
                    <p>但我不能放歌，</p>
                    <p>悄悄是别离的笙箫；</p>
                    <p>夏虫也为我沉默，</p>
                    <p>沉默是今晚的康桥！</p>
                    <br>
                    <p>悄悄的我走了，</p>
                    <p>正如我悄悄的来；</p>
                    <p>我挥一挥衣袖，</p>
                    <p>不带走一片云彩。</p>
                </wp-layout-content>
            </wp-layout>
        </wp-layout>
    </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
const collapse = ref(false)
</script>

<style scoped>
.block {
    background-color: #f5f5f5;
    height: 40px;
    width: 200px;
    transition: .2s;
}
.block.collapse {
    width: 45px;
}
.content-block {
    background-color: #f5f5f5;
}
.content-block p {
    margin: 0;
}
</style>
```
:::

#### 任意组合布局

:::demo
```vue
<template>
    <div style="height: 400px">
        <wp-layout>
            <wp-layout row>
                <wp-layout-aside style="border-right: 1px solid #eee" @mouseenter="collapse = false" @mouseleave="collapse = true">
                    <div class="block" :class="{ collapse }" style="height: 42px;" />
                    <wp-menu :collapse="collapse" :list="[
                        {
                            title: '首页',
                            index: '1'
                        },
                        {
                            title: '关于我们',
                            index: '2'
                        },
                    ]" vertical width="200px"/>
                </wp-layout-aside>
                <wp-layout>
                    <wp-layout-aside padding="10px 10px" style="border-bottom: 1px solid #eee">
                        <wp-breadcrumb :list="[
                            {
                                index: '1',
                                title: h('a', {
                                    href: '/'
                                }, '首页')
                            },
                            {
                                index: '2',
                                title: '关于我们'
                            }
                        ]" />
                    </wp-layout-aside>
                    <wp-layout-content class="content-block" padding="10px">
                        <p>轻轻的我走了，</p>
                        <p>正如我轻轻的来；</p>
                        <p>我轻轻的招手，</p>
                        <p>作别西天的云彩。</p>
                        <br>
                        <p>那河畔的金柳，</p>
                        <p>是夕阳中的新娘；</p>
                        <p>波光里的艳影，</p>
                        <p>在我的心头荡漾。</p>
                        <br>
                        <p>软泥上的青荇，</p>
                        <p>油油的在水底招摇；</p>
                        <p>在康河的柔波里，</p>
                        <p>我甘心做一条水草！</p>
                        <br>
                        <p>那榆荫下的一潭，</p>
                        <p>不是清泉，</p>
                        <p>是天上虹；</p>
                        <p>揉碎在浮藻间，</p>
                        <p>沉淀着彩虹似的梦。</p>
                        <br>
                        <p>寻梦？撑一支长篙，</p>
                        <p>向青草更青处漫溯；</p>
                        <p>满载一船星辉，</p>
                        <p>在星辉斑斓里放歌。</p>
                        <br>
                        <p>但我不能放歌，</p>
                        <p>悄悄是别离的笙箫；</p>
                        <p>夏虫也为我沉默，</p>
                        <p>沉默是今晚的康桥！</p>
                        <br>
                        <p>悄悄的我走了，</p>
                        <p>正如我悄悄的来；</p>
                        <p>我挥一挥衣袖，</p>
                        <p>不带走一片云彩。</p>
                    </wp-layout-content>
                    <wp-layout-aside class="footer" padding="10px" style="border-top: 1px solid #eee">
                        再别康桥（徐志摩诗作）
                    </wp-layout-aside>
                </wp-layout>
            </wp-layout>
        </wp-layout>
    </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
const collapse = ref(true)
</script>

<style scoped>
.block {
    background-color: #f5f5f5;
    height: 40px;
    width: 200px;
    transition: .2s;
}
.block.collapse {
    width: 45px;
}
.content-block {
    background-color: #f5f5f5;
}
.content-block p {
    margin: 0;
}
.footer {
    background-color: #f5f5f5;
    font-size: 14px;
}
</style>
```
:::

#### 三栏式布局

:::demo
```vue
<template>
    <div style="height: 400px">
        <wp-layout row>
            <wp-layout-aside style="border-right: 1px solid #eee">
                <wp-menu :list="[
                    {
                        title: '首页',
                        index: '1'
                    },
                    {
                        title: '关于我们',
                        index: '2'
                    },
                ]" vertical width="200px"/>
            </wp-layout-aside>
            <wp-layout>
                <wp-layout-content class="content-block" padding="10px">
                    <p>轻轻的我走了，</p>
                    <p>正如我轻轻的来；</p>
                    <p>我轻轻的招手，</p>
                    <p>作别西天的云彩。</p>
                    <br>
                    <p>那河畔的金柳，</p>
                    <p>是夕阳中的新娘；</p>
                    <p>波光里的艳影，</p>
                    <p>在我的心头荡漾。</p>
                    <br>
                    <p>软泥上的青荇，</p>
                    <p>油油的在水底招摇；</p>
                    <p>在康河的柔波里，</p>
                    <p>我甘心做一条水草！</p>
                    <br>
                    <p>那榆荫下的一潭，</p>
                    <p>不是清泉，</p>
                    <p>是天上虹；</p>
                    <p>揉碎在浮藻间，</p>
                    <p>沉淀着彩虹似的梦。</p>
                    <br>
                    <p>寻梦？撑一支长篙，</p>
                    <p>向青草更青处漫溯；</p>
                    <p>满载一船星辉，</p>
                    <p>在星辉斑斓里放歌。</p>
                    <br>
                    <p>但我不能放歌，</p>
                    <p>悄悄是别离的笙箫；</p>
                    <p>夏虫也为我沉默，</p>
                    <p>沉默是今晚的康桥！</p>
                    <br>
                    <p>悄悄的我走了，</p>
                    <p>正如我悄悄的来；</p>
                    <p>我挥一挥衣袖，</p>
                    <p>不带走一片云彩。</p>
                </wp-layout-content>
            </wp-layout>
            <wp-layout-aside padding="10px" style="border-left: 1px solid #eee">
                Sth.
            </wp-layout-aside>
        </wp-layout>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
</script>

<style scoped>
.content-block {
    background-color: #f5f5f5;
}
.content-block p {
    margin: 0;
}
</style>
```
:::


#### 背景占位布局

适用于大数据场景快速分割布局

:::demo
```vue
<template>
    <wp-layout-big-data></wp-layout-big-data>
</template>
```
:::


## Layout API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| row      | 是否行布局       | _boolean_          | false     |

## LayoutAside API

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| width      | 宽度       | _string \| number_          | -     |
| height      | 高度       | _string \| number_          | -     |
| padding | 内边距 | _string_ | - |

## LayoutContnet API

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| padding | 内边距 | _string_ | - |
