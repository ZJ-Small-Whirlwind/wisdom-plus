import { withInstall } from '@wisdom-plus/utils/with-install'
import PersonTransfer from './src/personTransfer'

export const WpProPersonTransfer = withInstall(PersonTransfer)
export default WpProPersonTransfer

export * from './src/personTransfer'