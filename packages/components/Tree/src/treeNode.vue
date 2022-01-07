<template>
    <div
        :class="{
            'wp-tree-node': true,
            'wp-tree-node__disabled': disabled
        }"
        @click="() => {
            if (isNoChildren) return
            const index = expends.indexOf(keyIs)
            emits('expend', index > -1, keyIs, level)
        }"
    >
        <div class='wp-tree-node__indent'>
            <div class='wp-tree-node__indent-cell' v-for="level in levels" :keyIs="level" />
        </div>
        <div class='wp-tree-node__title'>
            <div class="wp-tree-node__arrow">
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren" ref="icon">
                    <RightOutlined />
                </Icon>
            </div>
            <div class="wp-tree-node__content">
                <Checkbox
                    @click.stop
                    :disabled="disabled"
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
                            emits('setChecked', value, children)
                        }
                    }"
                />
                <slot v-bind="list">
                    {{ title || keyIs }}
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import Icon from '../../Icon'
import { RightOutlined } from '@vicons/antd'
import Checkbox from '../../Checkbox'

import type { TreeListItemCustom, ExpendsList } from './interface'

const props = defineProps<{
    keyIs: string | number | symbol,
    title: string,
    level: number,
    expends: (string | number | symbol)[],
    checkedList: (string | number | symbol)[],
    disabled: boolean,
    list: TreeListItemCustom,
    getChecked: (list: TreeListItemCustom) => -1 | -2 | 0 | 1,
    children?: TreeListItemCustom[],
    expendsList: ExpendsList[]
}>()

const emits = defineEmits<{
    (e: 'setChecked', value: boolean, children: TreeListItemCustom[]): void,
    (e: 'expend', isDelete: boolean, key: string | number | symbol, level: number): void
}>()

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
</script>
