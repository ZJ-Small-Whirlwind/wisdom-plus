import { withInstall } from '@wisdom-plus/utils/with-install'
import Tabs from './src/tabs'
import Tab from './src/tab'

export const WpTabs = withInstall(Tabs)
export const WpTab = withInstall(Tab)
export default WpTabs

export * from './src/tabs'
export * from './src/tab'