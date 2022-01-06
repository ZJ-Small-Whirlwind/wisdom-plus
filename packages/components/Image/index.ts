import { withInstall } from '@wisdom-plus/utils/with-install'
import image from './src/image'

export const WpImage = withInstall(image)
export default WpImage

export { imageProps } from './src/image'
export type { ImageProps } from './src/image'