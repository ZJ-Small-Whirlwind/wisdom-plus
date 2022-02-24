import { ref, computed, defineComponent, PropType, Component, h, inject, ComputedRef, Ref, VNode } from 'vue'

import type { DropdownRecord } from './typings'
import Icon from '../../Icon'
import Popover, { PopoverProps, PopoverPlacement } from '../../Popover'

import DropdownItem from './dropdownItem'

const PopoverMap = Popover as any

import { RightOutlined } from '@vicons/antd'

export default defineComponent({
    name: 'WpDropdownItem',
    props: {
        index: {
            type: [String, Symbol, Number] as PropType<string | symbol | number>
        },
        title: [String, Object] as PropType<string | VNode>,
        click: Function as PropType<(record?: DropdownRecord) => void>,
        groupName: String,
        disabled: Boolean,
        divided: Boolean,
        children: {
            type: Array as PropType<DropdownRecord[]>
        },
        icon: Object as PropType<Component>,
        row: Object as PropType<any>,
        column: Object as PropType<any>,
    },
    setup(props, { slots }) {
        const popoverProps = inject<ComputedRef<Partial<PopoverProps> & Record<string, any>>>('wp-popover-props')
        const subMenuPlacement = inject<ComputedRef<PopoverPlacement>>('wp-dropdown-sub-menu-placement', computed(() => 'right'))
        const popoverClose = inject<() => void>('wp-popover-close')
        const dropdownClick = inject<(record?: DropdownRecord) => void>('wp-dropdown-click')
        const popoverShow = ref(false)
        const parentSlot = inject<typeof slots>('wp-dropdown-parent-slot')
        const showArrow = inject<Ref<boolean>>('wp-dropdown-show-arrow')
        return () => {
            const DropdownItemRaw = (
                <div class={{
                    'wp-dropdown-item': true,
                    'wp-dropdown-item__disabled': props.disabled,
                    'wp-dropdown-item__divided': props.divided && !props.groupName,
                    'wp-dropdown-item__with-arrow': showArrow?.value && props.children && props.children.length > 0
                }} onClick={() => {
                    if (props.disabled) return
                    if (!props.children || props.children.length === 0) popoverClose?.()
                    if (!props.click?.(props)) {
                        dropdownClick?.(props)
                    }
                }}>
                    {
                        props.icon ? (
                            <Icon class="wp-dropdown-item__icon">{ h(props.icon) }</Icon>
                        ) : null
                    }
                    { slots.title?.() || props.title }
                    {
                        showArrow?.value && props.children && props.children.length > 0 ? (
                            <Icon class="wp-dropdown-item__arrow"><RightOutlined /></Icon>
                        ) : null
                    }
                </div>
            )
            return (
                <>
                    {
                        props.groupName ? (
                            <div class={{
                                'wp-dropdown-group': true,
                                'wp-dropdown-item__divided': props.divided
                            }}>
                                { parentSlot?.group?.(props) || props.groupName }
                            </div>
                        ) : null
                    }
                    {
                        props.children && props.children.length > 0 ? (
                            <PopoverMap
                                popoverClass="wp-dropdown-popover"
                                trigger="hover"
                                { ...popoverProps?.value }
                                to={false}
                                modelValue={popoverShow.value}
                                onUpdate:modelValue={(value: boolean) => {
                                    if (props.disabled) return
                                    popoverShow.value = value
                                }}
                                placement={subMenuPlacement.value}
                                v-slots={{
                                    reference: () => DropdownItemRaw,
                                    default: () => (
                                        props.children?.map(item => (
                                            <DropdownItem { ...item } v-slots={{
                                                title: () => parentSlot?.title?.(item) || item.title
                                            }} />
                                        ))
                                    )
                                }}
                            />
                        ) : DropdownItemRaw
                    }
                </>
            )
        }
    }
})
