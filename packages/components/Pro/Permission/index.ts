import { withInstall } from '@wisdom-plus/utils/with-install'
import Permission from './src/permission'

export const WpProPermission = withInstall(Permission)
export default WpProPermission

export * from './src/permission'
export * from './src/usePermission'