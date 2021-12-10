import { withInstall } from '@wisdom-plus/utils/with-install'
import Popover from './src/popover'

export const WpPopover = withInstall(Popover)
export default WpPopover

export { popoverProps, popoverEmits } from './src/popover'
export type { PopoverProps, PopoverEmits, PopoverPlacement, PopoverTrigger } from './src/popover'