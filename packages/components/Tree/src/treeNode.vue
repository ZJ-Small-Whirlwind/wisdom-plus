<template>
    <div
        :class="{
            'wp-tree-node': true,
            'wp-tree-node__disabled': disabled,
            'wp-tree-node__selecting': selectable && selecting === keyIs,
            'wp-tree-node__ondrag': onDragging
        }"
        @click="() => {
            if (selectable && !disabled) emit('update:selecting', keyIs)
            if (isNoChildren && !remote) return
            expend()
        }"
        :draggable="draggable"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragover="handleDragover"
        @dragleave="onDragging = false"
        @drop="handleDrop"
    >
        <div
            class="wp-tree-node__dropline top"
            :class="{
                'wp-tree-node__ondrag': onDraggingTop
            }"
            v-if="draggable"
            @dragover="handleDragoverTop"
            @dragleave="onDraggingTop = false"
            @drop="handleDropTop"
        />
        <div class='wp-tree-node__indent'>
            <div
                class='wp-tree-node__indent-cell'
                :class="{
                    'wp-tree-node__indent-cell--link': link
                }"
                v-for="level in levels"
                :key="level"
            />
        </div>
        <div
            class='wp-tree-node__title'
        >
            <div class="wp-tree-node__arrow left" @click.stop="expend" v-if="!arrowRight">
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren || remote">
                    <slot name="arrow" :expending="expending" :loading="loading">
                        <RightOutlined v-if="!loading" />
                        <Loading3QuartersOutlined :class="{ loading }" v-else />
                    </slot>
                </Icon>
            </div>
            <slot name="prefix" v-bind="slotBind" />
            <div class="wp-tree-node__content">
                <template v-if="checkable">
                    <Checkbox
                        @click.stop
                        :disabled="disabled || remote"
                        :model-value="checkedStatus === 1"
                        :indeterminate="checkedStatus === 0"
                        @update:model-value="value => {
                            if (disabled) return
                            if (!children || checkStrictly) {
                                const index = checkedList.indexOf(keyIs)
                                if (value) {
                                    if (index > -1) return
                                    checkedList.push(keyIs)
                                } else {
                                    checkedList.splice(index, 1)
                                }
                            } else {
                                emit('setChecked', value, children)
                            }
                        }"
                        v-if="!useRadio"
                    />
                    <Radio
                        @click.stop
                        :disabled="disabled || (Boolean(children) && !checkStrictly) || remote"
                        :model-value="checkedStatus !== -1"
                        @update:model-value="() => {
                            if (disabled) return
                            if (!children || checkStrictly) {
                                checkedList = [keyIs]
                            }
                        }"
                        v-else
                    />
                </template>
                <slot v-bind="slotBind">
                    {{ title || keyIs }}
                </slot>
            </div>
            <slot name="suffix" v-bind="slotBind" />
            <div class="wp-tree-node__arrow right" @click.stop="expend" v-if="arrowRight">
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren || remote">
                    <slot name="arrow" :expending="expending" :loading="loading">
                        <RightOutlined v-if="!loading" />
                        <Loading3QuartersOutlined :class="{ loading }" v-else />
                    </slot>
                </Icon>
            </div>
        </div>
        <div
            class="wp-tree-node__dropline bottom"
            :class="{
                'wp-tree-node__ondrag': onDraggingBottom
            }"
            v-if="draggable"
            @dragover="e => handleDragoverTop(e, false)"
            @dragleave="onDraggingBottom = false"
            @drop="e => handleDropTop(e, false)"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, type Ref } from 'vue'

import Icon from '../../Icon'
import { RightOutlined, Loading3QuartersOutlined } from '@vicons/antd'
import Checkbox from '../../Checkbox'
import Radio from '../../Radio'

import type { TreeListItemCustom, ExpendsList, TreeListItemExtra } from './interface'
import { isChildrenOrSelf } from './utils'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
    keyIs: string | number | symbol,
    title: string,
    level: number,
    expends: (string | number | symbol)[],
    modelValue: (string | number | symbol)[],
    disabled: boolean,
    list: TreeListItemCustom,
    getChecked: (list: TreeListItemCustom) => -1 | -2 | 0 | 1,
    children?: TreeListItemCustom[],
    expendsList: ExpendsList[],
    checkable?: boolean,
    selecting?: string | number | symbol,
    selectable: boolean,
    arrowRight?: boolean,
    parent: TreeListItemCustom | null,
    useRadio?: boolean,
    link?: boolean,
    remote?: boolean,
    draggable?: boolean,
    checkStrictly?: boolean,
    propList?: TreeListItemCustom[],
    onRemote?: (item: TreeListItemCustom) => Promise<TreeListItemCustom[]>,
    onRemoteChange?: (list: TreeListItemCustom[]) => void
}>()

