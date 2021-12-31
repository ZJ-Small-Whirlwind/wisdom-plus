import { defineComponent, ExtractPropTypes, PropType, VNode } from 'vue'

import Space from '../../Space'

import { buildProps } from '@wisdom-plus/utils/props'
import { RouteLocationRaw, RouterLink } from 'vue-router'

export interface BreadcrumbList {
    index?: string | number | symbol,
    title?: string | VNode
    to?: RouteLocationRaw,
    replace?: boolean
}

export const breadcrumbProps = buildProps({
    list: {
        type: Array as PropType<BreadcrumbList[]>,
        default: () => []
    },
    separator: {
        type: [String, Object] as PropType<string | VNode>,
        default: '/'
    }
})

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>

export default defineComponent({
    name: 'WpBreadcrumb',
    props: breadcrumbProps,
    setup(props, { slots }) {
        return () => (
            <Space class="wp-breadcrumb" align="center">
                {
                    props.list.map((item, index) => (
                        <>
                            <div class="wp-breadcrumb-item">
                                {
                                    slots.item?.(item) || (
                                        item.to ? (
                                            <RouterLink to={item.to} replace={item.replace}>
                                                { item.title }
                                            </RouterLink>
                                        ) : item.title
                                    )
                                }
                            </div>
                            {
                                index !== props.list.length - 1 ? (
                                    <div class="wp-breadcrumb-separator">
                                        {slots.separator?.() || props.separator }
                                    </div>
                                ) : null
                            }
                        </>
                    ))
                }
            </Space>
        )
    }
})