import { withInstall } from '@wisdom-plus/utils/with-install'
import Button from './src/button.vue'

export const WpButton = withInstall(Button, )
export default WpButton

// @ts-ignore
export * from './src/button.ts'