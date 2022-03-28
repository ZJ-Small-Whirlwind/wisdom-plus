import { defineComponent, ExtractPropTypes, PropType, onActivated, ref, watch, computed, reactive, onDeactivated } from "vue"

import { WpButton } from '../../../Button'
import { WpSpace, SpaceProps } from '../../../Space'
import { Toast } from '../../../Toast'
import { Dialog } from '../../../Modal'
import { WpTable, TableProps } from '../../../Table'
import { WpInput } from '../../../Input'
import { WpXScroll } from '../../../XScroll'
import { WpPagination } from '../../../Pagination'

import { buildProps } from '@wisdom-plus/utils/props'
import { useVModel } from '@vueuse/core'
import { onPageEnter } from "./utils"

export interface PageMap {
    page: string | number,
    size: string | number
}

export const proPageLayoutProps = buildProps({
    form: Object as PropType<{
        field?: string,
        placeholder?: string,
        queryAfterReset?: boolean,
        hideReset?: boolean,
        hideInput?: boolean,
        hideSearch?: boolean
    }>,
    showCheckedDelete: {
        type: Boolean,
        default: true
    },
    showPagination: {
        type: Boolean,
        default: true
    },
    total: {
        type: Number,
        default: 0
    },
    data: {
        type: Array as PropType<unknown[]>
    },
    table: {
        type: Object as PropType<{
            props?: Partial<TableProps> & Record<string, any>,
            columns?: TableProps['columns'],
            hideSelection?: boolean,
            keepSelection?: boolean
        }>,
        default: () => ({
            props: {},
            columns: [],
            hideSelection: false,
            keepSelection: false
        })
    },
    delete: Function as PropType<(items: any[]) => Promise<unknown>>,
    spaceProps: {
        type: Object as PropType<Partial<SpaceProps>>,
        default: () => ({})
    },
    queryOnActive: {
        type: Boolean,
        default: true
    },
    apis: {
        type: Object as PropType<{
            list?: (data: Record<string, any>, page: PageMap) => Promise<any>,
            delete?: (ids: (number | string)[]) => Promise<any>
        }>,
        default: () => ({})
    },
    async: Boolean
})

export type ProPageLayoutProps = ExtractPropTypes<typeof proPageLayoutProps>

