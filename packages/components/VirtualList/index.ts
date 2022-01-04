import { VirtualList } from 'vueuc'

import { withInstall } from '@wisdom-plus/utils/with-install'
import { ExtractPropTypes } from 'vue'
VirtualList.name = 'WpVirtualList'

export const WpVirtualList = withInstall(VirtualList)
export default WpVirtualList

export const virtualListProps = VirtualList.props
export type VirtualListProps = ExtractPropTypes<typeof virtualListProps>