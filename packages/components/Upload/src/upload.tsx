import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { ref, defineComponent, ExtractPropTypes, PropType, watch } from "vue"
import { getChunk } from './chunk'

import UploadList from './uploadList'
import UploadCard from './uploadCard'

import {
    type UploadFile,
    UploadFileStatus
} from './interface'
import { useFormItem } from "@wisdom-plus/hooks"

export const uploadProps = buildProps({
    modelValue: {
        type: Array as PropType<UploadFile[]>,
        default: undefined
    },
    multiple: Boolean,
    accept: String,
    drop: Boolean,
    delete: {
        type: Function as PropType<(file: UploadFile, initiative?: boolean) => Promise<void>>
    },
    upload: {
        type: Function as PropType<(filterFiles: UploadFile[], file: UploadFile[]) => Promise<void>>
    },
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
    showButton: {
        type: Boolean,
        default: true
    },
    disabled: Boolean,
    preset: {
        type: String,
        default: 'list'
    },
    preview: {
        type: Boolean,
        default: true
    },
    chunk: Boolean,
    chunkSize: {
        type: Number,
        default: 2097152
    },
    chunkFileFilter: {
        type: Function as PropType<(file: UploadFile) => boolean>
    },
    cover: {
        type: Boolean,
        default: true
    },
    retry: {
        type: Boolean,
        default: true
    },
    showImage: {
        type: Boolean,
        default: true
    }
})

export type UploadProps = ExtractPropTypes<typeof uploadProps>

export default defineComponent({
    name: 'WpUpload',
    props: uploadProps,
    emits: {
        'update:modelValue': (value?: UploadFile[]) => !value || Array.isArray(value),
        itemClick: (e: Event, value: UploadFile) => {
            void e
            void value
            return true
        },
        handleIconClick: (file: UploadFile, index: number, status:number) => {
            void file
            void index
            void status
            return true
        }
    },
    expose: ['submit', 'addUpload', 'deleteAllFiles'],
    setup(props, { emit, attrs }) {
        const uploadFilesRef = ref<UploadFile[]>([])
        const uploadFiles = useAutoControl(uploadFilesRef, props, 'modelValue', emit, {
            passive: true,
            deep: true
        })
        const { formItem } = useFormItem({})
        const fileRef = ref<HTMLInputElement | null>(null)

        watch(uploadFiles, () => {
            formItem?.validate('change')
        })

        const startUpload = () => {
            if (props.disabled) return
            fileRef.value?.click()
        }
        
        const handleUpload = async() => {
            if (!uploadFiles.value) return
            const filesFilter = uploadFiles.value.filter(file => {
                if (file.status === UploadFileStatus.Waiting) {
                    file.status = UploadFileStatus.Loading
                    if (props.chunk && file.chunks) {
                        file.chunks.forEach(chunk => {
                            chunk.status = UploadFileStatus.Loading
                        })
                    }
                    return true
                }
                return false
            })
            if (filesFilter.length === 0) return
            await props.upload?.(filesFilter, uploadFiles.value)
        }

        const handleRetry = async (file: UploadFile) => {
            if (!props.retry) return
            file.status = UploadFileStatus.Loading
            await props.upload?.([file], uploadFiles.value || [])
        }

        const handleAddUpload = async(files: FileList | File[]) => {
            if (files.length === 0) return
            if (!uploadFiles.value) {
                uploadFiles.value = []
            }
            for (let i = 0; i < files.length; i++) {
                uploadFiles.value.push({
                    name: files[i].name,
                    file: files[i],
                    progress: 0,
                    status: UploadFileStatus.Waiting
                })
            }
            /**
             * limit
             */
            const deleteList: UploadFile[] = []
            if (props.limit && props.limit > 0) {
                while (uploadFiles.value.length > props.limit) {
                    const method = props.cover ? 'shift' : 'pop'
                    const file = uploadFiles.value[method]()
                    if (file && (!file?.status || file.status === UploadFileStatus.Loading)) {
                        deleteList.push(file)
                    }
                }
            }
            for (const file of deleteList) {
                await props.delete?.(file)
            }
            /**
             * chunk
             */
            if (props.chunk) {
                for (const file of uploadFiles.value) {
                    let needDo = true
                    if (props.chunkFileFilter) {
                        needDo = props.chunkFileFilter(file) as boolean
                    }
                    if (!needDo || !file.file || file.status !== UploadFileStatus.Waiting || file.chunks) continue
                    const newFile = await getChunk(file.file, props.chunkSize)
                    Object.assign(file, newFile)
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
                await handleAddUpload(files)
            } finally {
                (e.target as HTMLInputElement).value = ''
            }
        }

        const handleDelete = async (file: UploadFile, index: number) => {
            if (props.disabled) return
            try {
                await props.delete?.(file, true)
                uploadFiles.value?.splice(index, 1)
            } catch {
                return
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

        const deleteAllFiles = async() => {
            const files = uploadFiles.value
            uploadFiles.value = []
            return files
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
            handleRetry,
            deleteAllFiles
        }
    },
    render() {
        const renderInputRef = () => (
            <input
                ref="fileRef"
                type="file"
                class="wp-upload__file"
                multiple={this.multiple}
                accept={this.accept}
                onChange={this.handleChange}
            />
        )
        switch (this.preset) {
            case 'card':
                return (
                    <UploadCard
                        pin={this.pin}
                        drop={this.drop}
                        dragover={this.dragover}
                        disabled={this.disabled}
                        multiple={this.multiple}
                        accept={this.accept}
                        preview={this.preview}
                        uploadFiles={this.uploadFiles}
                        showButton={this.showButton}
                        showFileList={this.showFileList}
                        handleDrop={this.handleDrop}
                        handleDragover={this.handleDragover}
                        handleDragleave={this.handleDragleave}
                        startUpload={this.startUpload}
                        handleChange={this.handleChange}
                        handleDelete={this.handleDelete}
                        handleRetry={this.handleRetry}
                        retry={this.retry}
                        onItemClick={(e, file) => this.$emit('itemClick', e, file)}
                        v-slots={{
                            ...this.$slots,
                            input: renderInputRef
                        }}
                    />
                )
            default:
                return (
                    <UploadList
                        pin={this.pin}
                        drop={this.drop}
                        dragover={this.dragover}
                        disabled={this.disabled}
                        multiple={this.multiple}
                        accept={this.accept}
                        uploadFiles={this.uploadFiles}
                        showButton={this.showButton}
                        showFileList={this.showFileList}
                        handleDrop={this.handleDrop}
                        handleDragover={this.handleDragover}
                        handleDragleave={this.handleDragleave}
                        startUpload={this.startUpload}
                        handleChange={this.handleChange}
                        handleDelete={this.handleDelete}
                        handleRetry={this.handleRetry}
                        retry={this.retry}
                        showImage={this.showImage}
                        onHandleIconClick={( file, index, status) => this.$emit('handleIconClick', file, index, status)}
                        onItemClick={(e, file) => this.$emit('itemClick', e, file)}
                        v-slots={{
                            ...this.$slots,
                            input: renderInputRef
                        }}
                    />
                )
        }
    }
})
