import {computed, defineComponent, ExtractPropTypes, h, PropType, ref, Transition} from 'vue'
import {buildProps} from '@wisdom-plus/utils/props'
import {useScrollParent} from "@wisdom-plus/utils/use-scroll-parent";
import WpIcon from "@wisdom-plus/components/Icon";
import BackTopIcon from "./BackTopIcon";
import {useScroll} from "@vueuse/core";
import {addUnit} from "../../Spin";

export const backTopProps = buildProps({
    right: {
        type: [Number, String] as PropType<string | number>,
        default: 40
    },
    bottom: {
        type: [Number, String] as PropType<string | number>,
        default: 40
    },
    visibilityHeight: {
        type: Number,
        default: 180
    },
    listenTo: {
        type: Object as PropType<HTMLElement | Document>,
    },
})

export type BackTopProps = ExtractPropTypes<typeof backTopProps>

export default defineComponent({
    name: 'WpBackTop',
    components: {WpIcon},
    inheritAttrs: false,
    props: backTopProps,
    setup(props, { expose }) {
        const backTopRef = ref<HTMLDivElement>()
        const el = useScrollParent(backTopRef)
        const targetRef = computed(() => {
            const element = props.listenTo || el.value
            if (element === document.body) return window
            return element
        })
        const {y} = useScroll(targetRef)

        const handleClick = (evt: MouseEvent) => {
            if (!targetRef.value) return
            const element = targetRef.value as HTMLElement
            element.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }

        expose({
            scrollToTop: handleClick,
            y
        })
        return {
            backTopRef,
            handleClick,
            y
        }
    },
    render() {

        return (
            <div
                ref="backTopRef"
                class={'wp-back-view'}
                style={{'padding-right': addUnit(this.right)}}
                onClick={this.handleClick}
            >

                <Transition name="wp-back-top-fade">
                    <div class={[`wp-back-top`]} style={{'bottom': addUnit(this.bottom)}}
                         v-show={this.y >= this.visibilityHeight}>
                        {
                            this.$slots.default?.() ??
                            (
                                <wp-icon>{h(BackTopIcon)}</wp-icon>
                            )
                        }
                    </div>
                </Transition>
            </div>
        )
    }
})
