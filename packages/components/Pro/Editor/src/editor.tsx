import { useVModel } from "@vueuse/core"
import { buildProps } from "@wisdom-plus/utils/props"
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from "vue"
import E from 'wangeditor'

export const proEditorProps = buildProps({
    modelValue: String,
    height: {
        type: Number,
        default: 300
    },
    excludeMenus: Array as PropType<string[]>,
    api: {
        type: Function as PropType<(file: File | Blob) => Promise<any>>
    }
})

export default defineComponent ({
    name: 'WpProEditor',
    props: proEditorProps,
    emits: {
        'update:modelValue': (value: string) => typeof value === 'string',
        'mounted': () => true
    },
    setup(props, { emit }) {
        const text = useVModel(props, 'modelValue', emit, {
            passive: true,
            deep: true
        })

        const editorId = `w-e-${Math.random().toString().slice(-5)}`
        let editor: InstanceType<typeof E> | null = null

        const changing = ref(false)

        onMounted(() => {
            editor = new E('#' + editorId)
            editor.config.height = props.height
            editor.config.onchange = (html: string) => {
                changing.value = true
                emit('update:modelValue', html)
            }
            if (props.excludeMenus) editor.config.excludeMenus = props.excludeMenus
            if (props.api) {
                const upload = async(resultFiles: File[], insertImgFn: (url: string) => void) => {
                    for (const file of resultFiles) {
                        const res = await props.api?.(file)
                        if (res.data.url) insertImgFn(res.data.url)
                    }
                }
                editor.config.customUploadImg = upload
                editor.config.customUploadVideo = upload
            }
            editor.config.menuTooltipPosition = 'down'
            editor.create()
            editor.txt.html(props.modelValue)
            emit('mounted')
        })

        watch(text, () => {
            if (changing.value) {
                changing.value = false
                return
            }
            if (editor) {
                editor.txt.html(props.modelValue)
            }
        })

        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            if (editor == null) return
            editor.destroy()
            editor = null
        })

        return {
            editorId
        }
    },
    render() {
        return (
            <div id={this.editorId} style={{ minHeight: (this.height || 0 + 42) + `px` }} class="wp-pro-editor" />
        )
    }
})
