import { ref, computed, defineComponent, ExtractPropTypes, PropType, provide } from "vue"
import { buildProps } from '@wisdom-plus/utils/props'

import { MenuList, MenuRecord } from './typings'

export const menuProps = buildProps({
    vertical: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String
    },
    list: {
        type: Array as PropType<MenuList>,
        default: () => []
    },
    unfold: {
        type: Array as PropType<string[]>
    }
})
export type MenuProps = ExtractPropTypes<typeof menuProps>

const menuEmits = {
    'update:modelValue': (value: string) => typeof value === 'string',
    'update:unfold': (value: string[]) => Array.isArray(value),
    'click': (value: MenuRecord) => typeof value === 'object'
}

import MenuItem from './menuItem'
import Collapse from '../../Collapse'

export default defineComponent({
    props: menuProps,
    emits: menuEmits,
    setup(props, { emit, slots }) {
        provide('click', (record: MenuRecord) => {
            emit('click', record)
        })
        const slotsRef = ref(slots)
        provide('slots', slotsRef)
        const items = ref<string[]>([])
        const unfoldItems = computed<string[]>({
            get() {
                if (typeof props.unfold !== 'undefined') {
                    return props.unfold
                } else {
                    return items.value
                }
            },
            set(value) {
                if (typeof props.unfold !== 'undefined') {
                    emit('update:unfold', value)
                } else {
                    items.value = value
                }
            }
        })
        return () => {
            slotsRef.value = slots
            return (
                <div class="wp-menu">
                    <Collapse v-model={unfoldItems.value}>
                        {
                            props.list.map(item => <MenuItem {...item} />)
                        }
                    </Collapse>
                </div>
            )
        }
    }
})