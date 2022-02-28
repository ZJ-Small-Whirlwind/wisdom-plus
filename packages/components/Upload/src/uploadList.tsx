import { h, defineComponent, type PropType, computed, ref } from "vue"

import Icon from '../../Icon'
import Button from '../../Button'
import Space from '../../Space'
import CollapseTransition from '../../CollapseTransition'
import VirtualList from '../../VirtualList'

import {
    DeleteOutlined,
    CheckCircleTwotone,
    UploadOutlined,
    Loading3QuartersOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    ReloadOutlined
} from '@vicons/antd'

import { type UploadFile, UploadFileStatus } from './interface'
import svgs, { start } from './svgs'

const WpIcon = Icon as any
const Icons = {
    [UploadFileStatus.Success]: CheckCircleTwotone,
    [UploadFileStatus.Waiting]: UploadOutlined,
    [UploadFileStatus.Loading]: Loading3QuartersOutlined,
    [UploadFileStatus.Fail]: CloseOutlined
}

interface UploadFileExtend extends UploadFile {
    chunksFinish: number,
    showChunk: boolean,
    item: UploadFile
}

export default defineComponent({
    props: {
        drop: Boolean,
        dragover: Boolean,
        disabled: Boolean,
        showButton: Boolean,
        showFileList: Boolean,
        multiple: Boolean,
        accept: String,
        pin: Boolean,
        uploadFiles: Array as PropType<UploadFile[]>,
        startUpload: Function as PropType<() => void>,
        handleChange: Function as PropType<(e: Event) => void>,
        handleDelete: Function as PropType<(file: UploadFile, index: number) => void>,
        handleDrop: Function as PropType<(e: DragEvent) => void>,
        handleDragover: Function as PropType<(e: DragEvent) => void>,
        handleDragleave: Function as PropType<(e: DragEvent) => void>,
        handleRetry: Function as PropType<(file: UploadFile) => void>,
        retry: Boolean
    },
    emits: {
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
    setup(props, { emit }) {
        const getFileTypeIcon = (filename: string) => {
            const execFilename = /\.(.+)?$/.exec(filename)
            if (!execFilename?.[1]) return `${start}${svgs.default}</svg>`
            return `${start}${svgs[execFilename[1].toLowerCase()] || svgs.default}</svg>`
        }

        const getStatusIcon = (status?: UploadFileStatus) => {
            if (status) {
                return Icons[status] || Icons[UploadFileStatus.Success]
            } else {
                return Icons[UploadFileStatus.Success]
            }
        }

        const cellsShowChunks = ref<UploadFile[]>([])

        const filesMap = computed(() => {
            if (!props.uploadFiles) return
            return props.uploadFiles.map(item => {
                let chunksFinish = 0
                if (item.chunks) {
                    item.chunks.forEach(chunk => {
                        if (chunk.status === UploadFileStatus.Success) {
                            chunksFinish += 1
                        }
                    })
                }
                return {
                    ...item,
                    chunksFinish,
                    showChunk: cellsShowChunks.value.includes(item),
                    item
                } as UploadFileExtend
            })
        })

        const fileCellRender = (file: UploadFileExtend | UploadFile, index: number) => {
            return (
                <div class="wp-upload__cell" onClick={e => emit('itemClick', e, file)} key={file.name + index}>
                    <WpIcon class={`wp-upload__cell-icon`} v-html={getFileTypeIcon(file.name)} />
                    <div class="wp-upload__cell-name">
                        {
                            file.url ? (
                                <a href={file.url} target="_blank" onClick={e => e.stopPropagation()}>{file.name}</a>
                            ): file.name
                        }
                        {
                            file.progress && file.status === UploadFileStatus.Loading ? (
                                <span class="wp-upload__cell-progress">
                                    { file.progress }%
                                </span>
                            ) : null
                        }
                        {
                            file.chunks && file.chunks.length > 0 && (
                                <span class="wp-upload__cell-progress" onClick={e => {
                                    e.stopPropagation()
                                    if (!file.item) return
                                    const indexIs = cellsShowChunks.value.indexOf((file as UploadFileExtend).item)
                                    if (indexIs > -1) {
                                        cellsShowChunks.value.splice(indexIs, 1)
                                    } else {
                                        cellsShowChunks.value.push((file as UploadFileExtend).item)
                                    }
                                }}>
                                    { file.chunksFinish }/{ file.chunks?.length }
                                </span>
                            )
                        }
                    </div>
                    <Space class="wp-upload__cell-status" size={5}>
                        {
                            props.retry && file.status === UploadFileStatus.Fail && (
                                <WpIcon class="wp-upload__cell-retry" onClick={(e: Event) => {
                                    e.stopPropagation()
                                    props.handleRetry?.(file)
                                }}>
                                    <ReloadOutlined />
                                </WpIcon>
                            )
                        }
                        <WpIcon class={`wp-upload__cell-status-${file.status || 0}`} onClick={(e:Event)=>{
                            e.stopPropagation()
                            emit('handleIconClick', file, index, file.status || 0)
                        }}>
                            {
                                h(getStatusIcon(file.status))
                            }
                        </WpIcon>
                        {
                            !props.disabled && ( 'pin' in file ? !file.pin : !props.pin ) ? (
                                <WpIcon class="wp-upload__cell-delete" onClick={(e: Event) => {
                                    e.stopPropagation()
                                    props.handleDelete?.(file, index)
                                }}>
                                    <DeleteOutlined />
                                </WpIcon>
                            ) : null
                        }
                    </Space>
                </div>
            )
        }

        return {
            filesMap,
            fileCellRender
        }
    },
    render() {
        return (
            <Space class={[
                'wp-upload',
                {
                    'wp-upload__disabled': this.disabled
                }
            ]} vertical>
                {
                    this.showButton ? (
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
                            { this.$slots.input?.() }
                        </div>
                    ) : null
                }
                {
                    this.$slots.description?.()
                }
                {
                    this.showFileList ? (
                        <div class="wp-upload__cells">
                            {
                                this.$slots.lists?.({ files: this.uploadFiles }) || (
                                    this.filesMap?.map((file, index) => (
                                        this.$slots.list?.({ file }) || (
                                            <>
                                                { this.fileCellRender(file, index) }
                                                <CollapseTransition>
                                                    {
                                                        file.chunks && file.chunks?.length > 0 && file.showChunk && (
                                                            <div class="wp-upload__cell__chunks__wrapper">
                                                                {
                                                                    file.chunks.length <= 10 ? (
                                                                        file.chunks.map((chunk, i) => this.fileCellRender(chunk, i))
                                                                    ) : (
                                                                        <VirtualList class="wp-upload__cell__chunks" itemSize={20} items={file.chunks} itemResizable v-slots={{
                                                                            default: ({ item: chunk, index: i }) => this.fileCellRender(chunk, i)
                                                                        }} showScrollbar={false}/>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </CollapseTransition>
                                            </>
                                        )
                                    ))
                                )
                            }
                        </div>
                    ) : null
                }
            </Space>
        )
    }
})
