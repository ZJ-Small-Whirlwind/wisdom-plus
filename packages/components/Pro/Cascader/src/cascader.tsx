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
    status: -2 | -1 | 0 | 1;
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
        'update:menus': (menus: CascaderMenu[]) => (void menus, true),
        'update:modelValue': (value: any) => (void value, true),
        change: (value: unknown | unknown[]) => (void value, true),
        modify: (menuItem: CascaderMenu) => (void menuItem, true),
        delete: (menuItem: CascaderMenu) => (void menuItem, true),
        add: (menu: CascaderMenuDisplay) => (void menu, true),
        dragStart: (menu: CascaderMenuDisplay) => (void menu, true),
        dragEnd: (menu: CascaderMenuDisplay) => (void menu, true),
        dropdownClick: (record: DropdownRecord, menuItem: CascaderMenu) => (void record, void menuItem, true)
    },
    setup(props, { emit, slots }) {
        /**
         * 菜单
         */
        const menusRef = ref<CascaderMenu[]>([])
        const menus = useAutoControl(menusRef, props, 'menus', emit)
        const activeMenus = ref<unknown[]>([])

        /**
        * model
        */
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

        const getStatus = (model: unknown[], menus?: CascaderMenu[]) => {
            if (props.disabled || props.useRadio || !props.useCheckbox || !menus) return -2
            let count = 0
            for (const menu of menus) {
                if (model.includes(menu[cascaderProps.value.key])) {
                    count += 1
                    continue
                }
                if (menus.length - count !== 0 && count > 0) return 0
            }
            if (count === 0) return -1
            return 1
        }

        const menusDisplay = computed(() => {
            const final: CascaderMenuDisplay[] = []
            const path: unknown[] = []
            final.push({
                menus: menus.value || [],
                path: [],
                status: getStatus(model.value, menus.value)
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
                    parent: findResult,
                    status: getStatus(model.value, lastLevelMenus)
                })
            }
            if (props.editable) {
                const finalIncludes = final[final.length - 1].menus.find(item => activeMenus.value.includes(item[cascaderProps.value.key]))
                if (finalIncludes) {
                    final.push({
                        menus: [],
                        path: [],
                        parent: finalIncludes,
                        status: -2
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

        /** radio render */
        const RenderRadio = (menuItem: CascaderMenu) => (
            <WpRadio
                disabled={props.disabled || menuItem[cascaderProps.value.disabled] as boolean}
                modelValue={model.value === menuItem[cascaderProps.value.key]}
                onUpdate:modelValue={value => {
                    if (value === true) {
                        model.value = menuItem[cascaderProps.value.key]
                    }
                    formItem?.validate('change')
                }}
                onClick={(e: Event) => e.stopPropagation()}
            />
        )

        /** 递归设置为 true / false */
        const setTo = (children?: CascaderMenu[], value = true) => {
            if (!children) return
            if (!model.value) {
                model.value = []
            }
            children.forEach(child => {
                if (child[cascaderProps.value.disabled]) return
                const index = model.value.indexOf(child[cascaderProps.value.key])
                if (index > -1 && !value) {
                    model.value.splice(index, 1)
                } else if (index === -1 && value) {
                    model.value.push(child[cascaderProps.value.key])
                }
                setTo(child[cascaderProps.value.children] as CascaderMenu[], value)
            })
        }

        const setToParent = (key: unknown) => {
            if (!model.value) {
                model.value = []
            }
            for (const item of menusDisplay.value) {
                if (item.menus.find(menu => menu[cascaderProps.value.key] === key)) break
                for (const menu of item.menus) {
                    if (
                        activeMenus.value.includes(menu[cascaderProps.value.key]) &&
                        !model.value.includes(menu[cascaderProps.value.key])
                    ) {
                        model.value.push(menu[cascaderProps.value.key])
                    }
                }
            }
        }

        /** checkbox render */
        const RenderCheckbox = (menuItem: CascaderMenu) => {
            const key = menuItem[cascaderProps.value.key]
            const disabled = props.disabled || menuItem[cascaderProps.value.disabled] as boolean
            return (
                <WpCheckbox
                    disabled={disabled}
                    modelValue={model.value?.includes(key)}
                    onUpdate:modelValue={value => {
                        if (
                            !model.value ||
                            !Array.isArray(model.value)
                        ) model.value = []
                        const index = model.value.indexOf(key)
                        if (value === true) {
                            if (index === -1) model.value.push(key)
                            setToParent(key)
                        } else {
                            (model.value as unknown[]).splice(index, 1)
                        }
                        setTo(menuItem[cascaderProps.value.children] as CascaderMenu[], value)
                    }}
                    onClick={(e: Event) => e.stopPropagation()}
                />
            )
        }

        const RenderDropdown = (menuItem: CascaderMenu) => (
            <WpDropdown
                onClick={(record: DropdownRecord) => {
                    if (record.index === 'modify') {
                        emit('modify', menuItem)
                    } else if (record.index === 'delete') {
                        handleDelete(menuItem)
                    }
                    emit('dropdownClick', record, menuItem)
                }}
                list={dropdownList.value}
            >
                <WpIcon class="wp-pro-cascader--item--more"><MoreFilled /></WpIcon>
            </WpDropdown>
        )

        const RenderMenuItem = (menuList: CascaderMenuDisplay, menuItem: CascaderMenu) => (
            <div
                key={menuItem[cascaderProps.value.key] as string}
                class={[
                    'wp-pro-cascader--item',
                    {
                        'wp-pro-cascader--item--active': activeMenus.value.includes(menuItem[cascaderProps.value.key])
                    }
                ]}
                onClick={() => {
                    if (!props.editable && (!menuItem[cascaderProps.value.children])) return
                    activeMenus.value = [...menuList.path, menuItem[cascaderProps.value.key]]
                }}
            >
                <WpSpace size={8} class="wp-pro-cascader--item--text" align={'center'}>
                    {/* 单选多选 */}
                    {
                        props.useRadio ?
                        RenderRadio(menuItem) : (
                            props.useCheckbox && RenderCheckbox(menuItem)
                        )
                    }
                    {/* 标题 */}
                    {
                        slots.title?.(menuItem) ??
                        menuItem[cascaderProps.value.title] ??
                        menuItem[cascaderProps.value.key]
                    }
                    {/* 下拉菜单 */}
                    {
                        props.editable && props.showDropdown && RenderDropdown(menuItem)
                    }
                </WpSpace>
                {/* 箭头 */}
                {
                    menuItem[cascaderProps.value.children] && (
                        <WpIcon>
                            <ArrowRight />
                        </WpIcon>
                    )
                }
            </div>
        )

        return {
            activeMenus,
            menusDisplay,
            drag,
            handleDelete,
            dropdownList,
            cascaderProps,
            model,
            formItem,
            getItems,
            RenderMenuItem,
            setTo,
            setToParent
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
                                item: ({ element: menuItem }: { element: CascaderMenu }) => this.RenderMenuItem(menuList, menuItem),
                                header: () => (
                                    <div class="wp-pro-cascader--header--wrapper" key="header">
                                        {
                                            this.showAdd && this.editable && (
                                                    <div class="wp-pro-cascader--header" key={'header'} onClick={() => this.$emit('add', menuList)}>
                                                        { this.$slots.add?.(menuList) ?? (
                                                            <>
                                                                <WpIcon><Plus /></WpIcon> 添加 {index + 1} 级菜单
                                                            </>
                                                        ) }
                                                    </div>
                                            )
                                        }
                                        {
                                            this.useCheckbox && (
                                                <div class="wp-pro-cascader--header wp-pro-cascader--checkbox" key={'select'}>
                                                    <WpCheckbox
                                                        modelValue={menuList.status === 1}
                                                        indeterminate={menuList.status === 0}
                                                        disabled={menuList.status === -2}
                                                        onUpdate:modelValue={value => {
                                                            if (value) {
                                                                menuList.menus.forEach(menu => this.setToParent(menu))
                                                            }
                                                            this.setTo(menuList.menus, value)
                                                        }}
                                                    >全选</WpCheckbox>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }}
                        />
                    ))
                }
            </div>
        )
    }
})