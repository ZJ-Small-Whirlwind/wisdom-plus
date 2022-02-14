import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { computed, defineComponent, ExtractPropTypes, PropType, ref, watch } from "vue"

import { WpOverlay, OverlayProps } from '../../Overlay'
import { WpIcon } from '../../Icon'
import { CloseCircleOutlined, RightCircleOutlined, LeftCircleOutlined, RedoOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined } from '@vicons/antd'

export interface PreviewImage {
    src: string,
    thumb?: string
}

export const imagePreviewProps = buildProps({
    modelValue: {
        type: Boolean,
        default: undefined
    },
    index: Number,
    list: {
        type: Array as PropType<string[] | PreviewImage[]>,
        default: () => []
    },
    overlayProps: {
        type: Object as PropType<Partial<OverlayProps> & Record<string, any>>
    }
})

export type ImagePreviewProps = ExtractPropTypes<typeof imagePreviewProps>

const Icon = WpIcon as any

export default defineComponent({
    name: 'WpImagePreview',
    props: imagePreviewProps,
    emits: {
        'update:modelValue': (value: boolean) => typeof value === 'boolean',
        'update:index': (index: number) => typeof index === 'number'
    },
    setup(props, { emit }) {
        const showRef = ref(false)
        const show = useAutoControl(showRef, props, 'modelValue', emit)
        const indexRef = ref(0)
        const indexIs = useAutoControl(indexRef, props, 'index', emit)

        const currentImage = computed(() => {
            const image = props.list[indexRef.value]
            return typeof image === 'string' ? {
                src: image
            } as PreviewImage : image
        })

        const gotoIndex = (index: number) => {
            if (index >= props.list.length) {
                indexIs.value = 0
                return
            }
            if (index < 0) {
                indexIs.value = props.list.length - 1
                return
            }
            indexIs.value = index
        }

        const transform = ref({
            rotate: 0,
            scale: 1
        })

        watch(indexIs, () => {
            transform.value = {
                rotate: 0,
                scale: 1
            }
        })

        const open = (index: number) => {
            indexIs.value = index
            show.value = true
        }
        return {
            show,
            indexIs,
            currentImage,
            transform,
            gotoIndex,
            open
        }
    },
    expose: ['open'],
    render() {
        return (
            <WpOverlay class="wp-image-preview" v-model={this.show} {...this.overlayProps}>
                <div class="wp-image-preview__wrapper" onClick={e => e.stopPropagation()}>
                    <div class="wp-image-preview__img" style={{
                        transform: `scale(${this.transform.scale}) rotate(${this.transform.rotate}deg)`
                    }}>
                        {
                            this.currentImage && (
                                <img src={this.currentImage.src} />
                            )
                        }
                    </div>
                    <div class="wp-image-preview__close" onClick={() => {
                        this.show = false
                    }}>
                        <WpIcon>
                            <CloseCircleOutlined />
                        </WpIcon>
                    </div>
                    {
                        this.list.length > 1 && (
                            <>
                                <div class="wp-image-preview__next" onClick={() => this.gotoIndex((this.indexIs || 0) + 1)}>
                                    <WpIcon>
                                        <RightCircleOutlined />
                                    </WpIcon>
                                </div>
                                <div class="wp-image-preview__prev" onClick={() => this.gotoIndex((this.indexIs || 0) - 1)}>
                                    <WpIcon>
                                        <LeftCircleOutlined />
                                    </WpIcon>
                                </div>
                            </>
                        )
                    }
                    <div class="wp-image-preview__bar">
                        <div class="wp-image-preview__tools">
                            <Icon onClick={() => this.transform.scale += .2}><ZoomInOutlined /></Icon>
                            <Icon onClick={() => this.transform.scale -= .2}><ZoomOutOutlined /></Icon>
                            <Icon onClick={() => this.transform.rotate += 90}><RedoOutlined /></Icon>
                            <Icon onClick={() => this.transform.rotate -= 90}><UndoOutlined /></Icon>
                        </div>
                    </div>
                </div>
            </WpOverlay>
        )
    }
})