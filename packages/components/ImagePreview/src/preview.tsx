import { ref, createApp, App, defineComponent, onMounted } from 'vue'

import ImagePreview, { ImagePreviewProps, PreviewImage } from './imagePreview'

const openPreview = function Preview(list?: PreviewImage[] | string[], flag?: number | string | PreviewImage, props?: Partial<ImagePreviewProps> & Record<string, any>) {
    const newDiv = document.createElement('div')
    document.body.appendChild(newDiv)
    const app = createApp(defineComponent({
        setup() {
            const ImagePreviewRef = ref<InstanceType<typeof ImagePreview>>()
            const index = ref(0)
            if (typeof flag !== 'number') {
                index.value = list ? list.findIndex((item: PreviewImage | string) => {
                    if (typeof item === 'string') {
                        return item === flag
                    } else {
                        return item === flag || item.src === flag
                    }
                }) : 0
                if (index.value === -1) {
                    index.value = 0
                }
            } else {
                index.value = flag
            }

            onMounted(() => {
                ImagePreviewRef.value?.open(index.value)
            })

            return () => (
                <ImagePreview
                    list={list}
                    ref={ImagePreviewRef}
                    {...props}
                />
            )
        }
    }))
    app.mount(newDiv)
}

openPreview.install = (app: App<Element>) => {
    app.config.globalProperties.$preview = openPreview
}

export const Preview = openPreview