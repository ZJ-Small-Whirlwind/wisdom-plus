import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { ref, defineComponent, ExtractPropTypes, PropType } from "vue"

import UploadList from './uploadList'
import UploadCard from './uploadCard'

import {ChunkItem, ChunkItemChunks, ChunkItemChunksItem, getChunk, type UploadFile, UploadFileStatus} from './interface'

export const uploadProps = buildProps({
    modelValue: {
        type: Array as PropType<UploadFile[]>,
        default: undefined
    },
    multiple: Boolean,
    accept: String,
    drop: Boolean,
    delete: Function as PropType<(file: UploadFile, initiative: boolean) => Promise<void>>,
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
    chunk: {
        type: Boolean,
        default: false
    },
    chunkSize: {
        type: Number,
        default: 1024*1024*2
    }
})

export type UploadProps = ExtractPropTypes<typeof uploadProps>

export default defineComponent({
    name: 'WpUpload',
    props: uploadProps,
    emits: {
        'update:modelValue': (value: UploadFile[]) => Array.isArray(value),
        itemClick: (e: Event, value: UploadFile) => {
            void e
            void value
            return true
        }
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
        /**
         * 获取切片
         * @param file
         */
        const getChunk:getChunk = async (file:File)=>{
            return new Promise<ChunkItem>(resolve => {
                const filesize = file.size;
                const filename = file.name;
                //计算文件切片总数
                const total = Math.ceil(filesize / props.chunkSize);
                let chunk:ChunkItemChunks = [];
                let start = 0;
                let end = 0;
                let index = 0;
                while(start < filesize) {
                    end = start + props.chunkSize;
                    if(end > filesize) {
                        end = filesize;
                    }
                    index++;
                    chunk.push({
                        filename:`${filename}-chunk-${index}`,
                        progress:0,
                        index,
                        file:file.slice(start,end), //切割文件
                        end:false,
                        start:false,
                        cancel:null,
                        complete:false,
                        error:false,
                    } as ChunkItemChunksItem)
                    start = end;
                }
                let resUlt:ChunkItem = {
                    filename,
                    progress:0,
                    show:false,
                    chunk,
                    file,
                    total,
                }
                resolve(resUlt);
            })
        }
        /**
         * 大文件切片上传
         * @param uploadFiles
         */
        const handleUploadChunkBefore = async (uploadFiles: FileList | File[])=>{
            if(props.chunk){
                const chunks = (uploadFiles as Array<any>).map(async e=>(await getChunk(e.file)).chunk.map(({file,filename})=>({
                    ...e,
                    name:filename,
                    file,
                })))
                const chunkFiles = (await Promise.all(chunks)).reduce((a,b)=>a.concat(b),[]);
                console.log(chunkFiles, uploadFiles)
                return Promise.resolve(chunkFiles);
            }else {
                return Promise.resolve(uploadFiles);
            }
        }
        const handleUpload = async() => {
            uploadFiles.value.forEach(file => {
                if (file.status === UploadFileStatus.Waiting) {
                    file.status = UploadFileStatus.Loading
                }
            })
            await props.upload?.(await handleUploadChunkBefore((uploadFiles.value.filter(file => file.status === UploadFileStatus.Loading) as any)), uploadFiles.value)
        }

        const handleAddUpload = async(files: FileList | File[]) => {
            if (files.length === 0) return
            for (let i = 0; i < files.length; i++) {
                if (props.limit && files.length - i > props.limit) continue
                uploadFiles.value.push({
                    name: files[i].name,
                    file: files[i],
                    progress: 0,
                    status: UploadFileStatus.Waiting
                })
            }
            if (props.limit) {
                while (uploadFiles.value.length > props.limit) {
                    const file = uploadFiles.value.shift()
                    await props.delete?.(file, false)
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
            try {
                await props.delete?.(file, true)
                uploadFiles.value.splice(index, 1)
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
            handleDragover
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
