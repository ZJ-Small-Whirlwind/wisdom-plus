import { withInstall } from '@wisdom-plus/utils/with-install'
import Dropdown from './src/dropdown'

export const WpDropdown = withInstall(Dropdown)
export default WpDropdown

export { dropdownProps } from './src/dropdown'
export type { DropdownProps } from './src/dropdown'
export * from './src/typings'