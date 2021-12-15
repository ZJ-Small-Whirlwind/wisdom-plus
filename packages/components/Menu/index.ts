import { withInstall } from '@wisdom-plus/utils/with-install'
import Menu from './src/menu'

export const WpMenu = withInstall(Menu)
export default WpMenu

export { menuProps } from './src/menu'
export type { MenuProps } from './src/menu'