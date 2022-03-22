import { withInstall } from '@wisdom-plus/utils/with-install'
import Await from './src/await'

export const WpAwait = withInstall(Await)
export default WpAwait

export * from './src/await'