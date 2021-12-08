import { withInstall } from '@wisdom-plus/utils/with-install'
import Space from './src/space'

export const WpSpace = withInstall(Space)
export default WpSpace

export { spaceProps } from './src/space'