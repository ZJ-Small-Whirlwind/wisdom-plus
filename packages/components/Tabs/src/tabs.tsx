import { useResizeObserver } from "@vueuse/core"
import { flatten } from "@wisdom-plus/utils/flatten"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { ref, defineComponent, ExtractPropTypes, VNode, PropType, computed, watch, nextTick, onUpdated, onMounted, Transition, CSSProperties, onActivated } from "vue"

import Space, { SpaceProps } from '../../Space'
import XScroll, { XScrollProps } from '../../XScroll'
import Icon from '../../Icon'
import { CloseOutlined } from '@vicons/antd'
import { addUnit } from "@wisdom-plus/utils/util"

export const tabsProps = buildProps({
    modelValue: {
        type: [String, Symbol, Number, Boolean] as PropType<string | symbol | number | boolean>,
        default: undefined
    },
    duration: {
        type: Number,
        default: 300
    },
    spaceProps: {
        type: Object as PropType<SpaceProps & Record<any, any>>
    },
    xScrollProps: {
        type: Object as PropType<XScrollProps & Record<any, any>>
    },
    showLine: {
        type: Boolean,
        default: true
    },
    titleOnly: Boolean,
    closable: Boolean,
    lazy: Boolean,
    card: Boolean,
    lineWidth: {
        type: [String, Number]
    },
    swipeAnimation: {
        type: Boolean,
        default: true
    }
})

export type TabsProps = ExtractPropTypes<typeof tabsProps>

