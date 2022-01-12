<script lang="ts" setup>
import tree from './data/tree.json'
</script>

# Tree 树

### 介绍

开枝散叶

### 引入

```js
import { createApp } from 'vue'
import { WpTree } from 'wisdom-plus'

const app = createApp()
app.use(WpTree)
```

## 代码演示

#### 基础用法

:::demo
```vue
<template>
    <wp-tree :list="[
        {
            key: '1',
            title: '展开',
            children: [{
                key: '1-1',
                title: '1-1'
            }, {
                key: '1-2',
                title: '1-2',
                children: [{
                    key: '1-2-1',
                    title: '1-2-1'
                }, {
                    key: '1-2-2',
                    title: '1-2-2',
                    disabled: true
                }]
            }]
        }
    ]"/>
    <wp-tree :list="[
        {
            key: '1',
            title: '展开',
            children: [{
                key: '1-1',
                title: '1-1'
            }, {
                key: '1-2',
                title: '1-2',
                children: [{
                    key: '1-2-1',
                    title: '1-2-1'
                }, {
                    key: '1-2-2',
                    title: '1-2-2',
                    disabled: true
                }]
            }]
        }
    ]" checkable/>
</template>
```
:::

#### 可选择

:::demo
```vue
<template>
    当前选择 {{ selecting }}
    <wp-tree v-model:selecting="selecting" :list="[
        {
            key: '1',
            title: '展开',
            children: [{
                key: '1-1',
                title: '1-1'
            }, {
                key: '1-2',
                title: '1-2',
                children: [{
                    key: '1-2-1',
                    title: '1-2-1'
                }, {
                    key: '1-2-2',
                    title: '1-2-2',
                    disabled: true
                }]
            }]
        }
    ]" selectable/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selecting = ref('1')
</script>
```
:::

#### 关闭动画

:::demo
```vue
<template>
    <wp-tree :list="[
        {
            key: '1',
            title: '展开',
            children: [{
                key: '1-1',
                title: '1-1'
            }, {
                key: '1-2',
                title: '1-2',
                children: [{
                    key: '1-2-1',
                    title: '1-2-1'
                }, {
                    key: '1-2-2',
                    title: '1-2-2',
                    disabled: true
                }]
            }]
        },
        {
            key: '1',
            title: '展开',
            children: [{
                key: '1-1',
                title: '1-1'
            }, {
                key: '1-2',
                title: '1-2',
                children: [{
                    key: '1-2-1',
                    title: '1-2-1'
                }, {
                    key: '1-2-2',
                    title: '1-2-2',
                    disabled: true
                }]
            }]
        }
    ]" :animation="false" link/>
</template>
```
:::

#### 虚拟列表 / 可过滤 / 可排除

:::demo
```vue
<template>
    <wp-grid :default-span="8">
        <wp-grid-item>
            <wp-button @click="checkAll">全选</wp-button> {{ checked.length }} / {{ count }}
            <wp-tree
                v-model:checked="checked"
                :list="treeList"
                :props="{ key: 'node_id', title: 'node_name' }"
                :get-key="(item) => {
                    return item['union_node_id'] || item['node_id']
                }"
                virtual
                ref="treeRef"
                filterable
                checkable
                arrow-right
                :exclude="treeList2Keys"
            >
                <template #filter="{ filter }">
                    <input v-model="filter.value" />
                </template>
            </wp-tree>
        </wp-grid-item>
        <wp-grid-item>
            <wp-space vertical align="center" justify="center" style="height: 300px;">
                <wp-button @click="handleAdd">添加</wp-button>
                <wp-button @click="handleDelete">减少</wp-button>
            </wp-space>
        </wp-grid-item>
        <wp-grid-item>
            已选中 {{ checked2.length }} / {{ treeList2.length }}
            <wp-tree
                v-model:checked="checked2"
                :list="treeList2"
                :props="{ key: 'node_id', title: 'node_name' }"
                :get-key="(item) => {
                    return item['union_node_id'] || item['node_id']
                }"
                virtual
                filterable
                ref="treeRef2"
                checkable
            />
        </wp-grid-item>
    </wp-space>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from 'vue'
const checked = ref([])
const checked2 = ref([])
const treeList = ref(tree.groups)
const treeList2 = ref([])

const treeRef = ref()
const treeRef2 = ref()

const handleAdd = () => {
    treeList2.value = Array.from(new Set([...treeList2.value, ...treeRef.value.getCheckedItems()]))
    checked.value = []
    nextTick(() => count.value = treeRef.value.getItemsCount(true))
}

const handleDelete = () => {
    const treeListSet = new Set(treeList2.value)
    treeRef2.value.getCheckedItems().forEach(item => {
        treeListSet.delete(item)
    })
    treeList2.value = Array.from(treeListSet)
    checked2.value = []
    nextTick(() => count.value = treeRef.value.getItemsCount(true))
}

const treeList2Keys = computed(() => {
    return treeList2.value.map(item => {
        return item['union_node_id'] || item['node_id']
    })
})

const count = ref<number>(0)

onMounted(() => {
    count.value = treeRef.value.getItemsCount(true)
})

const checkAll = () => {
    treeRef.value.checkAll()
}
</script>
```
:::


