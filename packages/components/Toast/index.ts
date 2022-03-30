import Toast from './src/toast'

const WpToast: Partial<typeof Toast> = { ...Toast }
delete WpToast.install

export { Toast, WpToast }
export type { ToastOptions } from './src/toast'