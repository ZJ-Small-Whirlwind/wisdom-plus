import { withInstall } from '@wisdom-plus/utils/with-install'
import Statistic from './src/statistic'

export const WpStatistic = withInstall(Statistic)
export default WpStatistic

export { statisticProps } from './src/statistic'
export type { StatisticProps } from './src/statistic'