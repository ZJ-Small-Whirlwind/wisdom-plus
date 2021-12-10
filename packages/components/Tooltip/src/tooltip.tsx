import { defineComponent } from 'vue'
import Popover, { popoverProps } from '../../Popover'

import { buildProps } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes } from 'vue'

const tooltipPropsOverride = buildProps({
    trigger: {
        type: String,
        default: 'hover'
    },
    dark: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: ''
    }
})

export const tooltipProps = {
    ...popoverProps,
    ...tooltipPropsOverride
}

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>

export default defineComponent({
    name: 'Tooltip',
    props: tooltipProps,
    setup(props, { slots }) {
        return () => (
            <Popover {...props} v-slots={{
                default: () => slots.title?.() || props.title,
                reference: () => slots.default?.()
            }} />
        )
    }
})