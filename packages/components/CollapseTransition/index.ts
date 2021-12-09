import { withInstall } from '@wisdom-plus/utils/with-install'
import collapseTransition from './src/collapseTransition'

export const WpCollapseTransition = withInstall(collapseTransition)
export const CollapseTransition = withInstall(collapseTransition)
export default WpCollapseTransition

export { collapseTransitionProps } from './src/collapseTransition'
export type { CollapseTransitionProps } from './src/collapseTransition'