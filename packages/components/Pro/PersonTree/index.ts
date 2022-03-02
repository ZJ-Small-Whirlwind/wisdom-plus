import { withInstall } from '@wisdom-plus/utils/with-install'
import PersonTree from './src/tree'

export const WpProPersonTree = PersonTree && withInstall(PersonTree)
export default WpProPersonTree

export * from './src/tree'