import { withInstall } from '@wisdom-plus/utils/with-install'
import countDown from './src/countDown'

export const WpCountDown = withInstall(countDown)
export default WpCountDown

export * from './src/countDown'