import { defineComponent, watch, type PropType } from "vue"
import Space from "../../Space"
import { type UploadFile, UploadFileStatus } from './interface'

import Icon from '../../Icon'
import Image from '../../Image'
import { Preview } from '../../ImagePreview'

import {
    PlusOutlined,
    Loading3QuartersOutlined,
    CloseOutlined
} from '@vicons/antd'

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
        handleRetry: Function as PropType<(file: UploadFile) => void>,
        handleDrop: Function as PropType<(e: DragEvent) => void>,
        handleDragover: Function as PropType<(e: DragEvent) => void>,
        handleDragleave: Function as PropType<(e: DragEvent) => void>,
        retry: Boolean,
        preview: Boolean
    },
    emits: {
        itemClick: (e: Event, value: UploadFile) => {
            void e
            void value
            return true
        }
    },
    setup(props) {
        watch(() => props.uploadFiles, (after, before) => {
            if (!props.uploadFiles) return
            props.uploadFiles.forEach(file => {
                if (file.url) {
                    file.__wp_src__ = file.url
                } else if (file.file) {
                    const reader = new FileReader()
                    reader.readAsDataURL(file.file)
                    reader.onload = event => {
                        file.__wp_src__ = String(event.target?.result)
                    }
                }
            })
        }, {
            immediate: true,
            deep: true
        })
    },
    render() {
        return (
            <Space class={[
                'wp-upload',
                {
                    'wp-upload__disabled': this.disabled
                }
            ]} size={5}>
                {
                    this.showFileList ? (
                        this.$slots.lists?.({ files: this.uploadFiles }) || (
                            this.uploadFiles?.map((file, index) => (
                                this.$slots.list?.({ file }) || (
                                    <div class="wp-upload__card" onClick={e => {
                                        if (this.retry && file.status === UploadFileStatus.Fail) {
                                            this.handleRetry?.(file)
                                            return
                                        }
                                        if (this.preview && file.url) {
                                            const filesMap = this.uploadFiles?.map(file => file.url) || []
                                            const filesFilter = filesMap?.filter(file => file)
                                            Preview(
                                                filesFilter as string[],
                                                file.url
                                            )
                                        }
                                        this.$emit('itemClick', e, file)
                                    }} key={file.name + file.index}>
                                        {
                                            file.status === UploadFileStatus.Loading || file.status === UploadFileStatus.Fail ? (
                                                <div class={['wp-upload__card-overlay', {
                                                    'is-loading': file.status === UploadFileStatus.Loading
                                                }]}>
                                                    <Icon>
                                                        {
                                                            file.status === UploadFileStatus.Loading ? <Loading3QuartersOutlined /> : <CloseOutlined />
                                                        }
                                                    </Icon>
                                                </div>
                                            ) : null
                                        }
                                        {
                                            !this.disabled && ('pin' in file ? !file.pin : !this.pin) ? (
                                                <div class="wp-upload__card-close" onClick={(e) => {
                                                    e.stopPropagation()
                                                    this.handleDelete?.(file, index)
                                                }}>
                                                    <Icon>
                                                        <CloseOutlined />
                                                    </Icon>
                                                </div>
                                            ) : null
                                        }
                                        <Image src={file.__wp_src__} contain={'cover'} />
                                    </div>
                                )
                            ))
                        )
                    ) : null
                }
                {
                    this.showButton && !this.disabled ? (
                        this.$slots.default?.({ start: this.startUpload, dragover: this.dragover, disabled: this.disabled }) || (
                            <div
                                class="wp-upload__card wp-upload__card-add"
                                onDrop={this.handleDrop}
                                onDragover={this.handleDragover}
                                onDragleave={this.handleDragleave}
                                onClick={this.startUpload}
                            >
                                <Icon>
                                    <PlusOutlined />
                                </Icon>
                                {this.$slots.input?.()}
                            </div>
                        )
                    ) : null
                }
            </Space>
        )
    }
})