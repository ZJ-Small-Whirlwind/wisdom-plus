import { withInstall } from '@wisdom-plus/utils/with-install'
import Modal from './src/modal'
import Drawer from './src/drawer'

const DialogModal = { ...Modal }
DialogModal.name = 'WpDialog'
export const WpDrawer = withInstall(Drawer)
export const WpDialog = withInstall(DialogModal)
export const WpModal = withInstall(Modal)
export default WpModal

import Dialog from './src/dialog'
export { Dialog }
export type { DialogOptions } from './src/dialog'

export { closeAllModals } from './src/utils'

export { modalProps } from './src/modal'
export type { ModalProps } from './src/modal'