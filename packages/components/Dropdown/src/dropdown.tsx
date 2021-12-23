import { ref, computed, defineComponent, ExtractPropTypes, PropType, provide, toRefs } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import Popover, { PopoverProps, PopoverPlacement } from '../../Popover'

import type { DropdownRecord } from './typings'
import DropdownItem from './dropdownItem'

export const dropdownProps = buildProps({
    modelValue: {
        type: Boolean,
        default: undefined
    },
    popover: {
        type: Object as PropType<Partial<PopoverProps> & Record<string, any>>,
        default: () => ({})
    },
    list: {
        type: Array as PropType<DropdownRecord[]>,
        default: () => []
    },
    subMenuPlacement: {
        type: String as PropType<PopoverPlacement>,
        default: 'right'
    },
    showArrow: {
        type: Boolean,
        default: true
    }
})

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>

export default defineComponent({
    name: 'WpDropdown',
    inheritAttrs: false,
    props: dropdownProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean',
        'click': null
    },
    setup(props, { slots, emit, attrs }) {
        const showRef = ref(false)
        const show = computed<boolean>({
            get() {
                return typeof props.modelValue === 'undefined' ? showRef.value : props.modelValue
            },
            set(value) {
                if (typeof props.modelValue === 'undefined') {
                    showRef.value = value
                } else {
                    emit('update:modelValue', value)
                }
            }
        })
        provide('wp-dropdown-sub-menu-placement', computed(() => props.subMenuPlacement))
        provide('wp-popover-props', computed(() => props.popover))
        provide('wp-popover-close', () => {
            show.value = false
        })
        provide('wp-dropdown-click', (record?: DropdownRecord) => {
            emit('click', record)
        })
        provide('wp-dropdown-parent-slot', slots)
        provide('wp-dropdown-show-arrow', computed(() => props.showArrow))
        return () => (
            <Popover
                arrow={false}
                placement="bottom"
                trigger="hover"
                { ...props.popover }
                popoverClass="wp-dropdown-popover"
                v-model={show.value}
                v-slots={{
                    reference: () => (
                        slots.default?.()
                    ),
                    default: () => (
                        <div class="wp-dropdown" { ...attrs }>
                            {
                                props.list.map(item => (
                                    <DropdownItem { ...item } v-slots={{
                                        title: () => slots.title?.(item) || item.title
                                    }} />
                                ))
                            }
                        </div>
                    )
                }}
            />
        )
    }
})