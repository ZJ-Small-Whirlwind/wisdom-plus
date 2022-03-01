import { withInstall } from '@wisdom-plus/utils/with-install'
import collapseTransition from './src/collapseTransition'

export const CollapseTransition = withInstall(collapseTransition, ['WpCollapseTransition'])
export default CollapseTransition

export { collapseTransitionProps } from './src/collapseTransition'
export type { CollapseTransitionProps } from './src/collapseTransition'