import { defineComponent, ref, nextTick, computed, watch, PropType, ExtractPropTypes } from "vue"
import { TreeListItemCustom, WpGrid, WpGridItem, WpProPersonTree, WpSpace, WpButton } from '@wisdom-plus/components'
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { ArrowRightOutlined, ArrowLeftOutlined } from '@vicons/antd'

export const proPersonTransfer = buildProps({
    modelValue: {
        type: Array as PropType<TreeListItemCustom[]>
    },
    list: {
        type: Array as PropType<TreeListItemCustom[]>
    },
    getData: {
        type: Function as PropType<() => Promise<TreeListItemCustom[]>>
    }
})

export type ProPersonTransfer = ExtractPropTypes<typeof proPersonTransfer>

export default defineComponent({
    name: 'WpProPersonTransfer',
    props: proPersonTransfer,
    emits: {
        'update:modelValue': (value?: TreeListItemCustom[]) => {
            void value
            return true
        }
    },
    setup(props, { emit }) {
        const bindRef = ref<TreeListItemCustom[]>([])
        const bindPersons = useAutoControl(bindRef, props, 'modelValue', emit)
        const bindChoosing = ref<(string | number | symbol)[]>([])
        const bindPersonsChoosing = ref<(string | number | symbol)[]>([])

        const choosing = ref<InstanceType<typeof WpProPersonTree> | null>(null)
        const personChoosing = ref<InstanceType<typeof WpProPersonTree> | null>(null)

        const updateCount = () => {
            nextTick(() => {
                personChoosing.value?.updateCount()
            })
        }

        const excludes = computed(() => {
            return bindPersons.value?.map(item => item.id as number)
        })

        const leftArrowClick = () => {
            if (!choosing.value) return
            const excludesSet = new Set(excludes.value)
            const checkedItems = choosing.value.getCheckedItems() || []
            for (const item of checkedItems) {
                if (excludesSet.has(item.id)) continue
                if (!bindPersons.value) bindPersons.value = []
                bindPersons.value.push(item)
            }
            bindChoosing.value = []
        }

        const rightArrowClick = () => {
            const bindPersonsChoosingSet = new Set(bindPersonsChoosing.value)
            bindPersons.value = bindPersons.value?.filter(item => item.id && !bindPersonsChoosingSet.has(item.id))
            bindPersonsChoosing.value = []
            updateCount()
        }

        const handleDeleteAll = () => {
            bindPersons.value = []
            bindPersonsChoosing.value = []
        }

        watch(bindPersons, updateCount, {
            deep: true
        })

        return {
            choosing,
            excludes,
            bindPersons,
            handleDeleteAll,
            bindChoosing,
            leftArrowClick,
            rightArrowClick,
            bindPersonsChoosing,
            personChoosing
        }
    },
    render() {
        return (
            <WpGrid class="wp-pro-person-transfer">
                <WpGridItem span={10}>
                    <WpProPersonTree
                        ref="choosing"
                        v-model={this.bindChoosing}
                        exclude={this.excludes}
                        no-filter-count
                        list={this.list}
                        getData={this.getData}
                        v-slots={{
                            checked: ({ checked }) => `已选：${checked?.length} 人`
                        }}
                    />
                </WpGridItem>
                <WpGridItem span={4}>
                    <WpSpace class="wp-pro-person-transfer--arrow-space" vertical align="center" justify="center">
                        <WpButton icon={ArrowRightOutlined} disabled={this.bindChoosing.length === 0} onClick={this.leftArrowClick} />
                        <WpButton icon={ArrowLeftOutlined} disabled={this.bindPersonsChoosing.length === 0} onClick={this.rightArrowClick} />
                    </WpSpace>
                </WpGridItem>
                <WpGridItem span={10}>
                    <WpProPersonTree
                        ref="personChoosing"
                        v-model={this.bindPersonsChoosing}
                        list={this.bindPersons}
                        handleDelete={this.handleDeleteAll}
                    />
                </WpGridItem>
            </WpGrid>
        )
    }
})