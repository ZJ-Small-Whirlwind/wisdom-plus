import { defineComponent, ExtractPropTypes, PropType, VNode, h } from 'vue'

import Space, { SpaceProps } from '../../Space'

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
    },
    spaceProps: {
        type: Object as PropType<Partial<SpaceProps> & Record<string, any>>,
        default: () => ({})
    },
    component: Object as PropType<typeof RouterLink>
})

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>

export default defineComponent({
    name: 'WpBreadcrumb',
    props: breadcrumbProps,
    emits: {
        click: (item: BreadcrumbList) => {
            void item
            return true
        }
    },
    setup(props, { slots, emit }) {
        return () => (
            <Space class="wp-breadcrumb" align="center" { ...props.spaceProps }>
                {
                    props.list.map((item, index) => (
                        <>
                            <div class="wp-breadcrumb-item" onClick={() => {
                                emit('click', item)
                            }}>
                                {
                                    slots.item?.(item) || (
                                        item.to ? (
                                            props.component && (
                                                h(props.component, {
                                                    to: item.to,
                                                    replace: item.replace
                                                }, {
                                                    default: () => item.title
                                                })
                                            )
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