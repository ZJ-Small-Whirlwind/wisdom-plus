import { withInstall } from '@wisdom-plus/utils/with-install'
import badge from './src/badge'

export const WpBadge = withInstall(badge)
export default WpBadge

export { badgeProps } from './src/badge'
export type { BadgeProps } from './src/badge'