export default defineComponent({
    name: 'WpProPageLayout',
    props: proPageLayoutProps,
    emits: {
        query: (formData: Record<string, any>, page: { page: number, size: number }) => {
            void formData
            void page
            return true
        },
        'update:data': (data: unknown[]) => {
            return Array.isArray(data)
        },
        reset: () => true
    },
    setup(props, { emit }) {
        const field = computed(() => props.form?.field || 'search')

        const page = reactive({
            page: 1,
            size: 20
        })

        const tableRef = ref<InstanceType<typeof WpTable> | null>(null)

        const columnsMap = computed(() => {
            const columnsNew = props.table.columns ? [...props.table.columns] : []
            if (!props.table.hideSelection) {
                columnsNew.unshift({ checkbox: true, prop: 'checkbox' })
            }
            return columnsNew
        })

        const tableData = useVModel(props, 'data', emit, {
            passive: true,
            deep: true
        })

        const dataRef = ref<unknown[]>([])
        const dataShow = computed(() => {
            if (tableData.value) {
                return tableData.value
            } else {
                return dataRef.value
            }
        })

        /**
         * 搜索表单
         */

        const formData = ref<Record<string, any>>({})
        const selections = ref<unknown[]>([])
        const handleSelectionChange = (currentSelections: unknown[]) => {
            selections.value = currentSelections
        }

        const totalRef = ref(0)
        const totalShow = computed(() => {
            if (props.apis.list) {
                return totalRef.value
            } else {
                return props.total
            }
        })

        const formDataBackup = ref<Record<string, any>>({})
        const handleQuery = async(resetPage = true, backup = false, refresh = false) => {
            if (resetPage) page.page = 1
            if (backup) formDataBackup.value = { ...formData.value }
            if (!refresh && !props.table?.keepSelection) {
                tableRef.value?.clearCheckbox()
            }
            if (props.apis.list) {
                const res = await props.apis.list(formDataBackup.value, page)
                totalRef.value = res.data.total
                if (tableData.value) {
                    tableData.value = res.data.list
                } else {
                    dataRef.value = res.data.list
                }
            } else {
                emit('query', formDataBackup.value, page)
            }
        }

        const reset = () => {
            for (const item in formData.value) {
                formData.value[item] = null
            }
            if (props.form?.queryAfterReset) {
                page.size = 20
                handleQuery(true, true)
            }
            tableRef.value?.clearCheckbox()
            emit('reset')
        }

        /**
         * 表格
         */
        const handleDelete = async(row: unknown) => {
            await Dialog({
                content: '确定要删除本条记录吗？',
                confirmProps: {
                    type: 'danger'
                }
            })
            if (props.apis.delete) {
                await props.apis.delete([(row as { id: number | string }).id])
            } else {
                await props.delete?.([row])
            }
            Toast({
                message: '删除成功',
                placement: 'center'
            })
            handleQuery(false)
        }

        const handleDeleteSelect = async() => {
            if (selections.value.length === 0) {
                Toast({
                    message: '请先选中任意项',
                    placement: 'center'
                })
                return
            }
            await Dialog({
                content: '确定要删除选中的记录吗？',
                confirmProps: {
                    type: 'danger'
                }
            })
            if (props.apis.delete) {
                await props.apis.delete((selections.value as { id: number | string }[]).map(item => item.id))
            } else {
                await props.delete?.(selections.value)
            }
            tableRef.value?.clearCheckbox()
            Toast({
                message: '删除成功',
                placement: 'center'
            })
            handleQuery(false)
        }

        onPageEnter(handleQuery, () => {
            if (props.queryOnActive) handleQuery(false, false, true)
        })

        /**
         * 分页
         */
        watch(() => page.page, () => {
            handleQuery(false)
        })
        watch(() => page.size, () => {
            handleQuery()
        })

        const tableProps = computed<any>(() => props.table?.props)

        return {
            tableRef,
            field,
            columnsMap,
            handleSelectionChange,
            reset,
            tableData,
            formData,
            selections,
            handleDelete,
            handleDeleteSelect,
            handleQuery,
            totalShow,
            dataShow,
            page,
            refresh: (resetPage = false, backup?: boolean) => handleQuery(resetPage, backup, true),
            getSelections: () => tableRef.value?.getCheckbox() || [],
            tableProps
        }
    },
    expose: ['refresh', 'getSelections', 'handleDelete'],
    render() {
        return (
            <div class="wp-pro-page-layout">
                <WpSpace size={15} vertical itemStyle={{
                    common: {
                        width: '100%',
                        overflow: 'hidden'
                    }
                }} {...this.spaceProps}>
                    <div class="wp-pro-page-layout-top">
                        <div class="wp-pro-page-layout-form" onKeydown={e => {
                            if (e.code === 'Enter') {
                                this.handleQuery(true, true)
                            }
                        }}>
                            <WpSpace align="center">
                                {
                                    this.$slots.formPrefix?.()
                                }
                                {
                                    !this.form?.hideInput && (
                                        <WpInput
                                            v-model={this.formData[this.field]}
                                            placeholder={this.form?.placeholder}
                                            clearable
                                        />
                                    )
                                }
                                { this.$slots.form?.({ formData: this.formData }) }
                                {
                                    !this.form?.hideSearch && (
                                        <WpButton type="primary" onClick={() => {
                                            this.handleQuery(true, true)
                                        }}>
                                            搜索
                                        </WpButton>
                                    )
                                }
                                {
                                    !this.form?.hideReset && (
                                        <WpButton onClick={this.reset}>
                                            重置
                                        </WpButton>
                                    )
                                }
                            </WpSpace>
                        </div>
                        <div class="wp-pro-page-layout-buttons">
                            <WpSpace>
                                {this.$slots.buttons?.()}
                                {
                                    this.showCheckedDelete && (
                                        <WpButton type="danger" onClick={this.handleDeleteSelect} disabled={this.selections.length === 0}>
                                            批量删除
                                        </WpButton>
                                    )
                                }
                            </WpSpace>
                        </div>
                    </div>
                    <div class="wp-pro-page-layout-table">
                        <WpTable
                            ref="tableRef"
                            data={this.dataShow}
                            border
                            stripe
                            columns={this.columnsMap}
                            row-key="id"
                            {...this.tableProps}
                            v-slots={this.$slots}
                            onSelectionChange={this.handleSelectionChange}
                        />
                        {
                            this.showPagination && (
                                <WpXScroll class="wp-pro-page-layout-pagination" smooth>
                                    <WpPagination
                                        page={this.page.page}
                                        onUpdate:page={page => this.page.page = page}
                                        size={this.page.size}
                                        onUpdate:size={size => this.page.size = size}
                                        sizes={[10, 20, 40, 60, 100]}
                                        total={this.totalShow}
                                        layout={['total', 'sizes', 'prev', 'pager', 'next', 'jumper']}
                                        spaceProps={{
                                            justify: 'right'
                                        }}
                                    />
                                </WpXScroll>
                            )
                        }
                    </div>
                </WpSpace>
            </div>
        )
    }
})