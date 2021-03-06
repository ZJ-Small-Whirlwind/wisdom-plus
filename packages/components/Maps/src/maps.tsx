import {defineComponent, ExtractPropTypes, ref, onMounted, computed, createApp, h, watch, nextTick} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
import AMapLoader from "@amap/amap-jsapi-loader"
import {AMapInstance, AMapMap, AMapPluginsMap, Autocomplete, Geocoder, LngLat, PlaceSearch} from "../types/AMap";
import {get, cloneDeep} from "lodash";
import WpSelect from "../../Select";
import WpIcon from "../../Icon";
import {Toast} from "../../Toast";
import Ellipsis from "../../Ellipsis";
import WpButton from "../../Button";
import Draggable from "../../Pro/Cascader/src/draggable/src/vuedraggable";
import { Location, Message, Cellphone, Delete   } from '@element-plus/icons'
export const mapsProps = buildProps({
    config:{type:Object, default:null},
    plugins:{type:Object, default:null},
    mapConfig:{type:Object, default:null},
    showScale:{type:Boolean, default:false},
    autoIp:{type:Boolean, default:false},
    autoGeolocation:{type:[Boolean, Object], default:false},
    menu:{type:Array, default:null},
    autoComplete:{type:Boolean, default:false},
    placeSearch:{type:Boolean, default:false},
    city:{type:String, default:"全国"},
    autoCompleteLabelName:{type:String, default:"name"},
    panel:{type:Boolean, default:false},
    panelList:{type:Array, default:()=>[]},
    panelItemLabelName:{type:String, default:"name"},
})
export type MapsProps = ExtractPropTypes<typeof mapsProps>

