import { useIntersectionObserver } from "@vueuse/core"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue"
import VirtualList, { VirtualListProps } from '../../VirtualList'
import ListTip from './listTip'

export const listProps = buildProps({
    virtual: Boolean,
    loading: {
        type: Boolean,
        default: undefined
    },
    finished: Boolean,
    error: {
        type: Boolean,
        default: undefined
    },
    loadingText: {
        type: String,
        default: '加载中'
    },
    finishedText: {
        type: String,
        default: '没有更多了'
    },
    errorText: {
        type: String,
        default: '加载失败'
    },
    rootMargin: String,
    threshold: Number,
    load: {
        type: Function as PropType<() => Promise<void>>
    },
    direction: {
        type: String as PropType<'up' | 'down'>,
        default: 'down'
    },
    items: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => []
    },
    itemSize: {
        type: Number,
        default: 10
    },
    virtualListProps: {
        type: Object as PropType<Partial<VirtualListProps> & Record<string, any>>
    }
})

export type ListProps = ExtractPropTypes<typeof listProps>

export default defineComponent({
    name: 'WpList',
    props: listProps,
    emits: {
        'update:loading': (loading: boolean) => typeof loading === 'boolean',
        'update:error': (error: boolean) => typeof error === 'boolean'
    },
    setup(props, { emit }) {
        const loadingRef = ref(false)
        const loadingSync = useAutoControl(loadingRef, props, 'loading', emit)

        const errorRef = ref(false)
        const errorSync = useAutoControl(errorRef, props, 'error', emit)

        const tipRef = ref<HTMLDivElement | null>(null)
        const listRef = ref<HTMLDivElement | null>(null)

        const intersecting = ref(false)
        const doLoad = async() => {
            if (errorSync.value || loadingSync.value || props.finished) return
            loadingSync.value = true
            try {
                await props.load?.()
            } catch {
                errorSync.value = true
            } finally {
                loadingSync.value = false
                if (intersecting.value) {
                    doLoad()
                }
            }
        }

        if (!props.virtual) {
            useIntersectionObserver(tipRef, ([{ isIntersecting }]) => {
                if (isIntersecting) {
                    intersecting.value = true
                    doLoad()
                } else {
                    intersecting.value = false
                }
            }, {
                root: listRef,
                rootMargin: props.rootMargin,
                threshold: props.threshold
            })
        }

        const itemsMap = computed(() => {
            if (!props.virtual) return
            const items = [...props.items]
            if (props.direction === 'down') {
                items.push({
                    'wp__istip': true
                })
            } else {
                items.unshift({
                    'wp__istip': true
                })
            }
            return items
        })

        return {
            loadingSync,
            errorSync,
            tipRef,
            listRef,
            itemsMap,
            doLoad
        }
    },
    render() {
        const tip = (
            <div class="wp-list--tip" ref="tipRef">
                <ListTip
                    loading={this.loadingSync}
                    loadingText={this.loadingText}
                    error={this.errorSync}
                    errorText={this.errorText}
                    finished={this.finished}
                    finishedText={this.finishedText}
                    virtual={this.virtual}
                    onLoad={this.doLoad}
                    v-slots={this.$slots}
                />
            </div>
        )
        const insetWrapper = !this.virtual ? (
            <>
                { this.direction === 'up' && tip }
                { this.$slots.default?.() }
                { this.direction === 'down' && tip }
            </>
        ) : null
        return (
            this.virtual ? (
                <VirtualList
                    itemSize={this.itemSize}
                    class="wp-list"
                    itemResizable={true}
                    items={this.itemsMap}
                    {...this.virtualListProps}
                    v-slots={{
                        default: ({ item, index }) => (
                            item?.wp__istip ? tip : this.$slots.default?.({ item, index })
                        )
                    }}
                />
            ) : <div class="wp-list" ref="listRef">{insetWrapper}</div>
        )
    }
})