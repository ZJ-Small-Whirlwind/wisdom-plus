import {defineComponent, ExtractPropTypes} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
export const mapsProps = buildProps({

})
export type MapsProps = ExtractPropTypes<typeof mapsProps>
export default defineComponent({
    name:"WpMaps",
    props:mapsProps,
    render(){
        return (<div>
            asdas
        </div>)
    }
})
