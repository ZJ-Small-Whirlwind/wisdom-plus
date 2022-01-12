import { withInstall } from '@wisdom-plus/utils/with-install'
import Table from './src/table'

export const WpTable = withInstall(Table)
export default WpTable

export { tableProps } from './src/table'
export type { TableProps } from './src/table'