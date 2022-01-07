import { withInstall } from '@wisdom-plus/utils/with-install'
import Tree from './src/tree'

export const WpTree = withInstall(Tree)
export default WpTree

export { treeProps } from './src/tree'
export type { TreeProps } from './src/tree'
export * from './src/interface'