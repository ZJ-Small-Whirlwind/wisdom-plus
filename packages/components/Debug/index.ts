import { withInstall } from '@wisdom-plus/utils/with-install'
import Debug from './src/debug'

export const WpDebug = withInstall(Debug)
export default WpDebug

export * from './src/debug'