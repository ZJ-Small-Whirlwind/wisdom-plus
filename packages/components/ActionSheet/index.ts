import { withInstall } from '@wisdom-plus/utils/with-install'
import actionSheet from './src/actionSheet'

export const WpActionSheet = withInstall(actionSheet)
export default WpActionSheet

export { actionSheetProps } from './src/actionSheet'
export type { ActionSheetProps, ActionSheetRecord } from './src/actionSheet'