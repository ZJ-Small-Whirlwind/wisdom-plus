import { withInstall } from '@wisdom-plus/utils/with-install'
import backTop from './src/BackTop'

export const WpBackTop = withInstall(backTop)
export default WpBackTop

export { backTopProps } from './src/BackTop'
export type { BackTopProps } from './src/BackTop'

