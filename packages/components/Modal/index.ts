import { withInstall } from '@wisdom-plus/utils/with-install'
import Modal from './src/modal'

export const WpModal = withInstall(Modal)
export default WpModal

export { modalProps } from './src/modal'
export type { ModalProps } from './src/modal'