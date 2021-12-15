import { ref, computed, defineComponent, ExtractPropTypes, PropType, provide, watch } from "vue"
import { buildProps } from '@wisdom-plus/utils/props'

import { useVModel } from "@vueuse/core"

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
    },
    collapse: {
        type: Boolean,
        default: false
    },
    trigger: {
        type: String as PropType<'hover' | 'click'>,
        default: 'hover'
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
        const activeRef = ref<string | null>(null)
        const active = typeof props.modelValue === 'undefined' ? activeRef : useVModel(props, 'modelValue', emit)
        provide('active', active)
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
        provide('unfold', unfoldItems)
        let collapseRecord: string[] = []
        provide('collapse', computed(() => props.collapse))
        watch(() => props.collapse, () => {
            if (props.collapse) {
                collapseRecord = unfoldItems.value
                unfoldItems.value = []
            } else {
                if (collapseRecord.length === 0) return
                unfoldItems.value = collapseRecord
                collapseRecord = []
            }
        }, {
            immediate: true
        })
        provide('trigger', computed(() => props.trigger))
        provide('vertical', computed(() => props.vertical))
        return () => {
            slotsRef.value = slots
            return (
                <div class={{
                    "wp-menu": true,
                    "wp-menu__collapse" : props.collapse,
                    "wp-menu__row": !props.vertical
                }}>
                    {
                        props.vertical ? (
                            <Collapse v-model={unfoldItems.value}>
                                {
                                    props.list.map(item => <MenuItem {...item} />)
                                }
                            </Collapse>
                        ) : props.list.map(item => <MenuItem {...item} />)
                    }
                </div>
            )
        }
    }
})