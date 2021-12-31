# Layout 布局

### 介绍

一个项目很有可能只会有一次组织布局的机会

### 引入

```js
import { createApp } from 'vue'
import { WpMenu } from 'wisdom-plus'

const app = createApp()
app.use(WpMenu)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <div style="height: 400px; width: 700px">
        <wp-layout>
            <wp-layout-aside padding="10px 0">
                <wp-space>
                    <div class="block" :class="{ collapse }" />
                    <wp-button @click="collapse = !collapse">
                        {{ collapse ? '展开' : '收起' }}
                    </wp-button>
                </wp-space>
            </wp-layout-aside>
            <wp-layout row>
                <wp-layout-aside>
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
            <wp-layout-aside class="footer" padding="10px">
                Copyright©
            </wp-layout-aside>
        </wp-layout>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const collapse = ref(false)
</script>

<style scoped>
.block {
    background-color: #f5f5f5;
    height: 100%;
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
    margin-top: 10px;
}
</style>
```
:::

#### 任意组合布局

:::demo
```vue
<template>
    <div style="height: 400px; width: 700px">
        <wp-layout>
            <wp-layout row>
                <wp-layout-aside>
                    <div class="block" :class="{ collapse }" style="height: 40px; margin: 10px 0;" />
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
                    <wp-layout-aside padding="10px 0">
                        <wp-space>
                            <wp-button @click="collapse = !collapse">
                                {{ collapse ? '展开' : '收起' }}
                            </wp-button>
                        </wp-space>
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
                    <wp-layout-aside class="footer" padding="10px">
                        Copyright©
                    </wp-layout-aside>
                </wp-layout>
            </wp-layout>
        </wp-layout>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const collapse = ref(false)
</script>

<style scoped>
.block {
    background-color: #f5f5f5;
    height: 100%;
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
    margin-top: 10px;
}
</style>
```
:::