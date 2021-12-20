import { defineComponent, inject, PropType, ComputedRef, computed, watch } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes } from 'vue'
import type { CollapseSupport } from '../../Collapse'
export const collapseItemProps = buildProps({
    title: {
        type: String,
        default: ''
    },
    name: {
        type: [String, Number, Symbol] as PropType<CollapseSupport>,
        default: () => Symbol('name')
    },
    disabled: Boolean,
    showArrow: {
        type: Boolean,
        default: true,
    }
})

export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>

import Icon from '../../Icon'
import { DownOutlined } from '@vicons/antd'
import CollapseTransition from '../../CollapseTransition'

export default defineComponent({
    name: 'WpCollapseItem',
    props: collapseItemProps,
    emits: {
        change: (name: CollapseSupport) => {
            const type = typeof name
            return type === 'string' || type === 'symbol' || type === 'number'
        },
        clickTitle: (name: CollapseSupport) => {
            const type = typeof name
            return type === 'string' || type === 'symbol' || type === 'number'
        }
    },
    setup(props, { slots, emit }) {
        const collapseItems = inject<
      ComputedRef<CollapseSupport | CollapseSupport[]>
    >('collapseItems')
        const updateCollapseItems = inject<
      (value: CollapseSupport | CollapseSupport[]) => void
          >('update:collapseItems')
        const showItem = computed(() => {
            if (props.disabled) return false
            if (typeof props.name === 'undefined') return false
            if (Array.isArray(collapseItems?.value)) {
                return collapseItems?.value.includes(props.name)
            }
            return collapseItems?.value === props.name
        })
        watch(showItem, () => {
            emit('change', props.name)
        })
        return () => (
            <div
                class={{
                    'wp-collapse-item': true,
                    'wp-collapse-item--disabled': props.disabled,
                }}
            >
                <div
                    class="wp-collapse-item__title"
                    onClick={() => {
                        if (props.disabled) return
                        if (typeof props.name === 'undefined') return
                        if (typeof collapseItems?.value === 'undefined') {
                            console.warn('ObsessionUi: 请把 CollapseItem 放在 Collapse 内')
                            return
                        }
                        if (Array.isArray(collapseItems.value)) {
                            const index = collapseItems.value.indexOf(props.name)
                            const newCollapseItems = collapseItems
                                ? [...collapseItems.value]
                                : []
                            if (index === -1) {
                                newCollapseItems.push(props.name)
                            } else {
                                newCollapseItems.splice(index, 1)
                            }
                            updateCollapseItems?.(newCollapseItems)
                        } else {
                            /**
               * 手风琴模式
               */
                            updateCollapseItems?.(props.name)
                        }
                        emit('clickTitle', props.name)
                    }}
                >
                    <div class="wp-collapse-item__title-text">
                        {slots.title?.() || props.title}
                    </div>
                    {props.showArrow ? (
                        <Icon
                            class={{
                                'wp-collapse-item__title-icon': true,
                                active: showItem.value,
                            }}
                        >
                            <DownOutlined />
                        </Icon>
                    ) : null}
                </div>
                <CollapseTransition>
                    {showItem.value ? (
                        <div class="wp-collapse-item__content">{slots.default?.()}</div>
                    ) : null}
                </CollapseTransition>
            </div>
        )
    },
})