import { withInstall } from '@wisdom-plus/utils/with-install'
import Editor from './src/editor'

export const WpProEditor = withInstall(Editor)
export default WpProEditor

export * from './src/editor'