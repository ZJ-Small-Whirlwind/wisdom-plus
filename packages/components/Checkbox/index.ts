import { withInstall } from '@wisdom-plus/utils/with-install'
import Checkbox from './src/checkbox'
import CheckboxGroup from './src/checkboxGroup'

export const WpCheckbox = withInstall(Checkbox)
export const WpCheckboxGroup = withInstall(CheckboxGroup)
export default WpCheckbox

export * from './src/checkbox'
export * from './src/checkboxGroup'