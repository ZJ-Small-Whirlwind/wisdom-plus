import { withInstall } from '@wisdom-plus/utils/with-install'
import PullRefresh from './src/pullRefresh'

export const WpPullRefresh = withInstall(PullRefresh)
export default WpPullRefresh

export * from './src/pullRefresh'