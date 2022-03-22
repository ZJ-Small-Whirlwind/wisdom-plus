import {defineComponent, ExtractPropTypes, ref, onMounted} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
import AMapLoader from "@amap/amap-jsapi-loader"
export const mapsProps = buildProps({

})
export type MapsProps = ExtractPropTypes<typeof mapsProps>
export default defineComponent({
    name:"WpMaps",
    props:mapsProps,
    setup(){
        const container:any = ref(null)
        const map:any = ref(null)
        onMounted(()=>{
            AMapLoader.load({
                key:"392d52cc1535e162f0eba5b118cd1c49",
                version: "2.0",
                plugins: ['AMap.Scale','s'],
            }).then(AMap=>{
                map.value = new AMap.Map(container.value);
                map.value.addControl(new AMap.Scale());
            })
        })
        return {
            container,
        }
    },
    render(){
        return (<div class={{
            'wp-maps':true
        }}>
            <div class={{
                'wp-maps-container': true
            }} ref="container"/>
        </div>)
    }
})
