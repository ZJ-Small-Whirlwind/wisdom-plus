import { withInstall } from '@wisdom-plus/utils/with-install'
import Upload from './src/upload'

export const WpUpload = withInstall(Upload)
export default WpUpload

export * from './src/upload'