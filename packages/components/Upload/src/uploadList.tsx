import { h, defineComponent, type PropType } from "vue"

import Icon from '../../Icon'
import Button from '../../Button'
import Space from '../../Space'

import {
    DeleteOutlined,
    CheckCircleTwotone,
    UploadOutlined,
    Loading3QuartersOutlined,
    CloseSquareTwotone,
    CloudUploadOutlined
} from '@vicons/antd'

import { type UploadFile, UploadFileStatus } from './interface'
import svgs, { start } from './svgs'

const WpIcon = Icon as any
const Icons = {
    [UploadFileStatus.Success]: CheckCircleTwotone,
    [UploadFileStatus.Waiting]: UploadOutlined,
    [UploadFileStatus.Loading]: Loading3QuartersOutlined,
    [UploadFileStatus.Fail]: CloseSquareTwotone
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
        handleDragleave: Function as PropType<(e: DragEvent) => void>
    },
    emits: {
        itemClick: (e: Event, value: UploadFile) => {
            void e
            void value
            return true
        }
    },
    setup() {
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

        return {
            getFileTypeIcon,
            getStatusIcon
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
                                    this.uploadFiles?.map((file, index) => (
                                        this.$slots.list?.({ file }) || (
                                            <div class="wp-upload__cell" onClick={e => this.$emit('itemClick', e, file)}>
                                                <WpIcon class={`wp-upload__cell-icon`} v-html={this.getFileTypeIcon(file.file?.name || file.name)} />
                                                <div class="wp-upload__cell-name">
                                                    {
                                                        file.url ? (
                                                            <a href={file.url} target="_blank" onClick={e => e.stopPropagation()}>{file.name}</a>
                                                        ): file.name
                                                    }
                                                    {
                                                        (file.progress || file.progress === 0) && file.status === UploadFileStatus.Loading ? (
                                                            <span class="wp-upload__cell-progress">
                                                                { file.progress }%
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                                <Space class="wp-upload__cell-status" size={5}>
                                                    <WpIcon class={`wp-upload__cell-status-${file.status || 0}`}>
                                                        {
                                                            h(this.getStatusIcon(file.status))
                                                        }
                                                    </WpIcon>
                                                    {
                                                        !this.disabled && ( 'pin' in file ? !file.pin : !this.pin ) ? (
                                                            <WpIcon class="wp-upload__cell-delete" onClick={() => this.handleDelete?.(file, index)}>
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
                        </div>
                    ) : null
                }
            </Space>
        )
    }
})