import { withInstall } from '@wisdom-plus/utils/with-install'
import ellipsis from './src/ellipsis'

export const WpEllipsis = withInstall(ellipsis)
export default WpEllipsis

export { ellipsisProps } from './src/ellipsis'
export type { EllipsisProps } from './src/ellipsis'