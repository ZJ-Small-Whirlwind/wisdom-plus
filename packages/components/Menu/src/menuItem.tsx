import { defineComponent, PropType, Component, inject, Ref, computed, watch, ComputedRef, ref, provide, h } from "vue"
import { MenuList, MenuRecord } from './typings'
import MenuItem from './menuItem'
import CollapseItem from '../../CollapseItem'
import Popover from '../../Popover'
import Tooltip from '../../Tooltip'
import Icon from '../../Icon'
export default defineComponent({
    name: 'MenuItem',
    props: {
        index: {
            type: String,
            required: true
        },
        title: String,
        icon: Object as PropType<Component>,
        children: {
            type: Array as PropType<MenuList>,
            default: () => []
        },
        isChild: Boolean,
        disabled: Boolean
    },
    setup(props, { slots }) {
        const clickMethod = inject<(record: MenuRecord) => void>('click')
        const parentSlots = inject<Ref<typeof slots>>('slots')
        const active = inject<Ref<string>>('active')
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
            } else {
                return list.index === active?.value
            }
        }
        const collapseActive = computed(() => {
            if (props.children?.length > 0) {
                return props.children.some(item => isActive(item))
            } else {
                return false
            }
        })

        const vertical = inject<ComputedRef<boolean>>('vertical')

        const unfold = inject<Ref<string[]>>('unfold')
        watch(collapseActive, () => {
            if (unfold && collapseActive.value && vertical?.value) {
                if (!unfold.value.includes(props.index)) unfold.value.push(props.index)
            }
        }, {
            immediate: true
        })

        const collapse = inject<ComputedRef<boolean>>('collapse')
        const trigger = inject<ComputedRef<'click' | 'hover'>>('trigger')
        return () => {
            const Title = (
                <>
                    {
                        props.icon ? (
                            <div class="wp-menu-item__icon">
                                <Icon>
                                    { h(props.icon) }
                                </Icon>
                            </div>
                        ) : null
                    }
                    {
                        parentSlots?.value?.title?.(props) || props.title
                    }
                </>
            )
            const TitleBox = (needClick = true, isActive = false) => {
                const TitleRaw = (
                    <div class={{
                        'wp-menu-item-title': true,
                        'wp-menu-item__active': isActive || active?.value === props.index,
                        'wp-menu-item__diabeld': props.disabled
                    }} onClick={() => {
                        if (props.disabled || !needClick) return
                        closeParent()
                        const afterClick = clickMethod?.(props)
                        if (!afterClick && active) active.value = props.index
                    }}>
                        { Title }
                    </div>
                )
                return vertical?.value && collapse?.value && needClick && !props.isChild ? (
                    <Tooltip trigger={trigger?.value || 'hover'} placement={'right'} v-slots={{
                        title: () => parentSlots?.value?.title?.(props) || props.title
                    }}>
                        { TitleRaw }
                    </Tooltip>
                ) : TitleRaw
            }
            return (
                <div class="wp-menu-item">
                    {
                        props.children?.length > 0 ? (
                            collapse?.value || !vertical?.value ? (
                                <Popover
                                    v-slots={{
                                        reference: () => TitleBox(false, collapseActive.value)
                                    }}
                                    placement={vertical?.value || props.isChild ? 'right' : 'bottom'}
                                    to={props.isChild ? false : undefined}
                                    arrow={false}
                                    v-model={popoverShow.value}
                                    trigger={trigger?.value || 'hover'}
                                    popoverClass={'wp-menu-popover'}
                                >
                                    { props.children?.map(item => (
                                        <MenuItem {...item} isChild={true} />
                                    )) || '' }
                                </Popover>
                            ) : (
                                <CollapseItem
                                    name={props.index}
                                    class={{
                                        'wp-menu-item__active': collapseActive.value,
                                        'wp-menu-item__diabeld': props.disabled
                                    }}
                                    onClickTitle={() => clickMethod?.(props)}
                                    v-slots={{
                                        title: () => Title
                                    }}
                                    disabled={props.disabled}
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