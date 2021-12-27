import { defineComponent, PropType, Component, inject, Ref, computed, watch, ComputedRef, ref, provide, h, CSSProperties } from 'vue'
import { MenuList, MenuRecord } from './typings'
import MenuItem from './MenuItem'
import CollapseItem from '../../CollapseItem'
import type { CollapseSupport } from '../../Collapse'
import Popover from '../../popover'
import Tooltip from '../../Tooltip'
import Icon from '../../Icon'
import { RightOutlined } from '@vicons/antd'

export default defineComponent({
    name: 'WpMenuItem',
    props: {
        index: {
            type: [String, Symbol, Number] as PropType<CollapseSupport>,
            required: true
        },
        title: String,
        icon: {
            type: [Object, String] as PropType<Component | string>,
            default: undefined
        },
        children: {
            type: Array as PropType<MenuList>,
            default: () => []
        },
        isChild: Boolean,
        disabled: Boolean,
        info: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        }
    },
    setup(props, { slots }) {
        const clickMethod = inject<(record: MenuRecord) => void>('click')
        const parentSlots = inject<Ref<typeof slots>>('slots')
        const active = inject<Ref<CollapseSupport>>('active')
        const popoverShow = ref(false)
        let closeParent = () => {}
        if (!props.isChild) {
            provide('wp-popover-show', popoverShow)
        } else {
            const parentPopoverShow = inject<Ref<boolean>>('wp-popover-show')
            closeParent = () => {
                if (parentPopoverShow) parentPopoverShow.value = false
            }
        }
        /**
         * CollapseItem 是否是激活项
         */
        const isActive = (list: MenuRecord) => {
            if (list.children && list.children?.length > 0) {
                for (const item of list.children) {
                    if (isActive(item)) return true
                }
                return false
            } 
            return list.index === active?.value
            
        }
        const collapseActive = computed(() => {
            if (props.children?.length > 0) {
                return props.children.some(item => isActive(item))
            } 
            return false
            
        })

        const vertical = inject<ComputedRef<boolean>>('vertical')

        const unfold = inject<Ref<CollapseSupport[]>>('unfold')
        watch(collapseActive, () => {
            if (unfold && collapseActive.value && vertical?.value) {
                if (!unfold.value.includes(props.index)) unfold.value.push(props.index)
            }
        }, {
            immediate: true
        })

        const collapse = inject<ComputedRef<boolean>>('collapse')
        watch(() => collapse?.value, () => {
            closeParent()
        })
        const trigger = inject<ComputedRef<'click' | 'hover'>>('trigger')
        const arrow = inject<ComputedRef<boolean>>('showArrow')
        const menuStyle = inject<ComputedRef<CSSProperties>>('menuStyle')
        return () => {
            const Title = (
                <>
                    {
                        props.icon ? (
                            <div class="wp-menu-item__icon">
                                <Icon name={typeof props.icon === 'string' ? props.icon : undefined} v-slots={{
                                    default: () => typeof props.icon !== 'string' ? h(props.icon as any) : ''
                                }} />
                            </div>
                        ) : null
                    }
                    {
                        !props.isChild && props.icon && collapse?.value && vertical?.value ? null : (
                            <div class="wp-menu-item__text">
                                {
                                    parentSlots?.value?.title?.(props) || props.title
                                }
                            </div>
                        )
                    }
                </>
            )
            const TitleBox = (needClick = true, isActive = false, showArrow = false) => {
                const TitleRaw = (
                    <div
                        class={{
                            'wp-menu-item-title': true,
                            'wp-menu-item__active': isActive || active?.value === props.index,
                            'wp-menu-item__diabled': props.disabled,
                            'wp-menu-item__with-arrow': showArrow && arrow?.value
                        }}
                        onClick={() => {
                            if (props.disabled || !needClick) return
                            closeParent()
                            const afterClick = clickMethod?.(props)
                            if (!afterClick && active) active.value = props.index
                        }}
                    >
                        { Title }
                        {
                            showArrow && arrow?.value ? (
                                <div class='wp-menu-item__arrow'>
                                    <Icon>
                                        { () => h(RightOutlined) }
                                    </Icon>
                                </div>
                            ) : null
                        }
                    </div>
                )
                return vertical?.value && collapse?.value && needClick && !props.isChild ? (
                    <Tooltip trigger={trigger?.value || 'hover'} placement={'right'} popoverClass={'wp-menu-tooltip'} v-slots={{
                        title: () => parentSlots?.value?.title?.(props) || props.title,
                        default: () => TitleRaw
                    }} />
                ) : TitleRaw
            }
            return (
                <div class="wp-menu-item">
                    {
                        props.children?.length > 0 ? (
                            collapse?.value || !vertical?.value ? (
                                <Popover
                                    v-slots={{
                                        reference: () => TitleBox(false, collapseActive.value, props.isChild)
                                    }}
                                    placement={vertical?.value || props.isChild ? 'right' : 'bottom-start'}
                                    to={props.isChild ? false : undefined}
                                    arrow={false}
                                    v-model={popoverShow.value}
                                    trigger={trigger?.value || 'hover'}
                                    popoverClass={'wp-menu-popover'}
                                    popoverStyle={menuStyle?.value}
                                >
                                    { props.children?.map(item => (
                                        <MenuItem {...item} isChild={true} />
                                    )) || '' }
                                </Popover>
                            ) : (
                                <CollapseItem
                                    name={props.index}
                                    class={{
                                        'wp-menu-item__active': collapseActive.value || active?.value === props.index,
                                        'wp-menu-item__diabled': props.disabled
                                    }}
                                    onClickTitle={() => clickMethod?.(props)}
                                    v-slots={{
                                        title: () => Title
                                    }}
                                    disabled={props.disabled}
                                    showArrow={arrow?.value}
                                >
                                    { props.children?.map(item => (
                                        <MenuItem {...item} isChild={true} />
                                    )) }
                                </CollapseItem>
                            )
                        ) : TitleBox()
                    }
                </div>
            )
        }
    }
})