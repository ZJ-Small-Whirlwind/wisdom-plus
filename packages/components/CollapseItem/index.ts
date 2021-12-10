import { withInstall } from '@wisdom-plus/utils/with-install'
import collapseItem from './src/collapseItem'

export const WpCollapseItem = withInstall(collapseItem)
export default WpCollapseItem

export { collapseItemProps } from './src/collapseItem'
export type { CollapseItemProps } from './src/collapseItem'