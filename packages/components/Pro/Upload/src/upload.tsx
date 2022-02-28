import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue"

export interface FileItem {
    id: number,
    creator_id: string
    creator_name: string,
    name?: string,
    origin_name?: string,
    size: number
    suffix: string
    url: string
}

import Upload, { type UploadFile, uploadProps, UploadProps } from '../../../Upload'
import { Dialog } from "../../../Modal"

export const proUploadPropsRaw = buildProps({
    modelValue: {
        type: Array as PropType<(FileItem & UploadFile)[]>
    },
    multiple: {
        ...uploadProps.multiple,
        default: true
    },
    autoUpload: {
        ...uploadProps.autoUpload,
        default: true
    },
    extra: {
        type: Object as PropType<Record<string, any>>
    },
    api: {
        type: Object as PropType<{
            upload?: (file: File | Blob, extra?: Record<string, any>, onProgress?: (progress: number) => void) => Promise<any>,
            delete?: (file: FileItem & UploadFile) => Promise<any>
        }>
    }
})

export const proUploadProps = { ...uploadProps, ...proUploadPropsRaw }

export type ProUploadProps = ExtractPropTypes<typeof proUploadProps>

export default defineComponent({
    name: 'WpProUpload',
    props: proUploadProps,
    emits: {
        'update:modelValue': (value: (FileItem & UploadFile)[]) => {
            void value
            return true
        }
    },
    setup(props, { emit }) {
        const propsMap = computed(() => {
            const propsTemp: Partial<ProUploadProps> = { ...props }
            delete propsTemp.extra
            delete propsTemp.api
            return propsTemp as UploadProps
        })

        const handleUpload = async(files: UploadFile[]) => {
            files.forEach(async(file) => {
                if (!file.file) return
                try {
                    const res = await props.api?.upload?.(file.file, props.extra, progress => {
                        file.progress = progress
                    })
                    Object.assign(file, res.data)
                    file.status = 0
                } catch {
                    file.status = 3
                }
            })
        }

        const handleDelete = async(file: UploadFile, initiative?: boolean) => {
            if (initiative) {
                await Dialog({
                    content: '确定要删除这个文件吗？',
                    confirmProps: {
                        type: 'danger',
                        size: 'small'
                    },
                    cancelProps: {
                        size: 'small'
                    }
                })
            }
            await props.api?.delete?.(file as FileItem & UploadFile)
        }

        const items = ref<(FileItem & UploadFile)[]>([])
        const fileItems = useAutoControl(items, props, 'modelValue', emit, {
            passive: true,
            deep: true
        })
        return {
            propsMap,
            fileItems,
            handleUpload,
            handleDelete
        }
    },
    render() {
        return (
            <Upload
                class="wp-pro-upload"
                {...this.propsMap}
                v-model={this.fileItems}
                upload={this.handleUpload}
                delete={this.handleDelete}
                v-slots={this.$slots}
            />
        )
    }
})