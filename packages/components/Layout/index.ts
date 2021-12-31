import { withInstall } from '@wisdom-plus/utils/with-install'
import Layout from './src/layout'
import layoutContent from './src/layoutContent'
import layoutAside from './src/layoutAside'

export const WpLayout = withInstall(Layout)
export const WpLayoutContent = withInstall(layoutContent)
export const WplayoutAside = withInstall(layoutAside)
export default WpLayout