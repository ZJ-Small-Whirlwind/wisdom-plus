import {
    ref,
    computed,
    defineComponent,
    PropType,
    ExtractPropTypes,
    watch,
    nextTick
} from 'vue'
import Draggable from './draggable/src/vuedraggable'
import WpSpace from '../../../Space'
import WpRadio from '../../../Radio'
import WpIcon from '../../../Icon'
import WpCheckbox from '../../../Checkbox'
import WpDropdown, { DropdownRecord } from '../../../Dropdown'
import { Dialog } from '../../../Modal'
import { Plus, ArrowRight, MoreFilled } from '@element-plus/icons'
import { buildProps } from '@wisdom-plus/utils/props'
import { useAutoControl } from '@wisdom-plus/utils/use-control'
import { useFormItem } from '@wisdom-plus/hooks'

const DraggableElement = Draggable as any

export type CascaderMenu = Record<any, unknown>

export interface CascaderMenuDisplay {
    menus: CascaderMenu[];
    path: unknown[];
    parent?: CascaderMenu;
}

export interface CascaderItemProps {
    key?: string;
    title?: string;
    children?: string;
    disabled?: string;
}

export const proCascaderProps = buildProps({
    modelValue: null,
    menus: {
        type: Array as PropType<CascaderMenu[]>
    },
    props: {
        type: Object as PropType<CascaderItemProps>
    },
    dropdownList: {
        type: Array as PropType<DropdownRecord[]>
    },
    showModify: {
        type: Boolean,
        default: true
    },
    showDelete: {
        type: Boolean,
        default: true
    },
    showAdd: {
        type: Boolean,
        default: true
    },
    showDropdown: {
        type: Boolean,
        default: true
    },
    draggable: {
        type: Boolean,
        default: true
    },
    useRadio: Boolean,
    useCheckbox: Boolean,
    preset: {
        type: String as PropType<'compact' | 'wide'>,
        default: 'wide'
    },
    editable: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

export type ProCascaderProps = ExtractPropTypes<typeof proCascaderProps>

export const cascaderDefaultProps: Required<CascaderItemProps> = {
    key: 'name',
    title: 'title',
    children: 'children',
    disabled: 'disabled'
}

export const findCascaderItems = (cascaderProps: Required<CascaderItemProps>, key: Set<unknown>, items: CascaderMenu[], menus?: CascaderMenu[]) => {
    if (!menus || !Array.isArray(menus)) return
    for (const menu of menus) {
        if (key.has(menu[cascaderProps.key])) {
            items.push(menu)
            key.delete(menu[cascaderProps.key])
        }
        if (menu[cascaderProps.children]) {
            findCascaderItems(cascaderProps, key, items, menu[cascaderProps.children] as CascaderMenu[])
        }
    }
}

export const getCascaderItems = (cascaderProps: Required<CascaderItemProps>, useRadio: boolean, model: unknown, menus?: CascaderMenu[]) => {
    const key = new Set((useRadio ? [model] : model) as unknown[])
    const items: CascaderMenu[] = []
    findCascaderItems(cascaderProps, key, items, menus)
    return items
}

export default defineComponent({
    name: 'WpProCascader',
    props: proCascaderProps,
    emits: {
        'update:menus': (menus: CascaderMenu[]) => {
            void menus
            return true
        },
        'update:modelValue': (value: any) => {
            void value
            return true
        },
        change: (value: unknown | unknown[]) => ((void value, true)),
        modify: (menuItem: CascaderMenu) => {
            void menuItem
            return true
        },
        delete: (menuItem: CascaderMenu) => {
            void menuItem
            return true
        },
        add: (menu: CascaderMenuDisplay) => {
            void menu
            return true
        },
        dragStart: (menu: CascaderMenuDisplay) => {
            void menu
            return true
        },
        dragEnd: (menu: CascaderMenuDisplay) => {
            void menu
            return true
        },
        dropdownClick: (record: DropdownRecord, menuItem: CascaderMenu) => {
            void record
            void menuItem
            return true
        }
    },
    setup(props, { emit }) {
        const activeMenus = ref<unknown[]>([])
        const menusRef = ref<CascaderMenu[]>([])
        const menus = useAutoControl(menusRef, props, 'menus', emit)

        const modelRef = ref<any>('')
        const model = useAutoControl(modelRef, props, 'modelValue', emit)

        const cascaderProps = computed(() => {
            const final = { ...cascaderDefaultProps }
            Object.assign(final, props.props)
            return final
        })

        const { formItem } = useFormItem({})

        watch(model, () => {
            formItem?.validate('change')
            emit('change', model.value)
        }, {
            deep: true
        })

        const menusDisplay = computed(() => {
            const final: CascaderMenuDisplay[] = []
            const path: unknown[] = []
            final.push({
                menus: menus.value || [],
                path: []
            })
            let lastLevelMenus = menus.value || []
            let level = 0
            for (const activeMenu of activeMenus.value) {
                const findResult = lastLevelMenus.find(item => item[cascaderProps.value.key] === activeMenu)
                if (
                    !findResult ||
                    !findResult[cascaderProps.value.children]
                ) break
                path.push(findResult[cascaderProps.value.key])
                level += 1
                lastLevelMenus = findResult[cascaderProps.value.children] as CascaderMenu[]
                final.push({
                    menus: lastLevelMenus,
                    path: path.slice(0, level),
                    parent: findResult
                })
            }
            if (props.editable) {
                const finalIncludes = final[final.length - 1].menus.find(item => activeMenus.value.includes(item[cascaderProps.value.key]))
                if (finalIncludes) {
                    final.push({
                        menus: [],
                        path: [],
                        parent: finalIncludes
                    })
                }
            }
            return final
        })

        const drag = ref(false)

        const handleDelete = async (menu: CascaderMenu) => {
            await Dialog({ content: '确定要删除这个菜单吗？' })
            emit('delete', menu)
        }

        const dropdownList = computed(() => {
            let finalList: DropdownRecord[] = []
            if (props.dropdownList) {
                finalList = [...props.dropdownList]
            }
            if (props.showModify) {
                finalList.push({
                    index: 'modify',
                    title: '编辑'
                })
            }
            if (props.showDelete) {
                finalList.push({
                    index: 'delete',
                    title: '删除'
                })
            }
            return finalList
        })

        const getItems = () => {
            return getCascaderItems(cascaderProps.value, props.useRadio, model.value, props.menus)
        }

        return {
            activeMenus,
            menusDisplay,
            drag,
            handleDelete,
            dropdownList,
            cascaderProps,
            model,
            formItem,
            getItems
        }
    },
    expose: ['getItems'],
    render() {
        return (
            <div
                class={[
                    'wp-pro-cascader',
                    `wp-pro-cascader-${this.preset}`
                ]}
            >
                {
                    this.menusDisplay.map((menuList, index) => (
                        <DraggableElement
                            modelValue={menuList.menus}
                            onUpdate:modelValue={(menus: CascaderMenu[]) => {
                                menuList.menus.length = 0
                                menus.forEach(menu => menuList.menus.push(menu))
                            }}
                            itemKey={this.cascaderProps.key}
                            tag="transition-group"
                            componentData={{ tag: 'div', type: 'transition-group', name: !this.drag ? 'flip-list' : null }}
                            class="wp-pro-cascader--list"
                            animation={400}
                            key={index}
                            onStart={() => {
                                this.drag = true
                                this.$emit('dragStart', menuList)
                            }}
                            onEnd={() => {
                                this.drag = false
                                this.$emit('dragEnd', menuList)
                            }}
                            disabled={!this.draggable || !this.editable}
                            v-slots={{
                                item: ({ element: menuItem }: { element: CascaderMenu }) => (
                                    <div key={menuItem[this.cascaderProps.key] as string} class={[
                                        'wp-pro-cascader--item',
                                        {
                                            'wp-pro-cascader--item--active': this.activeMenus.includes(menuItem[this.cascaderProps.key])
                                        }
                                    ]} onClick={() => {
                                        this.activeMenus = [...menuList.path, menuItem[this.cascaderProps.key]]
                                    }}>
                                        <WpSpace size={8} class="wp-pro-cascader--item--text" align={'center'}>
                                            {
                                                this.useRadio && (
                                                    <WpRadio
                                                        disabled={this.disabled || menuItem[this.cascaderProps.disabled] as boolean}
                                                        modelValue={this.model === menuItem[this.cascaderProps.key]}
                                                        onUpdate:modelValue={value => {
                                                            if (value === true) {
                                                                this.model = menuItem[this.cascaderProps.key]
                                                            }
                                                            this.formItem?.validate('change')
                                                        }}
                                                        onClick={(e: Event) => {
                                                            e.stopPropagation()
                                                        }}
                                                    />
                                                )
                                            }
                                            {
                                                this.useCheckbox && (
                                                    <WpCheckbox
                                                        disabled={this.disabled || menuItem[this.cascaderProps.disabled] as boolean}
                                                        modelValue={this.model?.includes(menuItem[this.cascaderProps.key])}
                                                        onUpdate:modelValue={value => {
                                                            if (!this.model || !Array.isArray(this.model)) this.model = []
                                                            const index = this.model.indexOf(menuItem[this.cascaderProps.key])
                                                            const setTo = (children: CascaderMenu[], value = true) => {
                                                                if (!children) return
                                                                children.forEach(child => {
                                                                    if (child[this.cascaderProps.disabled]) return
                                                                    const index = this.model.indexOf(child[this.cascaderProps.key])
                                                                    if (index > -1 && !value) {
                                                                        this.model.splice(index, 1)
                                                                    } else if (index === -1 && value) {
                                                                        this.model.push(child[this.cascaderProps.key])
                                                                    }
                                                                    if (this.model[this.cascaderProps.children]) setTo(this.model[this.cascaderProps.children])
                                                                })
                                                            }
                                                            if (value === true) {
                                                                if (index === -1) this.model.push(menuItem[this.cascaderProps.key])
                                                                for (const item of this.menusDisplay) {
                                                                    if (item.menus.find(menu => menu[this.cascaderProps.key] === menuItem[this.cascaderProps.key])) break
                                                                    for (const menu of item.menus) {
                                                                        if (
                                                                            this.activeMenus.includes(menu[this.cascaderProps.key]) &&
                                                                            !this.model.includes(menu[this.cascaderProps.key])
                                                                        ) {
                                                                            this.model.push(menu[this.cascaderProps.key])
                                                                        }
                                                                    }
                                                                }
                                                                setTo(menuItem[this.cascaderProps.children] as CascaderMenu[])
                                                            } else {
                                                                (this.model as any[]).splice(index, 1)
                                                                if (menuItem[this.cascaderProps.children]) {
                                                                    setTo(menuItem[this.cascaderProps.children] as CascaderMenu[], false)
                                                                }
                                                            }
                                                        }}
                                                        onClick={(e: Event) => {
                                                            e.stopPropagation()
                                                        }}
                                                    />
                                                )
                                            }
                                            {
                                                this.$slots.title?.(menuItem) ||
                                                menuItem[this.cascaderProps.title] ||
                                                menuItem[this.cascaderProps.key]
                                            }
                                            {
                                                this.editable && this.showDropdown && (
                                                    <WpDropdown onClick={(record: DropdownRecord) => {
                                                        if (record.index === 'modify') {
                                                            this.$emit('modify', menuItem)
                                                        } else if (record.index === 'delete') {
                                                            this.handleDelete(menuItem)
                                                        }
                                                        this.$emit('dropdownClick', record, menuItem)
                                                    }} list={this.dropdownList}>
                                                        <WpIcon class="wp-pro-cascader--item--more"><MoreFilled /></WpIcon>
                                                    </WpDropdown>
                                                )
                                            }
                                        </WpSpace>
                                        {
                                            menuItem[this.cascaderProps.children] && (
                                                <WpIcon>
                                                    <ArrowRight />
                                                </WpIcon>
                                            )
                                        }
                                    </div>
                                ),
                                header: () => (
                                    this.showAdd && this.editable && (
                                        <div class="wp-pro-cascader--header" key={'header'} onClick={() => this.$emit('add', menuList)}>
                                            { this.$slots.add?.(menuList) || (
                                                <>
                                                    <WpIcon><Plus /></WpIcon> 添加 {index + 1} 级菜单
                                                </>
                                            ) }
                                        </div>
                                    )
                                )
                            }}
                        />
                    ))
                }
            </div>
        )
    }
})