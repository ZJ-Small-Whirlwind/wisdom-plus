import * as wisdomPlusComponents  from "./index";
import {Plugin} from "vue"

export default <Plugin>{
    install:(app)=>{
        for(const name in wisdomPlusComponents) {
            if (name.toLowerCase() !== 'default' && wisdomPlusComponents[name].install) {
                app.use(wisdomPlusComponents[name])
            }
        }
    }
}

export * from './Button'
export * from './Icon'
export * from './Space'
export * from './Grid'
export * from './GridItem'
export * from './CollapseTransition'
export * from './Collapse'
export * from './CollapseItem'
export * from './Popover'
export * from './Tooltip'
export * from './Menu'
export * from './ScrollList'
export * from './Ellipsis'
export * from './Statistic'
export * from './Overlay'
export * from './Modal'
export * from './PopConfirm'
export * from './Dropdown'
export * from './ActionSheet'
export * from './Toast'
export * from './Badge'
export * from './Tag'
export * from './TagInput'
export * from './Layout'
export * from './Breadcrumb'
export * from './Avatar'
export * from './VirtualList'
export * from './Progress'
export * from './Checkbox'
export * from './Radio'
export * from './Image'
export * from './Tree'
export * from './XScroll'
export * from './Table'
export * from './Upload'
export * from './CountTo'
export * from './Pagination'