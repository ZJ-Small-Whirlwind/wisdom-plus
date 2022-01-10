import { buildProps } from "@wisdom-plus/utils/props"
import { computed, defineComponent, ExtractPropTypes, PropType, ref, VNodeChild } from "vue"

import type { TreeListItemCustom, TreeListItemExtra, TreeListItem, ExpendsList } from './interface'

import { useAutoControl } from "@wisdom-plus/utils/use-control"

import VirtualList from '../../VirtualList'

import TreeNode from './treeNode.vue'
import TreeTransition from './treeTransition.vue'

import { flattenList, getChecked, getCheckedItems, itemsFilter } from './utils'

export const treeProps = buildProps({
    list: {
        type: Array as PropType<TreeListItemCustom[]>,
        default: () => []
    },
    props: {
        type: Object as PropType<{ key: string, title: string }>,
        default: () => ({
            key: 'key',
            title: 'title'
        })
    },
    expends: {
        type: Array as PropType<(string | number | symbol)[]>,
        default: undefined
    },
    checkable: Boolean,
    checked: {
        type: Array as PropType<(string | number | symbol)[]>,
        default: undefined
    },
    virtual: Boolean,
    getKey: Function as PropType<(item: TreeListItemCustom) => string | number | symbol>,
    height: {
        type: String,
        default: '300px'
    },
    animation: {
        type: Boolean,
        default: true
    },
    filterable: Boolean,
    itemHeight: {
        type: Number,
        default: 30
    },
    animationMax: {
        type: Number,
        default: 200
    }
})

export type TreeProps = ExtractPropTypes<typeof treeProps>

export default defineComponent({
    name: 'WpTree',
    props: treeProps,
    emits: {
        'update:expends': (expends: (string | number | symbol)[]) => Array.isArray(expends),
        'update:checked': (checked: (string | number | symbol)[]) => Array.isArray(checked)
    },
    setup(props, { emit, expose, slots }) {
        const expendsRef = ref<(string | number | symbol)[]>([])
        const expends = useAutoControl(expendsRef, props, 'expends', emit, {
            passive: true,
            deep: true
        })
        const checkedRef = ref<(string | number | symbol)[]>([])
        const checked = useAutoControl(checkedRef, props, 'checked', emit, {
            passive: true,
            deep: true
        })
        const checkedSet = computed(() => new Set(checked.value))
        const setChecked = (value: boolean, list: TreeListItem[], checkedSet: Set<string | number | symbol>) => {
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                const key = props.getKey?.(item) || item[props.props.key]
                if (item.children && item.children.length > 0) {
                    setChecked(value, item.children, checkedSet)
                    continue
                }
                if (item.disabled) continue
                if (value) {
                    checkedSet.add(key)
                    checked.value.push(key)
                } else {
                    checkedSet.delete(key)
                }
            }
        }
        const setingChecked = (value: boolean, list: TreeListItem[]) => {
            setChecked(value, list, checkedSet.value)
            checked.value = Array.from(checkedSet.value)
        }
                /**
         * 过滤
         */
        const filterText = ref('')
        const filterItems = computed(() => itemsFilter(props, filterText.value))
        const treeListFlatten = computed(() => {
            const finalList: TreeListItemExtra[] = []
            filterItems.value.forEach(item => {
                flattenList(item, finalList, 0, null, expends, checked, props)
            })
            return finalList
        })
        const expendsList = ref<ExpendsList[]>([])
        const done = (isDelete: boolean, key: string | number | symbol) => {
            const index = expends.value.indexOf(key)
            if (isDelete) {
                expends.value.splice(index, 1)
            } else if (key) expends.value.push(key)
        }
        const leave = (key: string | number | symbol) => {
            const expendIndex = expendsList.value.findIndex(expendsItem => expendsItem.keyIs === key)
            if (expendIndex > -1) {
                expendsList.value.splice(expendIndex, 1)
            }
        }
        const handleExpend = (isDelete: boolean, key: string | number | symbol, level: number) => {
            if (props.animation) {
                expendsList.value.push({
                    isDelete,
                    keyIs: key,
                    level,
                    leave: () => {
                        leave(key)
                    },
                    done: () => {
                        done(isDelete, key)
                    }
                })
            } else {
                done(isDelete, key)
            }
        }
        expose({
            getCheckedItems: () => getCheckedItems(props.list, checked.value, props)
        })
        return () => {
            const TreeNodeFactory = (item: TreeListItemExtra) => (
                <TreeNode
                    { ...item }
                    expends={expends.value}
                    getChecked={(list: TreeListItemCustom) => getChecked(list, props, checkedSet.value)}
                    v-model={checked.value}
                    expendsList={expendsList.value}
                    onSetChecked={setingChecked}
                    onExpend={handleExpend}
                    checkable={props.checkable}
                    v-slots={{
                        default: (list: TreeListItemCustom) => slots.title?.(list)
                    }}
                />
            )
            const treeNodeRender = (item: TreeListItemExtra) => {
                const TreeNodeRender = (dom?: VNodeChild) => (
                    <>
                        { TreeNodeFactory(item) }
                        { dom }
                    </>
                )
                const expendsListFind =  expendsList.value.find(expendsItem => expendsItem.keyIs === item.keyIs)
                if (props.animation && expendsListFind && item.children) {
                    const finalList: TreeListItemExtra[] = []
                    item.children.forEach(child => {
                        flattenList(child, finalList, expendsListFind.level + 1, null, expends, checked, props)
                    })
                    if (finalList.length <= props.animationMax) {
                        return (
                            TreeNodeRender(
                                <TreeTransition key={item.key} {...expendsListFind} v-slots={{
                                    default: () => (
                                        <div>
                                            { finalList.map(TreeNodeFactory) }
                                        </div>
                                    )
                                }} />
                            )
                        )
                    }
                    leave(expendsListFind.keyIs)
                    done(expendsListFind.isDelete, expendsListFind.keyIs)
                }
                return TreeNodeRender()
            }
            return (
                <div class={'wp-tree'}>
                    { slots.default?.() }
                    {
                        props.filterable ? (
                            <input v-model={filterText.value} />
                        ) : null
                    }
                    {
                        !props.virtual ? (
                            treeListFlatten.value.map(treeNodeRender)
                        ) : (
                            <VirtualList
                                keyField="key"
                                style={{
                                    height: props.height
                                }}
                                itemSize={props.itemHeight}
                                items={treeListFlatten.value}
                                v-slots={{
                                    default: ({ item }) => treeNodeRender(item)
                                }}
                            />
                        )
                    }
                </div>
            )
        }
    }
})