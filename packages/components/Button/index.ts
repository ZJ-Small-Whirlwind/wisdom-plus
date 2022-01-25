import { withInstall } from '@wisdom-plus/utils/with-install'
import Button from './src/button.tsx'

export const WpButton = withInstall(Button, )
export default WpButton

// @ts-ignore
export * from './src/button.ts'