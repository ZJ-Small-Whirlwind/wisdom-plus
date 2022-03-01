import { defineComponent, ref, watchEffect, watch, onMounted, computed, nextTick, PropType, ExtractPropTypes } from "vue"

import { WpTree, type TreeListItemCustom } from '@wisdom-plus/components'
import { useVModel } from '@vueuse/core'
import { buildProps } from "@wisdom-plus/utils/props"

import { WpInput, WpButton, WpSpace, WpCheckbox } from '@wisdom-plus/components'
import { SearchOutlined } from '@vicons/antd'

export const proPersonTree = buildProps({
    modelValue: {
        type: Array as PropType<(string | number | symbol)[]>
    },
    checkedItems: Array as PropType<TreeListItemCustom[]>,
    useRadio: Boolean,
    handleDelete: {
        type: Function as PropType<() => void>
    },
    list: Array as PropType<TreeListItemCustom[]>,
    exclude: Array as PropType<(string | number | symbol)[]>,
    noFilterCount: Boolean,
    getData: {
        type: Function as PropType<() => Promise<TreeListItemCustom[]>>
    }
})

export type ProPersonTreeProps = ExtractPropTypes<typeof proPersonTree>

export default defineComponent({
    name: 'WpProPersonTree',
    props: proPersonTree,
    emits: {
        'update:modelValue': (value: (string | number | symbol)[]) => {
            void value
            return true
        },
        'update:checkedItems': (value: TreeListItemCustom[]) => {
            void value
            return true
        }
    },
    setup(props, { emit }) {
        const filter = ref('')
        const treeRef = ref<InstanceType<typeof WpTree> | null>(null)

        const checked = useVModel(props, 'modelValue', emit, { passive: true, deep: true })
        const expends = ref<string[]>([])

        const userData = ref<TreeListItemCustom[]>([])

        watchEffect(() => {
            if (!checked.value) {
                checked.value = []
            }
        })

        const listComputed = computed(() => {
            return props.list || userData.value
        })

        const count = ref(0)

        const updateCount = () => {
            if (!treeRef.value) return
            count.value = treeRef.value.getItemsCount(!props.noFilterCount)
        }

        watch(() => props.list, updateCount)

        const getCheckedItems = () => {
            if (!treeRef.value) return
            return treeRef.value.getCheckedItems()
        }

        watch(checked, () => {
            if (props.checkedItems) {
                const items = getCheckedItems()
                if (!items) return
                emit('update:checkedItems', items)
            }
        }, {
            deep: true
        })

        onMounted(updateCount)

        const checkedAll = computed<boolean>({
            get() {
                if (!checked.value) return false
                if (checked.value.length === 0) return false
                return checked.value.length >= count.value - (props.exclude?.length || 0)
            },
            set(value) {
                if (value) {
                    treeRef.value?.checkAll?.()
                } else {
                    checked.value = []
                }
            }
        })

        const filterCall = (item: any, text?: string) => {
            return item.username?.includes(text) || item.name?.includes(text)
        }

        if (!props.list) {
            props.getData?.()
                .then(data => {
                    userData.value = data
                    nextTick(updateCount)
                })
        }

        return {
            updateCount,
            getCheckedItems,
            checkedAll,
            filterCall,
            listComputed,
            filter,
            expends,
            count,
            checked,
            treeRef
        }
    },
    expose: ['getCheckedItems', 'updateCount'],
    render() {
        return (
            <div class="wp-pro-person-tree">
                <WpInput v-model={this.filter} prefix={SearchOutlined} placeholder="请输入关键词" />
                <WpSpace class="wp-pro-person-tree-bar" align="center" itemStyle={{
                    common: {
                        marginTop: '10px',
                        marginBottom: '5px'
                    },
                    0: {
                        marginLeft: '5px'
                    },
                    2: {
                        flex: 1,
                        textAlign: 'right'
                    }
                }}>
                    {
                        !this.useRadio && (
                            <>
                                <WpCheckbox
                                    v-model={this.checkedAll}
                                    size="small"
                                    disabled={this.count === 0}
                                    indeterminate={this.checked && this.checked.length > 0 && this.checked.length !== this.listComputed.length}
                                >全选</WpCheckbox>
                                {
                                    this.$slots.checked?.({ checked: this.checked, list: this.listComputed, count: this.count, itemsCount: this.listComputed.length }) ||
                                    (
                                        `已选：${this.checked?.length || 0}/${ this.count }`
                                    )
                                }
                            </>
                        )
                    }
                    {
                        (this.useRadio || this.handleDelete) && (
                            <WpButton
                                size="small"
                                type="text"
                                disabled={this.useRadio ? this.checked && this.checked.length === 0 : this.count === 0}
                                onClick={() => {
                                    this.useRadio ? (this.checked = []) : this.handleDelete?.()
                                }}
                            >
                                { this.useRadio ? '取消选中' : '全部删除'}
                            </WpButton>
                        )
                    }
                </WpSpace>
                <WpTree
                    ref="treeRef"
                    checked={this.checked}
                    onUpdate:checked={value => this.checked = value}
                    list={this.listComputed}
                    exclude={this.exclude}
                    props={{
                        key: 'id',
                        title: 'name'
                    }}
                    checkable
                    filterable
                    arrow-right
                    expends={this.expends}
                    filter={this.filter}
                    itemHeight={30}
                    height="200px"
                    virtual
                    useRadio={this.useRadio}
                    filterCall={this.filterCall}
                    v-slots={{
                        title: ({ name, username }) => name || username
                    }}
                />
            </div >
        )
    }
})