const emit = defineEmits<{
    (e: 'setChecked', value: boolean, children: TreeListItemCustom[]): void,
    (e: 'expend', isDelete: boolean, key: string | number | symbol, level: number): void,
    (e: 'update:modelValue', checkedList: (string | number | symbol)[]): void,
    (e: 'update:selecting', selecting: string | number | symbol): void
}>()

/**
 * 可拖拽
 */
const onDragging = ref(false)
const dragging = inject<Ref<TreeListItemExtra | null>>('wp-tree-dragging', ref(null))
const handleDragStart = () => {
    dragging.value = props
}
const handleDragEnd = () => {
    dragging.value = null
}

const dragRemove = (avoidIndex?: number) => {
    if (!dragging.value) return
    const dragChildren = dragging.value.parent ? dragging.value.parent.children : props.propList
    const index = dragChildren?.findIndex((item, i) => {
        /**
         * 如果有同一个父元素，会避免删除自身
         */
        if (dragging.value?.parent === props.parent && typeof avoidIndex === 'number') {
            return item === dragging.value?.list && i !== avoidIndex
        }
        return item === dragging.value?.list
    })
    if (typeof index === 'number' && index > -1) {
        dragChildren?.splice(index, 1)
    }
    // 如果没有任何子元素了，设为叶子节点
    if (dragChildren?.length === 0) {
        if (dragging.value.parent) dragging.value.parent.children = undefined
        // props.propList 不可能没有任何子元素，也不可能为叶子节点，所以不做修改
    }
    dragging.value = null
}

/**
 * isDroppable
 * 是否能被“丢”到上面
 */
const isDroppable = computed(() => {
    if (!props.draggable) return false
    if (props.remote || !dragging.value) return false
    if (props.parent === dragging.value.list) return false
    if (isChildrenOrSelf(dragging.value.list, props.list)) return false
    return true
})

/**
 * content 元素的 drop 判断
 */
const handleDragover = (e: Event) => {
    if (!isDroppable.value) return
    e.preventDefault()
    onDragging.value = true
}
const handleDrop = () => {
    onDragging.value = false
    if (!isDroppable.value || !dragging.value) return
    if (!props.list.children) props.list.children = []
    // add
    props.list.children.push(dragging.value.list)
    // remove
    dragRemove()
}

/**
 * 上线条或者下线条的 drop 判断
 */
const onDraggingTop = ref(false)
const onDraggingBottom = ref(false)
const handleDragoverTop = (e: Event, isTop = true) => {
    if (!isDroppable.value) return
    e.preventDefault()
    e.stopPropagation()
    if (isTop) {
        onDraggingTop.value = true
    } else {
        onDraggingBottom.value = true
    }
}
const handleDropTop = (e: Event, isTop = true) => {
    if (isTop) {
        onDraggingTop.value = false
    } else {
        onDraggingBottom.value = false
    }
    if (!isDroppable.value || !dragging.value) return
    e.stopPropagation()
    // add
    const dragChildren = props.parent ? props.parent.children : props.propList
    const index = dragChildren?.findIndex(item => item === props.list)
    if (typeof index === 'number' && index > -1) {
        dragChildren?.splice(isTop ? index : index + 1, 0, dragging.value.list)
    }
    // remove
    dragRemove(typeof index === 'number' ? ( isTop ? index : index + 1 ) : undefined)
}

const levels = computed(() => new Array(props.level))

const expending = computed(() => props.expends.includes(props.keyIs) || props.expendsList.find(item => !item.isDelete && item.keyIs === props.keyIs))
const checkedStatus = computed(() => props.getChecked(props.list))
const disabled = computed(() => {
    if (props.checkStrictly) {
        return props.disabled
    } else {
        return checkedStatus.value === -2
    }
})
const isNoChildren = computed(() => !props.children || props.children.length === 0)

const checkedList = useVModel(props, 'modelValue', emit, {
    passive: true,
    deep: true
})

/**
 * 展开的函数
 */
const loading = ref(false)
const expend = async () => {
    if (isNoChildren.value && !props.remote) return
    try {
        if (props.remote && props.onRemote) {
            loading.value = true
            const list = await props.onRemote(props.list)
            props.onRemoteChange?.(list)
            emit('expend', props.expends.includes(props.keyIs), props.keyIs, props.level)
        } else {
            emit('expend', props.expends.includes(props.keyIs), props.keyIs, props.level)
        }
    } finally {
        loading.value = false
    }
}

const slotBind = computed(() => {
    return { ...props.list, expending: expending.value }
})
</script>
