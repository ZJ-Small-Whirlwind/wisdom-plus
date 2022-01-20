import { ref, createApp, VNode, App, defineComponent, onMounted } from 'vue'

import Modal, { ModalProps } from './modal'
import Button from '../../Button'
import type { ButtonProps } from '../../Button/src/button'
import Space, { SpaceProps } from '../../Space'

export interface DialogOptions {
    title?: VNode | string | (() => VNode),
    content?: VNode | string | (() => VNode),
    cancelText?: string | VNode,
    confirmText?: string | VNode,
    showFooter?: boolean,
    showCancel?: boolean,
    showConfirm?: boolean,
    spaceProps?: Partial<SpaceProps> & Record<string, any>,
    cancelProps?: Partial<ButtonProps> & Record<string, any>,
    confirmProps?: Partial<ButtonProps> & Record<string, any>,
    props?: Partial<ModalProps> & Record<string, any>,
    footer?: (close?: () => void) => VNode | string
}

const openDialog = function Dialog(options?: DialogOptions) {
    return new Promise<void>((resolve, reject) => {
        const newDiv = document.createElement('div')
        document.body.appendChild(newDiv)
        const app = createApp(defineComponent({
            setup() {
                const show = ref(false)
                onMounted(() => {
                    show.value = true
                })
                const confirmButtonRef = ref<InstanceType<typeof Button> | null>(null)
                return () => (
                    <Modal width={300} { ...options?.props } v-model={show.value} v-slots={{
                        title: () => typeof options?.title === 'function' ? options.title() : (options?.title || '提示'),
                        default: () => typeof options?.content === 'function' ? options.content() : options?.content,
                        footer: () => options?.footer?.(() => {
                            show.value = false
                        }) || (options?.showFooter !== false ? (
                            <Space justify="end" { ...options?.spaceProps }>
                                {
                                    options?.showCancel !== false ? (
                                        <Button onClick={() => {
                                            show.value = false
                                            reject()
                                        }} {...options?.cancelProps}>
                                            { options?.cancelText || '取消' }
                                        </Button>
                                    ) : null
                                }
                                {
                                    options?.showConfirm !== false ? (
                                        <Button ref={confirmButtonRef} tabindex="-1" type="primary" onClick={() => {
                                            show.value = false
                                            resolve()
                                        }} {...options?.confirmProps}>
                                            { options?.confirmText || '确定' }
                                        </Button>
                                    ) : null
                                }
                            </Space>
                        ) : null)
                    }} onAfterClose={() => {
                        document.body.removeChild(newDiv)
                        app.unmount()
                    }} onOpen={() => {
                        confirmButtonRef.value?.$el?.focus?.({ preventScroll: true })
                    }}></Modal>
                )
            }
        }))
        app.mount(newDiv)
    })
}

openDialog.install = (app: App<Element>) => {
    app.config.globalProperties.$dialog = openDialog
}

export default openDialog