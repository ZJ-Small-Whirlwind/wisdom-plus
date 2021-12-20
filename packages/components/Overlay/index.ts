import { withInstall } from '@wisdom-plus/utils/with-install'
import Overlay from './src/overlay'

export const WpOverlay = withInstall(Overlay)
export default WpOverlay

export { overlayProps } from './src/overlay'
export type { OverlayProps } from './src/overlay'