import { buildProps } from "@wisdom-plus/utils/props"
import { defineComponent, ExtractPropTypes, PropType, computed } from "vue"
import type { RouteLocationNormalizedLoaded } from "vue-router"

export const proPermissionProps = buildProps({
    useRoute: {
        type: Function as PropType<() => RouteLocationNormalizedLoaded>
    },
    has: {
        type: [String, Array] as PropType<string | string[]>
    },
    hasAll: {
        type: [String, Array] as PropType<string | string[]>
    }
})

export type ProPermissionProps = ExtractPropTypes<typeof proPermissionProps>

import { usePermission } from './usePermission'

export default defineComponent({
    name: 'WpProPermission',
    props: proPermissionProps,
    setup(props) {
        const { has, hasAll } = usePermission(props.useRoute)
        const hasComputed = computed(() => {
            if (!props.has) return true
            return has(props.has)
        })
        const hasAllComputed = computed(() => {
            if (!props.hasAll) return true
            return hasAll(props.hasAll)
        })
        return {
            hasComputed,
            hasAllComputed
        }
    },
    render() {
        return (this.hasComputed && this.hasAllComputed) ? this.$slots.default?.() : undefined
    }
})