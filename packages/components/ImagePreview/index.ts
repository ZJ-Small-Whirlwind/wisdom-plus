import { withInstall } from '@wisdom-plus/utils/with-install'
import imagePreview from './src/imagePreview'

export const WpImagePreview = withInstall(imagePreview)
export default WpImagePreview

export * from './src/imagePreview'
export { Preview } from './src/preview'