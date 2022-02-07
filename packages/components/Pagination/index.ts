import { withInstall } from '@wisdom-plus/utils/with-install'
import Pagination from './src/pagination'

export const WpPagination = withInstall(Pagination)
export default WpPagination

export { paginationProps } from './src/pagination'
export type { PaginationProps } from './src/pagination'