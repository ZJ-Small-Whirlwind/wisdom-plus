import { withInstall } from '@wisdom-plus/utils/with-install'
import PopConfirm from './src/popConfirm'

export const WpPopConfirm = withInstall(PopConfirm)
export default WpPopConfirm

export { popConfirmProps } from './src/popConfirm'
export type { PopConfirmProps } from './src/popConfirm'