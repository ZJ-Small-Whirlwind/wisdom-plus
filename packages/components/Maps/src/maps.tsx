import {defineComponent, ExtractPropTypes, ref, onMounted, computed} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
import AMapLoader from "@amap/amap-jsapi-loader"
import {AMapInstance, AMapPluginsMap} from "../types/AMap";
import {Toast} from "../../Toast";
export const mapsProps = buildProps({
    config:{type:Object, default:null},
    plugins:{type:Object, default:null},
    mapConfig:{type:Object, default:null},
    showScale:{type:Boolean, default:false},
    autoIp:{type:Boolean, default:false},
    autoGeolocation:{type:[Boolean, Object], default:false},
})
export type MapsProps = ExtractPropTypes<typeof mapsProps>

export default defineComponent({
    name:"WpMaps",
    props:mapsProps,
    setup(props){
        const container:any = ref(null)
        const map = ref<any>()
        const massage = (message)=>Toast({
            message,
            placement:"top",
            dark:true,
            to:container.value
        })
        const pluginsMap = computed<AMapPluginsMap>(()=>({
            ...(props.showScale ? {
                'AMap.Scale':(map)=>{
                    map.addControl(new AMap.Scale());
                }
            } : {}),
            ...(props.autoIp ? {
                'AMap.CitySearch':map=>{
                    var citysearch = new AMap.CitySearch();
                    citysearch.getLocalCity((status, result)=> {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.city && result.bounds) {
                                map.setBounds(result.bounds);
                                massage("位置获取成功")
                            }
                        } else {
                            massage("位置获取失败："+result.message)
                        }
                    })
                },
            } : {}),
            ...(props.autoGeolocation ? {
                'AMap.Geolocation':map=>{
                    //解析定位结果
                    const onComplete = (data)=> {
                        console.log(data,1111)
                        // document.getElementById('status').innerHTML='定位成功'
                        // var str = [];
                        // str.push('定位结果：' + data.position);
                        // str.push('定位类别：' + data.location_type);
                        // if(data.accuracy){
                        //     str.push('精度：' + data.accuracy + ' 米');
                        // }//如为IP精确定位结果则没有精度信息
                        // str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                        // document.getElementById('result').innerHTML = str.join('<br>');
                    }
                    //解析定位错误信息
                    const onError = (data)=> {
                        console.log(data,2222)
                        // document.getElementById('status').innerHTML='定位失败'
                        // document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message+'</br>浏览器返回信息：'+data.originMessage;
                    }
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy:true,
                        timeout:0,
                        ...(Object.prototype.toString.call(props.autoGeolocation) === '[object Object]' ? props.autoGeolocation : {}) as any
                    });
                    map.addControl(geolocation);
                    geolocation.getCurrentPosition((status,result)=>{
                        if(status ==='complete'){
                            massage("位置获取成功")
                            onComplete(result)
                        }else{
                            massage("位置获取失败："+result.message)
                            onError(result)
                        }
                    });
                },
            } : {}),
            ...(props.plugins || {})
        }))
        const pluginsNams = computed(()=>Object.keys(pluginsMap.value))
        const resetMap = ()=>{
            AMapLoader.load({
                key:"392d52cc1535e162f0eba5b118cd1c49",
                version: "2.0",
                ...(props.config || {}),
                plugins: pluginsNams.value,
            }).then((AMap:AMapInstance)=>{
                map.value = new AMap.Map(container.value, {
                    center: [116.397428, 39.90923],
                    zoom: 13,
                    ...(props.mapConfig || [])
                });
                pluginsNams.value.forEach(key=>{
                    (pluginsMap.value[key] || (()=>{}) as any)(map.value, AMap)
                })
            })
        }
        onMounted(()=>{
            resetMap();
        })
        return {
            container,
            map
        }
    },
    render(){
        return (<div class={{
            'wp-maps':true
        }}>
            <div class={{
                'wp-maps-container': true
            }} ref="container"/>
            <div class="wp-maps-copyright">© 版权所有： Wisdom Plus</div>
        </div>)
    }
})