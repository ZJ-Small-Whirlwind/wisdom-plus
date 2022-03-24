import { withInstall } from '@wisdom-plus/utils/with-install'
import Timeline from './src/timeline'
import TimelineItem from './src/timelineItem'

export const WpTimeline = withInstall(Timeline)
export const WpTimelineItem = withInstall(TimelineItem)
export default WpTimeline

export * from './src/timeline'
export * from './src/timelineItem'