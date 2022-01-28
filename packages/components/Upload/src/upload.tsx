import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { ref, defineComponent, ExtractPropTypes, PropType, h } from "vue"
import Button from '../../Button'
import Space from '../../Space'
import Icon from '../../Icon'
import {
    DeleteOutlined,
    CheckCircleTwotone,
    UploadOutlined,
    Loading3QuartersOutlined,
    CloseSquareTwotone,
    CloudUploadOutlined
} from '@vicons/antd'

import svgs, { start } from './svgs'

export enum UploadFileStatus {
    Success,
    Waiting,
    Loading,
    Fail
}

export interface UploadFile {
    name: string,
    status?: UploadFileStatus,
    file?: File,
    pin?: Boolean,
    [x: string]: any
}

export const uploadProps = buildProps({
    modelValue: {
        type: Array as PropType<UploadFile[]>,
        default: undefined
    },
    multiple: Boolean,
    accept: String,
    drop: Boolean,
    delete: Function as PropType<(file: UploadFile) => Promise<void>>,
    upload: Function as PropType<(filterFiles: UploadFile[], file: UploadFile[]) => Promise<void>>,
    pin: Boolean,
    autoUpload: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 0
    },
    showFileList: {
        type: Boolean,
        default: true
    },
    disabled: Boolean
})

const WpIcon = Icon as any
const Icons = {
    [UploadFileStatus.Success]: CheckCircleTwotone,
    [UploadFileStatus.Waiting]: UploadOutlined,
    [UploadFileStatus.Loading]: Loading3QuartersOutlined,
    [UploadFileStatus.Fail]: CloseSquareTwotone
}

export type UploadProps = ExtractPropTypes<typeof uploadProps>

