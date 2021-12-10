import { withInstall } from '@wisdom-plus/utils/with-install'
import collapse from './src/collapse'

export const WpCollapse = withInstall(collapse)
export default WpCollapse

export { collapseEmits, collapseProps } from './src/collapse'
export type { CollapseSupport, CollapseProps, CollapseEmits } from './src/collapse'