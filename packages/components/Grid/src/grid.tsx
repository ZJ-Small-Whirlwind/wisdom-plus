import { computed, defineComponent, PropType, provide, toRef } from 'vue'

import { buildProps } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes } from 'vue'

export const gridProps = buildProps({
    gap: {
        type: [Number, Array] as PropType<number | string | [number | string, number | string]>,
        default: 0
    },
    cols: {
        type: Number,
        default: 24
    },
    defaultSpan: {
        type: Number,
        default: 1
    },
    placeItems: String,
    placeContent: String,
    dense: Boolean
})

export type GridProps = ExtractPropTypes<typeof gridProps>

export default defineComponent({
    name: 'WpGrid',
    props: gridProps,
    setup(props, { slots }) {
        /**
         * 计算 gap，默认单位 px
         */
        const gapMap = computed<[string, string]>(() => {
            if (typeof props.gap === 'number') {
                return [`${props.gap}px`, `${props.gap}px`]
            } else if (typeof props.gap === 'string') {
                return [props.gap, props.gap]
            } else {
                return props.gap.map(gap => {
                    gap = typeof gap === 'number' ? `${gap}px` : gap
                    return gap
                }) as [string, string]
            }
        })
        /**
         * provide 给子 gridItem defaultSpan
         */
        provide('defaultSpan', toRef(props, 'defaultSpan'))
        return () => (
            <div class="wp-grid" style={{
                gridGap: `${gapMap.value[1]} ${gapMap.value[0]}`,
                gridTemplateColumns: `repeat(${props.cols}, minmax(0px, 1fr))`,
                placeItems: props.placeItems,
                placeContent: props.placeContent,
                gridAutoFlow: props.dense ? 'row dense' : ''
            }}>
                { slots.default?.() }
            </div>
        )
    }
})