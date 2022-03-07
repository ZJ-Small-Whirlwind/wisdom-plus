import {
    ref,
    computed,
    defineComponent,
    PropType,
    ExtractPropTypes
} from 'vue'
import Draggable from 'vuedraggable'
import './index.scss'
import WpIcon from '../../../Icon'
import WpDropdown from '../../../Dropdown'
import { Dialog } from '../../../Modal'
import { Plus, ArrowRight, MoreFilled } from '@element-plus/icons'
import { buildProps } from '@wisdom-plus/utils/props'
import { useAutoControl } from '@wisdom-plus/utils/use-control'

const DraggableElement = Draggable as any

export type CascaderMenu = Record<any, unknown>

export interface CascaderMenuDisplay {
    menus: CascaderMenu[];
    path: unknown[];
    parent?: CascaderMenu;
}

export interface CascaderProps {
    key?: string;
    title?: string;
    children?: string;
}

export const proCascaderProps = buildProps({
    modelValue: {
        type: Array as PropType<CascaderMenu[]>
    },
    props: {
        type: Object as PropType<CascaderProps>
    }
})

export type ProCascaderProps = ExtractPropTypes<typeof proCascaderProps>

export const cascaderDefaultProps: Required<CascaderProps> = {
    key: 'name',
    title: 'title',
    children: 'children'
}

export default defineComponent({
    name: 'WpProCascader',
    props: proCascaderProps,
    emits: {
        'update:modelValue': (menus?: CascaderMenu[]) => {
            void menus
            return true
        }
    },
    setup(props, { emit }) {
        const activeMenus = ref<unknown[]>([])
        const menusRef = ref<CascaderMenu[]>([])
        const menus = useAutoControl(menusRef, props, 'modelValue', emit)

        const cascaderProps = computed(() => {
            const final = { ...cascaderDefaultProps }
            Object.assign(final, props.props)
            return final
        })

        const menusDisplay = computed(() => {
            const final: CascaderMenuDisplay[] = []
            const path: unknown[] = []
            final.push({
                menus: menus.value || [],
                path: []
            })
            let lastLevelMenus = menus.value || []
            for (const activeMenu of activeMenus.value) {
                const findResult = lastLevelMenus.find(item => item[cascaderProps.value.key] === activeMenu)
                if (!findResult || !findResult[cascaderProps.value.children]) break
                path.push(findResult[cascaderProps.value.key])
                lastLevelMenus = findResult[cascaderProps.value.children] as CascaderMenu[]
                final.push({
                    menus: lastLevelMenus,
                    path,
                    parent: findResult
                })
            }
            const finalIncludes = final[final.length - 1].menus.find(item => activeMenus.value.includes(item[cascaderProps.value.key]))
            if (finalIncludes) {
                final.push({
                    menus: [],
                    path: [],
                    parent: finalIncludes
                })
            }
            return final
        })

        const drag = ref(false)

        const handleDelete = async (menu: CascaderMenu) => {
            await Dialog({ content: '确定要删除这个菜单吗？' })
            console.log(menu)
        }

        return {
            activeMenus,
            menusDisplay,
            drag,
            handleDelete,
            cascaderProps
        }
    },
    render() {
        return (
            <div class="wp-menu-manage">
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
                            class="wp-menu-manage--list"
                            animation={400}
                            key={index}
                            onStart={() => this.drag = true}
                            onEnd={() => this.drag = false}
                            v-slots={{
                                item: ({ element: menuItem }: { element: CascaderMenu }) => (
                                    <div key={menuItem[this.cascaderProps.key] as string} class={[
                                        'wp-menu-manage--item',
                                        {
                                            'wp-menu-manage--item--active': this.activeMenus.includes(menuItem[this.cascaderProps.key])
                                        }
                                    ]} onClick={() => {
                                        this.activeMenus = [...menuList.path, menuItem[this.cascaderProps.key]]
                                    }}>
                                        <span class="wp-menu-manage--item--text">
                                            {
                                                this.$slots.title?.(menuItem) ||
                                                menuItem[this.cascaderProps.title] ||
                                                menuItem[this.cascaderProps.key]
                                            }
                                            <WpDropdown list={[
                                                {
                                                    index: 0,
                                                    title: '按钮管理'
                                                },
                                                {
                                                    index: 1,
                                                    title: '编辑',
                                                    click: () => {
                                                        // this.modifyModal?.open()
                                                    }
                                                },
                                                {
                                                    index: 2,
                                                    title: '删除',
                                                    click: () => this.handleDelete(menuItem)
                                                }
                                            ]}>
                                                <WpIcon><MoreFilled /></WpIcon>
                                            </WpDropdown>
                                        </span>
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
                                    <div class="wp-menu-manage--header" key={'header'} onClick={() => {
                                        // this.modifyModal?.open()
                                    }}>
                                        <WpIcon><Plus /></WpIcon> 添加 {index + 1} 级菜单
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