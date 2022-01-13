<template>
    <div
        :class="{
            'wp-tree-node': true,
            'wp-tree-node__disabled': disabled,
            'wp-tree-node__selecting': selectable && selecting === keyIs
        }"
        @click="() => {
            if (selectable && !disabled) emit('update:selecting', keyIs)
            if (isNoChildren && !remote) return
            expend()
        }"
    >
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
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren || remote" ref="icon">
                    <slot name="arrow" :expending="expending" :loading="loading">
                        <RightOutlined v-if="!loading" />
                        <Loading3QuartersOutlined :class="{ loading }" v-else />
                    </slot>
                </Icon>
            </div>
            <slot name="prefix" v-bind="{ ...list, expending }" />
            <div class="wp-tree-node__content">
                <template v-if="checkable">
                    <Checkbox
                        @click.stop
                        :disabled="disabled || remote"
                        :model-value="checkedStatus === 1"
                        :indeterminate="checkedStatus === 0"
                        @update:model-value="value => {
                            if (disabled) return
                            if (!children) {
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
                        :disabled="disabled || Boolean(children) || remote"
                        :model-value="checkedStatus !== -1"
                        @update:model-value="() => {
                            if (disabled) return
                            if (!children) {
                                checkedList = [keyIs]
                            }
                        }"
                        v-else
                    />
                </template>
                <slot v-bind="{ ...list, expending }">
                    {{ title || keyIs }}
                </slot>
            </div>
            <slot name="suffix" v-bind="{ ...list, expending }" />
            <div class="wp-tree-node__arrow right" @click.stop="expend" v-if="arrowRight">
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren || remote" ref="icon">
                    <slot name="arrow" :expending="expending" :loading="loading">
                        <RightOutlined v-if="!loading" />
                        <Loading3QuartersOutlined :class="{ loading }" v-else />
                    </slot>
                </Icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, type Ref } from 'vue'

import Icon from '../../Icon'
import { RightOutlined, Loading3QuartersOutlined } from '@vicons/antd'
import Checkbox from '../../Checkbox'
import Radio from '../../Radio'

import type { TreeListItemCustom, ExpendsList, TreeListItemExtra } from './interface'
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
    // draggable?: boolean,
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
// const onDragging = ref(false)
// const dragging = inject<Ref<TreeListItemExtra | null>>('wp-tree-dragging', ref(null))
// const handleDragStart = () => {
//     dragging.value = props
// }
// const handleDragEnd = () => {
//     dragging.value = null
// }

// const handleDragover = (e: Event) => {
//     e.preventDefault()
//     onDragging.value = true
// }
// const handleDrop = () => {
//     onDragging.value = false
//     if (dragging.value === props.list) return
//     if (!dragging.value) return
//     if (!props.list.children) props.list.children = []
//     props.list.children.push(dragging.value.list)
//     if (dragging.value.parent) {
//         const index = dragging.value.parent.children?.findIndex(item => item === dragging.value?.list)
//         if (typeof index === 'number') {
//             dragging.value.parent.children?.splice(index, 1)
//         }
//     }
// }

const levels = computed(() => {
    return new Array(props.level)
})

const icon = ref()

const expending = computed(() => {
    return props.expends.includes(props.keyIs) || props.expendsList.find(item => !item.isDelete && item.keyIs === props.keyIs)
})

const checkedStatus = computed(() => {
    return props.getChecked(props.list)
})

const disabled = computed(() => {
    return props.disabled || checkedStatus.value === -2
})

const isNoChildren = computed(() => {
    return !props.children || props.children.length === 0
})

const checkedList = useVModel(props, 'modelValue', emit, {
    passive: true,
    deep: true
})

const loading = ref(false)

const expend = async () => {
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
</script>
