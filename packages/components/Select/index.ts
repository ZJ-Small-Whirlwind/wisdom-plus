import { withInstall } from '@wisdom-plus/utils/with-install'
import Select from './src/select'

export const WpSelect = withInstall(Select)
export default WpSelect

export { selectProps } from './src/select'
export type { SelectProps } from './src/select'
