import { withInstall, withNoopInstall } from '@wisdom-plus/utils/with-install'
import Button from './src/button.vue'

export const WpButton = withInstall(Button, )
export default WpButton

export * from './src/button'