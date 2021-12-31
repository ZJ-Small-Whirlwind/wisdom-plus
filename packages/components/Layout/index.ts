import { withInstall } from '@wisdom-plus/utils/with-install'
import Layout from './src/layout'
import layoutContent from './src/layoutContent'
import layoutAside from './src/layoutAside'

export const WpLayout = withInstall(Layout)
export const WpLayoutContent = withInstall(layoutContent)
export const WplayoutAside = withInstall(layoutAside)
export default WpLayout

export { layoutProps } from './src/layout'
export type { LayoutProps } from './src/layout'
export { layoutContentProps } from './src/layoutContent'
export type { LayoutContentProps } from './src/layoutContent'
export { layoutAsideProps } from './src/layoutAside'
export type { LayoutAsideProps } from './src/layoutAside'