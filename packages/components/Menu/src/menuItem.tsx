import { defineComponent, PropType, Component, inject, Ref, computed, watch } from "vue"
import { MenuList, MenuRecord } from './typings'
import MenuItem from './menuItem'
import CollapseItem from '../../CollapseItem'
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
        }
    },
    setup(props, { slots }) {
        const clickMethod = inject<(record: MenuRecord) => void>('click')
        const parentSlots = inject<Ref<typeof slots>>('slots')
        const active = inject<Ref<string>>('active')
        const collapseActive = computed(() => {
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
            if (props.children?.length > 0) {
                return isActive(props)
            } else {
                return false
            }
        })

        const unfold = inject<Ref<string[]>>('unfold')
        watch(collapseActive, () => {
            if (unfold && collapseActive.value) {
                if (!unfold.value.includes(props.index)) unfold.value.push(props.index)
            }
        }, {
            immediate: true
        })
        return () => {
            return (
                <div class="wp-menu-item">
                    {
                        props.children?.length > 0 ? (
                            <CollapseItem name={props.index} class={{
                                'wp-menu-item__active': collapseActive.value
                            }} onClickTitle={() => clickMethod?.(props)} v-slots={{
                                title: () => parentSlots?.value?.title?.(props) || props.title
                            }}>
                                { props.children?.map(item => (
                                    <MenuItem {...item} />
                                )) }
                            </CollapseItem>
                        ) : (
                            <div class={{
                                'wp-menu-item-title': true,
                                'wp-menu-item__active': active?.value === props.index
                            }} onClick={() => {
                                const afterClick = clickMethod?.(props)
                                if (!afterClick && active) active.value = props.index
                            }}>
                                {
                                    parentSlots?.value?.title?.(props) || props.title
                                }
                            </div>
                        )
                    }
                </div>
            )
        }
    }
})