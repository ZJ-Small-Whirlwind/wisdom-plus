import { withInstall } from '@wisdom-plus/utils/with-install'
import Button from './src/buttonElement'
import ButtonGroup from './src/buttonGroup'

export const WpButton = withInstall(Button, )
export default WpButton

export const WpButtonGroup = withInstall(ButtonGroup, )

// @ts-ignore
export * from './src/button.ts'
