
interface AMapMapOptions {
    [key:string]:any
    center:number[]
    zoom:number;
}

class AMapMap{
    constructor(el:any, opts:Partial<AMapMapOptions>) {}
    addControl(obj:any){}
    setBounds(Bounds:Bounds){}
}

class Scale {
    constructor() {}
}
class CitySearch {
    getLocalCity(callback:(status:'complete' | 'error',result: {
        [key:string]:any;
        adcode:string
        bounds:Bounds
        city:string
        info:'ok'|'OK';
        infocode:string
        province:string
        rectangle:string
        status:string
    })=>void)
}
class Bounds {
    className:string
    northEast:LngLat;
    southWest:LngLat;
}
class LngLat {
    className:string
    KL:number;
    kT:number;
    lat:number;
    lng:number;
    pos:number[];
}
interface GeolocationOptions {
    enableHighAccuracy:boolean;
    timeout:number;
    noIpLocate:number;
    noGeoLocation:number;
    GeoLocationFirst:boolean;
    maximumAge:number;
    convert:boolean;
    showButton:boolean;
    buttonPosition:string;
    buttonOffset:Pixel;
    showMarker:boolean;
    markerOptions:markerOptions;
    showCircle:boolean;
    circleOptions:circleOptions;
    panToLocation:boolean;
    zoomToAccuracy:boolean;
    useNative:boolean;
    extensions:string;
}

class Geolocation {
    constructor(GeolocationOptions:GeolocationOptions) {}
    getCurrentPosition(callback:(status:'complete' | 'error', result:{
        [key:string]:any;
        position:LngLat
        accuracy:number
        location_type:string
        message:string
        isConverted:boolean
        info:string
        addressComponent:AddressComponent
        formattedAddress:string
        pois:any[]
        roads:any[]
        crosses:any[]
    })=>void)
}
export type AMapPluginsMapKeys = `AMap.${keyof AMapInstance}` | keyof AMapInstance;
export type AMapPluginsMapValue = (map:AMapMap, AMapInstance:AMapInstance)=>any
export type AMapPluginsMap =  Partial<{ [key in AMapPluginsMapKeys]:AMapPluginsMapValue }>
export interface AMapInstance{
    Map:typeof AMapMap
    Scale:typeof Scale
    CitySearch:typeof CitySearch
    Bounds:typeof Bounds
    LngLat:typeof LngLat
    Geolocation:typeof Geolocation
}

declare global {
    export const AMap:AMapInstance;
}