export default defineComponent({
    name: 'WpUpload',
    props: uploadProps,
    emits: {
        'update:modelValue': (value: UploadFile[]) => Array.isArray(value),
    },
    expose: ['submit', 'addUpload'],
    setup(props, { emit }) {
        const uploadFilesRef = ref<UploadFile[]>([])
        const uploadFiles = useAutoControl(uploadFilesRef, props, 'modelValue', emit, {
            passive: true,
            deep: true
        })
        const fileRef = ref<HTMLInputElement | null>(null)

        const startUpload = () => {
            if (props.disabled) return
            fileRef.value?.click()
        }

        const handleUpload = async() => {
            uploadFiles.value.forEach(file => {
                if (file.status === UploadFileStatus.Waiting) {
                    file.status = UploadFileStatus.Loading
                }
            })
            await props.upload?.(uploadFiles.value.filter(file => file.status === UploadFileStatus.Loading), uploadFiles.value)
        }

        const handleAddUpload = async(files: FileList | File[]) => {
            if (files.length === 0) return
            for (let i = 0; i < files.length; i++) {
                if (props.limit && files.length - i > props.limit) continue
                uploadFiles.value.push({
                    name: files[i].name,
                    file: files[i],
                    status: UploadFileStatus.Waiting
                })
            }
            if (props.limit) {
                while (uploadFiles.value.length > props.limit) {
                    const file = uploadFiles.value.shift()
                    await props.delete?.(file)
                }
            }
            if (props.autoUpload) {
                handleUpload()
            }
        }

        const handleChange = async(e: Event) => {
            try {
                if (props.disabled) return
                const files = (e.target as HTMLInputElement).files
                if (!files) return
                await handleAddUpload(files);
            } finally {
                (e.target as HTMLInputElement).value = ''
            }
        }

        const handleDelete = async (file: UploadFile, index: number) => {
            if (props.disabled) return
            await props.delete?.(file)
            uploadFiles.value.splice(index, 1)
        }

        const getStatusIcon = (status?: UploadFileStatus) => {
            if (status) {
                return Icons[status] || Icons[UploadFileStatus.Success]
            } else {
                return Icons[UploadFileStatus.Success]
            }
        }

        const dragover = ref(false)

        const handleDragleave = (e: DragEvent) => {
            if (props.disabled) return
            if (!props.drop) return
            e.preventDefault()
            dragover.value = false
        }

        const handleDragover = (e: DragEvent) => {
            if (props.disabled) return
            if (!props.drop) return
            e.preventDefault()
            dragover.value = true
        }

        const handleDrop = (e: DragEvent) => {
            if (props.disabled) return
            if (!props.drop) return
            e.preventDefault()
            const files = Array.from(e.dataTransfer?.files || []).filter((file) => {
                if (!props.accept) return true
                const { type, name } = file
                const extension =
                    name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : ''
                const baseType = type.replace(/\/.*$/, '')
                return props.accept
                    .split(',')
                    .map(type => type.trim())
                    .filter(type => type)
                    .some(acceptedType => {
                        if (acceptedType.startsWith('.')) {
                            return extension === acceptedType
                        }
                        if (/\/\*$/.test(acceptedType)) {
                            return baseType === acceptedType.replace(/\/\*$/, '')
                        }
                        if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                            return type === acceptedType
                        }
                        return false
                    })
            })
            dragover.value = false
            handleAddUpload(files)
        }

        const getFileTypeIcon = (filename: string) => {
            const execFilename = /\.(.+)?$/.exec(filename)
            if (!execFilename?.[1]) return `${start}${svgs.default}</svg>`
            return `${start}${svgs[execFilename[1].toLowerCase()] || svgs.default}</svg>`
        }

        return {
            fileRef,
            uploadFiles,
            dragover,
            startUpload,
            submit: handleUpload,
            addUpload: handleAddUpload,
            handleChange,
            handleDelete,
            handleDrop,
            handleDragleave,
            handleDragover,
            getStatusIcon,
            getFileTypeIcon
        }
    },
    render() {
        return (
            <div class={[
                'wp-upload',
                {
                    'wp-upload__disabled': this.disabled
                }
            ]}>
                <div
                    class={[
                        'wp-upload__button'
                    ]}
                    onDrop={this.handleDrop}
                    onDragover={this.handleDragover}
                    onDragleave={this.handleDragleave}
                >
                    {
                        this.$slots.default?.({ start: this.startUpload, dragover: this.dragover, disabled: this.disabled }) || (
                            this.drop ? (
                                <div class={[
                                    'wp-upload__drag-button',
                                    {
                                        'wp-upload__upload__drag-button__dragover': this.dragover
                                    }
                                 ]} onClick={this.startUpload}>
                                    <Icon class="wp-upload__drag-icon">
                                        <CloudUploadOutlined />
                                    </Icon>
                                    <span>拖拽文件到这里或者 <em>点击上传</em></span>
                                </div>
                            ) : (
                                <Button type="primary" onClick={this.startUpload} disabled={this.disabled}>点击上传</Button>
                            )
                        )
                    }
                    <input
                        ref="fileRef"
                        type="file"
                        class="wp-upload__file"
                        multiple={this.multiple}
                        accept={this.accept}
                        onChange={this.handleChange}
                    />
                </div>
                {
                    this.$slots.description?.()
                }
                {
                    this.showFileList ? (
                        <Space class="wp-upload__cells" vertical size={5}>
                            {
                                this.$slots.lists?.({ files: this.uploadFiles }) || (
                                    this.uploadFiles?.map((file, index) => (
                                        this.$slots.list?.({ file }) || (
                                            <div class="wp-upload__cell">
                                                <WpIcon class={`wp-upload__cell-icon`} v-html={this.getFileTypeIcon(file.file?.name || file.name)} />
                                                <div class="wp-upload__cell-name">
                                                    { file.name }
                                                </div>
                                                <Space class="wp-upload__cell-status" size={5}>
                                                    <WpIcon class={`wp-upload__cell-status-${file.status || 0}`}>
                                                        {
                                                            h(this.getStatusIcon(file.status))
                                                        }
                                                    </WpIcon>
                                                    {
                                                        !this.pin && !this.disabled ? (
                                                            <WpIcon class="wp-upload__cell-delete" onClick={() => this.handleDelete(file, index)}>
                                                                <DeleteOutlined />
                                                            </WpIcon>
                                                        ) : null
                                                    }
                                                </Space>
                                            </div>
                                        )
                                    ))
                                )
                            }
                        </Space>
                    ) : null
                }
            </div>
        )
    }
})