export default defineComponent({
    name: 'WpTabs',
    props: tabsProps,
    emits: {
        'update:modelValue': (value: string | symbol | number | boolean) => (void value, true),
        'close': (index: string | symbol | number | boolean) => (void index, true)
    },
    setup(props, { emit }) {
        const activeRef = ref<string | symbol | number | boolean>()
        const active = useAutoControl(activeRef, props, 'modelValue', emit)

        const activeIndex = ref(0)
        const transform = computed(() => {
            return `-${activeIndex.value * 100}%`
        })
        const init = ref(false)

        const scrollRef = ref<InstanceType<typeof XScroll> | null>(null)
        const activeTabTitle = ref<null | HTMLDivElement>(null)
        const tabsRef = ref<null | HTMLDivElement>(null)

        const left = ref(0)
        const width = ref('0px')
        const getLeft = async() => {
            setTimeout(() => {
                init.value = true
            })
            if (!activeTabTitle.value || !props.showLine || props.card) return
            await nextTick()
            if (!activeTabTitle.value) return
            const leftValue = activeTabTitle.value.offsetLeft + activeTabTitle.value.offsetWidth / 2
            const widthValue = activeTabTitle.value.offsetWidth
            if (leftValue && widthValue) {
                left.value = leftValue
                width.value = widthValue + 'px'
            }
        }

        const widthComputed = computed(() => {
            return props.lineWidth ? addUnit(props.lineWidth) : width.value
        })

        watch(() => props.lineWidth, getLeft)
        watch(activeIndex, () => {
            getLeft()
            nextTick(() => {
                if (!scrollRef.value || !activeTabTitle.value) return
                const boundingRect = activeTabTitle.value.getBoundingClientRect()
                const deltaX = boundingRect.x - scrollRef.value.$el.offsetLeft
                if (
                    deltaX < 0 ||
                    scrollRef.value.$el.offsetWidth - deltaX < boundingRect.width
                ) {
                    scrollRef.value?.scrollTo({
                        left: activeTabTitle.value.offsetLeft - scrollRef.value.$el.offsetWidth / 2 + boundingRect.width / 2,
                        behavior: 'smooth'
                    })
                }
            })
        })
        onUpdated(getLeft)
        onMounted(getLeft)
        onActivated(() => {
            init.value = false
            setTimeout(() => {
                init.value = true
            })
        })

        useResizeObserver(activeTabTitle, getLeft)

        const spaceSize = computed<[string | number, string | number]>(() => {
            if (!props.spaceProps || !props.spaceProps.size) return [props.card ? 0 : 20, 0]
            if (!Array.isArray(props.spaceProps.size)) return [props.spaceProps.size, 0]
            return [props.spaceProps.size[0], 0]
        })

        const propsHandle = (props?: Record<any, any> | null) => {
            if (!props) return {}
            const propsMap = {...props}
            delete propsMap.index
            delete propsMap.closable
            delete propsMap.title
            return propsMap
        }

        return {
            left,
            active,
            activeIndex,
            transform,
            activeTabTitle,
            tabsRef,
            width,
            spaceSize,
            scrollRef,
            widthComputed,
            propsHandle,
            init,
            update: getLeft
        }
    },
    expose: ['update'],
    render() {
        const tabs = flatten(this.$slots.default?.() || []).filter(tab => (tab.type as { name?: string }).name === 'WpTab')
        const activeIndex = tabs.findIndex((tab, index) => (tab.props?.key || index) === this.active)
        this.activeIndex = this.titleOnly ? activeIndex : (activeIndex > -1 ? activeIndex : 0)
        return (
            <div class={
                ['wp-tabs', {
                    'wp-tabs--card': this.card
                }]
            } ref="tabsRef" style={{
                '--wp-tabs-durtation': `${this.duration / 1000}s`
            } as CSSProperties}>
                <div class="wp-tabs--title">
                    <XScroll ref="scrollRef" {...this.xScrollProps}>
                        <Space {...this.spaceProps} wrap={false} size={this.spaceSize} v-slots={{
                            suffix: this.showLine && !this.card ? () => (
                                <div class="wp-tabs--line" style={{ left: this.left + 'px', width: this.widthComputed, transition: this.init ? undefined : 'none' }} />
                            ) : undefined
                        }}>
                            { this.$slots?.prefix?.() }
                            {
                                tabs.map((tab, index) => (
                                    <div
                                        class={[
                                            'wp-tabs--title--cell',
                                            {
                                                'wp-tabs--title--cell--active': index === this.activeIndex
                                            }
                                        ]}
                                        key={tab.props?.key || index}
                                        onClick={() => {
                                            this.active = tab.props?.key || index
                                        }}
                                        onMousedown={e => {
                                            if (typeof tab.props?.closable === 'boolean' ? tab.props?.closable : this.closable) {
                                                if (e.button === 1) {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    this.$emit('close', tab.props?.key || index)
                                                }
                                            }
                                        }}
                                        {...this.propsHandle(tab.props)}
                                        ref={index === this.activeIndex ? 'activeTabTitle' : undefined}
                                    >
                                        {(tab.children as Record<string, ({ active: boolean }) => VNode>)?.title?.({ active: index === this.activeIndex }) ?? tab.props?.title }
                                        {(typeof tab.props?.closable === 'boolean' ? tab.props?.closable : this.closable) && (
                                            this.$slots.close?.() ?? (
                                                <Icon class="wp-tabs--title--cell--close" onClick={e => {
                                                    e.stopPropagation()
                                                    this.$emit('close', tab.props?.key || index)
                                                }}>
                                                    <CloseOutlined />
                                                </Icon>
                                            )
                                        ) }
                                    </div>
                                ))
                            }
                            { this.$slots?.suffix?.()}
                        </Space>
                    </XScroll>
                </div>
                {
                    !this.titleOnly && (
                        <div class="wp-tabs--content" style={{
                            transform: `translateX(${this.transform})`,
                            transition: this.init && this.swipeAnimation ? undefined : 'none'
                        }}>
                            {
                                tabs.map((tab, index) => (
                                    <div class="wp-tabs--tab" key={tab.props?.key || index}>
                                        {
                                            this.lazy ? (
                                                <Transition name={this.swipeAnimation ? 'wp-tabs-fade' : undefined}>
                                                    { index === this.activeIndex ? (
                                                        <div class="wp-tabs--tab--content">
                                                            {(tab.children as Record<string, () => VNode>)?.default?.() }
                                                        </div>
                                                    ) : null }
                                                </Transition>
                                            ): (
                                                    <Transition name={this.swipeAnimation ? 'wp-tabs-fade' : undefined}>
                                                    <div class="wp-tabs--tab--content" v-show={index === this.activeIndex}>
                                                        {(tab.children as Record<string, () => VNode>)?.default?.() }
                                                    </div>
                                                </Transition>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        )
    }
})