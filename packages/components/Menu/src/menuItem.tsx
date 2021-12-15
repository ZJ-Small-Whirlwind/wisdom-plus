import { defineComponent, PropType, Component, inject, Ref } from "vue"
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
        return () => {
            return (
                <div class="wp-menu-item">
                    {
                        props.children?.length > 0 ? (
                            <CollapseItem name={props.index} onClickTitle={() => clickMethod?.(props)} v-slots={{
                                title: () => parentSlots?.value?.title?.(props) || props.title
                            }}>
                                { props.children?.map(item => (
                                    <MenuItem {...item} />
                                )) }
                            </CollapseItem>
                        ) : (
                            <div class="wp-menu-item-title" onClick={() => clickMethod?.(props)}>
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