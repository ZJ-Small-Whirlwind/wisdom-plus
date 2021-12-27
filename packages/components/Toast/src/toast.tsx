import { createApp, defineComponent, ref, VNode, Transition, Teleport, App, CSSProperties } from 'vue'

const getMaxZIndex = () => {
    const elements = Array.from(document.querySelectorAll('*'))
    const arr = elements.map(e => +window.getComputedStyle(e).zIndex || 0);
    return arr.length ? Math.max(...arr) + 1 : 1
}

export interface ToastOptions {
    dark?: boolean;
    message?: VNode | string;
    duration?: number;
    placement?: 'top' | 'bottom' | 'center',
    style?: string | CSSProperties,
    transition?: string
}

const Toast = (options: ToastOptions) => {
    const defaltOptions: ToastOptions = {
        duration: 3000,
        placement: 'bottom'
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
                <Teleport to="body">
                    <div class={{
                        'wp-toast': true,
                        [`wp-toast__${options.placement}`]: true
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

export default Toast