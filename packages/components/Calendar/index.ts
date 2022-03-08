import { withInstall } from '@wisdom-plus/utils/with-install'
import Calendar from './src/calendar'

export const WpCalendar = withInstall(Calendar, )
export default WpCalendar

export {calendarProps} from './src/calendar'

export type {CalendarProps} from './src/calendar'
