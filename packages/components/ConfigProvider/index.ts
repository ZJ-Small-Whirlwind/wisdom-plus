import { withInstall } from '@wisdom-plus/utils/with-install'
import configProvider from './src/configProvider'

export const WpConfigProvider = withInstall(configProvider)
export default WpConfigProvider

export * from './src/configProvider'