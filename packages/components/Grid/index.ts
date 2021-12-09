import { withInstall } from '@wisdom-plus/utils/with-install'
import Gird from './src/grid'

export const WpGrid = withInstall(Gird)
export const WpG = withInstall(Gird)
export default WpGrid

export { gridProps } from './src/grid'
export type { GridProps } from './src/grid'