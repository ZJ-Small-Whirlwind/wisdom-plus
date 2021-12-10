import { withInstall } from '@wisdom-plus/utils/with-install'
import Tooltip from './src/tooltip'

export const WpTooltip = withInstall(Tooltip)
export default WpTooltip

export { tooltipProps } from './src/tooltip'
export type { TooltipProps } from './src/tooltip'