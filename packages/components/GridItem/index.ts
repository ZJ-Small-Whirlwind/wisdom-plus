import { withInstall } from '@wisdom-plus/utils/with-install'
import GirdItem from './src/gridItem'

export const WpGridItem = withInstall(GirdItem)
export const WpGi = withInstall(GirdItem)
export default WpGridItem

export { gridItemProps } from './src/gridItem'
export type { GridItemProps } from './src/gridItem'