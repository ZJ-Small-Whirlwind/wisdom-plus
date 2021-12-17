import { withInstall } from '@wisdom-plus/utils/with-install'
import ScrollList from './src/scrollList'

export const WpScrollList = withInstall(ScrollList)
export default WpScrollList

export { scrollListProps } from './src/scrollList'
export type { ScrollListProps } from './src/scrollList'