<template>
    <div
        :class="{
            'wp-tree-node': true,
            'wp-tree-node__disabled': disabled,
            'wp-tree-node__selecting': selectable && selecting === keyIs
        }"
        @click="() => {
            if (selectable && !disabled) emit('update:selecting', keyIs)
            if (isNoChildren) return
            const index = expends.indexOf(keyIs)
            emit('expend', index > -1, keyIs, level)
        }"
    >
        <div class='wp-tree-node__indent'>
            <div
                class='wp-tree-node__indent-cell'
                :class="{
                    'wp-tree-node__indent-cell--link': link
                }"
                v-for="level in levels" :keyIs="level"
            />
        </div>
        <div class='wp-tree-node__title'>
            <div class="wp-tree-node__arrow" @click.stop="() => {
                const index = expends.indexOf(keyIs)
                emit('expend', index > -1, keyIs, level)
            }" v-if="!arrowRight">
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren" ref="icon">
                    <slot name="arrow" :expending="expending">
                        <RightOutlined />
                    </slot>
                </Icon>
            </div>
            <slot name="prefix" v-bind="{ ...list, expending }" />
            <div class="wp-tree-node__content">
                <template v-if="checkable">
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
                                emit('setChecked', value, children)
                            }
                        }"
                        v-if="!useRadio"
                    />
                    <Radio
                        @click.stop
                        :disabled="disabled || Boolean(children)"
                        :model-value="checkedStatus === 1"
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
            <div class="wp-tree-node__arrow" @click.stop="() => {
                const index = expends.indexOf(keyIs)
                emit('expend', index > -1, keyIs, level)
            }" v-if="arrowRight">
                <Icon :class="{ 'expend': expending }" v-if="!isNoChildren" ref="icon">
                    <slot name="arrow" :expending="expending">
                        <RightOutlined />
                    </slot>
                </Icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import Icon from '../../Icon'
import { RightOutlined } from '@vicons/antd'
import Checkbox from '../../Checkbox'
import Radio from '../../Radio'

import type { TreeListItemCustom, ExpendsList } from './interface'
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
    parent?: object,
    useRadio?: boolean,
    link?: boolean
}>()

const emit = defineEmits<{
    (e: 'setChecked', value: boolean, children: TreeListItemCustom[]): void,
    (e: 'expend', isDelete: boolean, key: string | number | symbol, level: number): void,
    (e: 'update:modelValue', checkedList: (string | number | symbol)[]): void,
    (e: 'update:selecting', selecting: string | number | symbol): void
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

const checkedList = useVModel(props, 'modelValue', emit, {
    passive: true,
    deep: true
})
</script>
