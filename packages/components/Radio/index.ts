import { withInstall } from '@wisdom-plus/utils/with-install'
import Radio from './src/radio'
import RadioGroup from './src/radioGroup'

export const WpRadio = withInstall(Radio)
export const WpRadioGroup = withInstall(RadioGroup)
export default WpRadio

export * from './src/radio'
export * from './src/radioGroup'