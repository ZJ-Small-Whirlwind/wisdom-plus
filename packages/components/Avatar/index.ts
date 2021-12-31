import { withInstall } from '@wisdom-plus/utils/with-install'
import avatar from './src/avatar'

export const WpAvatar = withInstall(avatar)
export default WpAvatar

export { avatarProps } from './src/avatar'
export type { AvatarProps } from './src/avatar'