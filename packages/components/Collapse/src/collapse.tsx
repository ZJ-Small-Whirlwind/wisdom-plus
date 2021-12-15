import { defineComponent, PropType, provide, computed, ref } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes } from 'vue'

export type CollapseSupport = string | number | symbol
export const collapseProps = buildProps({
    modelValue: {
        type: [String, Number, Symbol, Array] as PropType<CollapseSupport | CollapseSupport[]>,
        default: undefined
    }
})

export const collapseEmits = {
    'update:modelValue': (value: CollapseSupport | CollapseSupport[]) => {
        const type = typeof value
        return ['string', 'number', 'symbol'].includes(type) || Array.isArray(value)
    },
    change: (value?: CollapseSupport | CollapseSupport[]) => {
        if (typeof value === 'undefined') return true
        const type = typeof value
        return ['string', 'number', 'symbol'].includes(type) || Array.isArray(value)
    }
}

export type CollapseProps = ExtractPropTypes<typeof collapseProps>
export type CollapseEmits = typeof collapseEmits

export default defineComponent({
    name: 'Collapse',
    props: collapseProps,
    emits: collapseEmits,
    setup(props, { slots, emit }) {
        /**
         * 非受控模式，使用 ref 管理 collapseItems
         */
        const collapseItems = ref<CollapseSupport[]>([])
        provide('collapseItems', computed(() => typeof props.modelValue !== 'undefined' ? props.modelValue : collapseItems.value))
        provide('update:collapseItems', (value: CollapseSupport | CollapseSupport[]) => {
            if (collapseItems.value !== value) emit('change', value)
            if (typeof props.modelValue === 'undefined' && Array.isArray(value)) {
                collapseItems.value = value
            } else {
                emit('update:modelValue', value)
            }
        })
        return () => (
            <div class="wp-collapse">
                { slots.default?.() }
            </div>
        )
    }
})