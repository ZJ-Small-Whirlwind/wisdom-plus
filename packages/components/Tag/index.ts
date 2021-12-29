import { withInstall } from '@wisdom-plus/utils/with-install'
import Tag from './src/tag'

export const WpTag = withInstall(Tag)
export default WpTag

export { tagProps } from './src/tag'
export type { TagProps } from './src/tag'