export default defineComponent({
    name:"WpMaps",
    props:mapsProps,
    setup(props,{emit}){
        const container:any = ref(null)
        const map = ref<AMapMap>()
        const massage = (message)=>Toast({
            message,
            placement:"top",
            dark:true,
            to:container.value
        })
        const currentPanelList:any = ref([]);
        const setPanelList = ()=>{
            nextTick(()=>{
                currentPanelList.value = cloneDeep(props.panelList)
            })
        }
        const GeocoderServe = ref<Geocoder>();
        const placeSearchServe = ref<PlaceSearch>();
        const autoCompleteServe = ref<Autocomplete>();
        const autoCompleteModelValue = ref();
        const AMapInstance = ref<AMapInstance>()
        const getMapObj = computed<{
            map:AMapMap
            AMap:AMapInstance
        }>(()=>{
            return {
                map:map.value,
                AMap:AMapInstance.value
            } as any
        })
        const createMarker = (config:{
            position:LngLat
        } & Partial<{
            content:any
            showInfoWindow:boolean
        }>)=>{
            const {
                position,
                content,
                showInfoWindow = true,
            } = config;
            //构建自定义信息窗体
            const root = document.createElement("div");
            let infoWindow = new AMap.InfoWindow({
                anchor: 'top-center',
                content: root,
            });
            createApp({
                render(){
                    return h("div",content)
                }
            }).mount(root)
            let newMarker = new getMapObj.value.AMap.Marker({
                map:getMapObj.value.map,
                position
            });
            let isRemove = true
            newMarker.on("click",()=>{
                if(infoWindow.dom.parentNode){
                    isRemove = false;
                    newMarker.remove();
                    newMarker = createMarker(config)
                }else {
                    infoWindow.open(getMapObj.value.map, position);
                }
            })
            const remove = newMarker.remove;
            newMarker.remove = ()=>{
                remove.call(newMarker);
                infoWindow.close();
            }
            infoWindow.on("close", ()=>{
                if(isRemove){
                    remove.call(newMarker);
                }
                isRemove = true;
            })
            if(showInfoWindow){
                infoWindow.open(getMapObj.value.map, position);
            }
            return newMarker;
        }

        const pluginsMap = computed<AMapPluginsMap>(()=>({
            // 地理编码与逆地理编码服务
            "AMap.Geocoder":map=>{
                GeocoderServe.value = new AMap.Geocoder();
            },
            // 标尺
            ...(props.showScale ? {
                'AMap.Scale':(map)=>{
                    map.addControl(new AMap.Scale());
                }
            } : {}),
            // 城市ip自动定位服务
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
            // 自动定位服务
            ...(props.autoGeolocation ? {
                'AMap.Geolocation':map=>{
                    //解析定位结果
                    const onComplete = (data)=> {
                        console.log(data,1111)
                    }
                    //解析定位错误信息
                    const onError = (data)=> {
                        console.log(data,2222)
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
            // 搜索自动填充服务
            ...(props.autoComplete ? {
                'AMap.AutoComplete':(map)=>{
                    autoCompleteServe.value = new AMap.Autocomplete({
                        city: props.city,
                        ...(Object.prototype.toString.call(props.autoComplete) === '[object Object]' ? props.autoComplete : {}) as any
                    });
                }
            } : {}),
            // POI搜索自动填充服务
            ...(props.placeSearch ? {
                'AMap.PlaceSearch':(map)=>{
                    placeSearchServe.value = new AMap.PlaceSearch({
                        city: props.city,
                        extensions:"all",
                        ...(Object.prototype.toString.call(props.placeSearch) === '[object Object]' ? props.placeSearch : {}) as any
                    });
                }
            } : {}),
            // 用户自定义服务
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
                AMapInstance.value = AMap;
                // 实例化
                map.value = new AMap.Map(container.value, {
                    center: [116.397428, 39.90923],
                    zoom: 13,
                    animateEnable:true,
                    ...(props.mapConfig || [])
                });
                // 插件注入
                pluginsNams.value.forEach(key=>{
                    (pluginsMap.value[key] || (()=>{}) as any)(map.value, AMap)
                });
                // 事件注入
                map.value.on("click", (ev)=>{
                    emit('mapClick', ev)
                })
                // 右键菜单
                if(Object.prototype.toString.call(props.menu) === '[object Array]'){
                    const contextMenuPositon = ref()
                    const contextMenu = new AMap.ContextMenu();
                    props.menu.forEach((item, k)=>{
                        contextMenu.addItem(item.content, (ev)=>{
                            if(Object.prototype.toString.call(props.menu) === '[object Array]'){
                                if(Object.prototype.toString.call(item.emit) === '[object Function]') {
                                    item.emit(map.value, {
                                        item, ev,
                                        pos:contextMenuPositon.value
                                    })
                                }else {
                                    emit(item.emit || '', map.value, {
                                        item, ev,
                                        pos:contextMenuPositon.value
                                    })
                                }
                            }
                        }, k)
                    })

                    //地图绑定鼠标右击事件——弹出右键菜单
                    map.value.on('rightclick', function (e) {
                        contextMenu.open(map.value as any, e.lnglat);
                        contextMenuPositon.value = e.lnglat;
                        emit('mapRightclick', e)
                    });
                }
                emit('load',getMapObj.value)
            }).catch(err=>{
                emit('error',err)
            })
        }
        const search = (keywords)=>{
            if(props.autoComplete &&  autoCompleteServe.value){
                return new Promise<any[]>(resolve => {
                    autoCompleteServe.value?.search(keywords, (status, result)=>{
                        emit('searchChange', status, result, getMapObj.value)
                        if(status === 'complete'){
                            resolve(result.tips.map(item=>({
                                label:get(item,props.autoCompleteLabelName),
                                value:item
                            })));
                        }else {
                            resolve([])
                        }
                    })
                })
            }
            if(props.placeSearch && placeSearchServe.value){
                return new Promise<any[]>(resolve => {
                    placeSearchServe.value?.search(keywords, (status, result)=>{
                        emit('searchChange', status, result, getMapObj.value)
                        if(status === 'complete'){
                            resolve(result.poiList.pois.map(item=>({
                                label:get(item,props.autoCompleteLabelName),
                                value:item
                            })));
                        }else {
                            resolve([])
                        }
                        resolve([])
                    })
                })
            }
            return Promise.resolve([])
        }
        watch(computed(()=> props.panelList),()=>{
            setPanelList()
        })
        onMounted(()=>{
            resetMap();
            setPanelList();
        })
        return {
            container,
            map,
            search,
            autoCompleteModelValue,
            getMapObj,
            createMarker,
            currentPanelList,
            GeocoderServe,
            placeSearchServe,
            autoCompleteServe,
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
            <div class={{
                'wp-maps-auto-complete':true
            }}>
                {this.$props.autoComplete || this.$props.placeSearch ? <WpSelect
                    placeholder={"请输入关键词"}
                    filterable
                    clearable
                    v-model={this.autoCompleteModelValue}
                    onChange={(v)=>this.$emit("auto-complete-change", v, this.getMapObj)}
                    PopoverConfig={{
                        popoverClass:"wp-maps-auto-complete-panel"
                    }}
                    v-slots={{
                        default: ({value})=>{
                            return (<div class={{
                                "wp-maps-auto-complete-panel-item":true
                            }}>
                                {this.$slots.autoCompleteItem?.({value}) || [
                                    <div>{value.name}</div>,
                                    value.address ? <div><WpIcon><Location></Location></WpIcon>{typeof value.address === 'string' ? (value.address|| '暂无') : (value.address[0] || '暂无')}</div> : null,
                                    value.tel ? <div><WpIcon><Cellphone></Cellphone></WpIcon>{value.tel}</div> : null,
                                    value.email ? <div><WpIcon><Message></Message></WpIcon>{value.email}</div> : null,
                                ]}
                            </div>)
                        }
                    }}
                    remote={this.search}>
                </WpSelect> : null}
            </div>
            {[
                this.$props.panel ? <div class={{
                    'wp-maps-panel': true
                }}>
                    <div class={{
                        'wp-maps-panel-draggable': true
                    }}>
                        {this.$slots.panel?.() || [
                            <div class={{
                                'wp-maps-panel-draggable-box': true,
                            }}>
                                <Draggable list={this.currentPanelList}
                                           itemKey={()=>{
                                               return Date.now()+Math.random().toString()
                                           }}
                                           animation={400}
                                           v-slots={{
                                               item: ({index, element}) => (
                                                   <div
                                                   key={index}
                                                   class={{
                                                       'wp-maps-panel-draggable-box-item': true
                                                   }}>
                                                       {this.$slots.panelItem?.({index, element}) || ([
                                                           <Ellipsis>{get(element, this.$props.panelItemLabelName)}</Ellipsis>,
                                                           <WpIcon onClick={() => this.currentPanelList.splice(index, 1)}><Delete></Delete></WpIcon>,
                                                       ])}
                                                   </div>)
                                           }}>
                                </Draggable>
                            </div>,
                            <div class={{
                                'wp-maps-panel-box': true,
                                'wp-maps-panel-draggable-footer': true
                            }}>
                                <WpButton onClick={ev=>this.$emit('panel-cancel', {ev})}>取消</WpButton>
                                <WpButton onClick={ev=>this.$emit('panel-confirm', {ev, data:this.currentPanelList})} type='primary'>确定</WpButton>
                            </div>
                        ]}
                    </div>
                </div> : null
            ]}
        </div>)
    }
})