## API

### Props

| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| list | 渲染列表       | _TreeListItemCustom[]_          | []     |
| props | 参数 | _\{ key: string, title: string }_           | _key: 'key', title: 'title'_      |
| expends `v-model`   | 展开的项 | _(string \| number \| symbol)[]_ | -      |
| checked `v-model` | 选中项       | _(string \| number \| symbol)[]_                                                           | -  |
| checkable  | 是否可选中     | _boolean_                                                           | false   |
| selecting `v-model` | 选择项 | _string \| number \| symbol_ | - |
| selectable | 是否可选择 | _boolean_ | false |
| virtual | 是否使用虚拟列表 | _boolean_ | false |
| getKey | 函数式获得 key 值 | _(item: TreeListItemCustom) => string \| number \| symbol_ | - |
| height | 元素高度，仅使用虚拟列表时有效 | _String_ | '300px' |
| animation | 是否使用动画 | _boolean_ | true |
| animationMax | 最多多少项时不使用动画 | _number_ | 80 |
| showFilter | 是否显示过滤输入框 | _boolean_ | true |
| filter `v-model` | 过滤关键词 | _string_ | - |
| filterable | 是否可过滤 | _filterable_ | false |
| itemHeight | 项目高度，仅供虚拟列表使用 | _number_ | 30 |
| arrowRight | 箭头是否在右边 | _boolean_ | - |
| exclude | 排除项 | _(string \| number \| symbol)[]_ | - |
| useRadio | 是否单选 | _boolean_ | - |
| link | 是否显示连接线 | _boolean_ | false |

### Methods
| 参数      | 说明           | 类型                                                                | 默认值 |
| --------- | -------------- | ------------------------------------------------------------------- | ------ |
| select      | 选择后的回调       | _(key: string \| number \| symbol) => void_         | -     |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | --- |
| default | 默认插槽，会放置在最顶端 | - |
| title | 标题内容 | _...TreeListItemCustom, expending: boolean_ |
| suffix | 标题内容后缀 | _...TreeListItemCustom, expending: boolean_ |
| prefix | 标题内容前缀 | _...TreeListItemCustom, expending: boolean_ |
| filter | 过滤输入框 | _Ref\<string\>_ |

### Expose

| 方法名 | 说明 | 类型 |
| -- | -- | -- |
| getCheckedItems | 获得选中的元素 | _() => TreeListItemCustom[]_ |
| getFlattenList | 获得扁平化的列表 | _(getSet: boolean) => TreeListItemCustom[] \| Set\<TreeListItemCustom\>_ |
| getItemsCount | 获取叶子节点的数量 | _(filter: boolean) => number_ |
| checkAll | 全选 | _() => void_ |

## 类型

### TreeListItemCustom

| 名称 | 说明 | 类型 | 是否可选 |
| --- | --- | --- | --- |
| key | 唯一标识符 | _string \| number \| symbol_ | 是 |
| title | 标题 | _string_ | 是 |
| disabled | 是否禁用 | _boolean_ | 是 |
| children | TreeListItemCustom[] | 是 |