import { buildProps, definePropType } from "@wisdom-plus/utils/props"
import { computed, CSSProperties, defineComponent, ExtractPropTypes, PropType, provide, ref, VNodeChild } from "vue"

import type { TreeListItemCustom, TreeListItemExtra, TreeListItem, ExpendsList } from './interface'

import { useAutoControl } from "@wisdom-plus/utils/use-control"

import VirtualList from '../../VirtualList'

import TreeNode from './treeNode.vue'
import TreeTransition from './treeTransition.vue'

import { flattenList, getChecked, getCheckedItems, itemsFilter, getFlattenList, getItemsCount } from './utils'

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
    height: String,
    indent: String,
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
        default: 80
    },
    selectable: Boolean,
    selecting: definePropType<string | number | symbol>([String, Number, Symbol]),
    filter: String,
    arrowRight: Boolean,
    exclude: Array as PropType<(string | number | symbol)[]>,
    useRadio: Boolean,
    link: Boolean,
    onRemote: Function as PropType<(item: TreeListItemCustom) => Promise<TreeListItemCustom[]>>,
    draggable: Boolean,
    filterCall: Function as PropType<(item: TreeListItemCustom, text?: string) => boolean>,
    checkStrictly: Boolean
})

export type TreeProps = ExtractPropTypes<typeof treeProps>

export default defineComponent({
    name: 'WpTree',
    props: treeProps,
    emits: {
        'update:expends': (expends: (string | number | symbol)[]) => Array.isArray(expends),
        'update:checked': (checked: (string | number | symbol)[]) => Array.isArray(checked),
        'update:selecting': (selecting: string | number | symbol) => {
            void selecting
            return true
        },
        'select': (selecting: string | number | symbol) => {
            void selecting
            return true
        }
    },
    setup(props, { emit }) {
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
        const selectingRef = ref<string | number | symbol>()
        const selecting = useAutoControl(selectingRef, props, 'selecting', emit)
        const checkedSet = computed(() => new Set(checked.value))
        const setChecked = (value: boolean, list: TreeListItem[], checkedSet: Set<string | number | symbol>, excludeSet: Set<string | number | symbol>) => {
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                const key = props.getKey ? props.getKey(item) : item[props.props.key]
                if (excludeSet.has(key) && value) continue
                if (item.children && item.children.length > 0) {
                    setChecked(value, item.children, checkedSet, excludeSet)
                    continue
                }
                if (item.disabled || item.remote) continue
                if (item.children) continue
                if (value) {
                    checkedSet.add(key)
                } else {
                    checkedSet.delete(key)
                }
            }
        }
        const setingChecked = (value: boolean, list: TreeListItem[]) => {
            const excludeSet = new Set<string | number | symbol>(props.exclude)
            setChecked(value, list, checkedSet.value, excludeSet)
            checked.value = Array.from(checkedSet.value)
        }
        /**
         * 过滤
         */
        const filterItems = computed(() => {
            return itemsFilter(props, props.filter)
        })
        const treeListFlatten = computed(() => {
            const finalList: TreeListItemExtra[] = []
            filterItems.value.forEach(item => {
                flattenList(item, finalList, 0, null, expends.value, props)
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
            if (expendsList.value.find(item => item.keyIs === key)) return
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
        const dragging = ref<TreeListItemExtra | null>(null)
        provide('wp-tree-dragging', dragging)

        function getFlattenListExpose(getSet: true): Set<TreeListItemCustom>;
        function getFlattenListExpose(getSet: false): TreeListItemCustom[];
        function getFlattenListExpose(getSet = false) {
            return getSet ? getFlattenList(props.list, true) : getFlattenList(props.list, false)
        }

        return {
            expends,
            selecting,
            checked,
            checkedSet,
            expendsList,
            setingChecked,
            handleExpend,
            leave,
            done,
            treeListFlatten,
            getCheckedItems: () => getCheckedItems(props.list, checked.value, props),
            getFlattenList: getFlattenListExpose,
            getItemsCount: (filter = false) => getItemsCount(filter ? filterItems.value : props.list, props),
            checkAll: () => {
                if (props.useRadio) return
                setingChecked(true, props.list)
            }
        }
    },
    expose: ['getCheckedItems', 'getFlattenList', 'getItemsCount', 'checkAll'],
    render() {
        const TreeNodeFactory = (item: TreeListItemExtra) => (
            <TreeNode
                { ...item }
                expends={this.expends}
                getChecked={(list: TreeListItemCustom) => getChecked(list, this.$props, this.checkedSet)}
                v-model={this.checked}
                selecting={this.selecting}
                expendsList={this.expendsList}
                onSetChecked={this.setingChecked}
                onExpend={this.handleExpend}
                checkable={this.checkable}
                selectable={this.selectable}
                arrowRight={this.arrowRight}
                useRadio={this.useRadio}
                onUpdate:selecting={(value: string | number | symbol) => this.selecting = value}
                link={this.link}
                draggable={this.draggable}
                propList={this.list}
                onRemote={this.onRemote}
                onRemoteChange={(list: TreeListItemCustom[]) => {
                    item.list.remote = false
                    item.list.children = list
                }}
                checkStrictly={this.checkStrictly}
                v-slots={{
                    default: this.$slots.title,
                    suffix: this.$slots.suffix,
                    prefix: this.$slots.prefix,
                    arrow: this.$slots.arrow
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
            const expendsListFind =  this.expendsList.find(expendsItem => expendsItem.keyIs === item.keyIs)
            if (this.animation && expendsListFind && item.children) {
                const finalList: TreeListItemExtra[] = []
                item.children.forEach(child => {
                    flattenList(child, finalList, expendsListFind.level + 1, null, this.expends, this.$props)
                })
                if (finalList.length <= this.animationMax) {
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
                this.leave(expendsListFind.keyIs)
                this.done(expendsListFind.isDelete, expendsListFind.keyIs)
            }
            return TreeNodeRender()
        }
        return (
            <div
                class={'wp-tree'}
                style={{
                    '--wp-tree-indent': this.indent || '',
                    '--wp-tree-node-height': this.itemHeight + 'px'
                } as CSSProperties}
            >
                { this.$slots.default?.() }
                {
                    !this.virtual ? (
                        <div class={'wp-tree-nodes'} style={{
                            height: this.height
                        }}>
                            { this.treeListFlatten.map(treeNodeRender) }
                        </div>
                    ) : (
                        <VirtualList
                            keyField="key"
                                class={'wp-tree-nodes'}
                            style={{
                                height: this.height
                            }}
                            itemSize={this.itemHeight}
                                items={this.treeListFlatten}
                            v-slots={{
                                default: ({ item }) => treeNodeRender(item)
                            }}
                        />
                    )
                }
            </div>
        )
    }
})