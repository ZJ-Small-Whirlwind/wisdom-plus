import { createApp, defineComponent, ref, VNode, Transition, Teleport, App, CSSProperties, RendererElement, h, Component } from 'vue'

import { getMaxZIndex } from '@wisdom-plus/utils/get-max-zindex'
import Icon from '../../Icon'
import {
    CheckCircleFilled,
    WarningFilled,
    InfoCircleFilled,
    CloseCircleFilled
} from '@vicons/antd'
export interface ToastOptions {
    dark?: boolean;
    message?: VNode | string;
    duration?: number;
    placement?: 'top' | 'bottom' | 'center',
    style?: string | CSSProperties,
    transition?: string,
    to?: string | RendererElement | null | undefined
}

const Toast = (options: ToastOptions) => {
    const defaltOptions: ToastOptions = {
        duration: 3000,
        placement: 'center',
        to: 'body'
    }
    options = Object.assign(defaltOptions, options)
    const newDiv = document.createElement('div')
    document.body.appendChild(newDiv)
    const app = createApp(defineComponent({
        setup() {
            const show = ref(true)
            setTimeout(() => {
                show.value = false
            }, options.duration)
            return () => (
                <Teleport to={options.to}>
                    <div class={{
                        'wp-toast': true,
                        [`wp-toast__${options.placement}`]: true,
                        [`wp-toast__absolute`]: options.to !== 'body' && options.to !== document.body
                    }} style={{
                        zIndex: getMaxZIndex()
                    }}>
                        <Transition name={options.transition || 'wp-toast-fade'} appear onAfterLeave={() => {
                            app.unmount()
                            document.body.removeChild(newDiv)
                        }}>
                            <div style={options.style} class={{
                                'wp-toast-message': true,
                                'wp-toast-message__dark': options.dark
                            }} v-show={show.value}>
                                { options.message }
                            </div>
                        </Transition>
                    </div>
                </Teleport>
            )
        }
    }))
    app.mount(newDiv)
}

Toast.install = (app: App<Element>) => {
    app.config.globalProperties.$toast = Toast
}

const specToast = (color: string, icon: Component) => {
    return (message: string | VNode, options: Omit<ToastOptions, 'message'> = {}) => {
        Toast({
            ...options,
            message: 
                h('div', { class: 'wp-toast--spec' }, {
                    default: () => [h(Icon, {
                        color
                    }, {
                        default: () => h(icon)
                    }), message]
                })
        })
    }
}

Toast.success = specToast('var(--wp-color-success)', CheckCircleFilled)
Toast.warning = specToast('var(--wp-color-warning)', WarningFilled)
Toast.info = specToast('var(--wp-color-info)', InfoCircleFilled)
Toast.error = specToast('var(--wp-color-danger)', CloseCircleFilled)

export default Toast