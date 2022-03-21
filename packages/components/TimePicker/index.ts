import { withInstall } from '@wisdom-plus/utils/with-install'
import TimePanel from './src/timePanel'
import TimePicker from './src/timePicker'

export const WpTimePanel = withInstall(TimePanel)
export const WpTimePicker = withInstall(TimePicker)
export default WpTimePicker

export * from './src/timePanel'
export * from './src/timePicker'
