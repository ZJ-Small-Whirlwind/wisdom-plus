import { withInstall } from '@wisdom-plus/utils/with-install'
import Progress from './src/progress'

export const WpProgress = withInstall(Progress)
export default WpProgress

export { progressProps } from './src/progress'
export type { ProgressProps } from './src/progress'