import { withInstall } from '@wisdom-plus/utils/with-install'
import Upload from './src/upload'

export const WpProUpload = withInstall(Upload)
export default WpProUpload

export * from './src/upload'