import { withInstall } from '@wisdom-plus/utils/with-install'
import TagInput from './src/tagInput'

export const WpTagInput = withInstall(TagInput)
export default WpTagInput

export { tagInputProps, tagInputEmits } from './src/tagInput'
export type { TagInputProps } from './src/tagInput'