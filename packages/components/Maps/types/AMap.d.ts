export type StatusType = "complete" | 'error' | 'no_data';
export interface AMapMapOptions {
    [key:string]:any
    center:number[]
    zoom:number;
}
export interface AMapMapEventClick {
    lnglat:LngLat;
    pixel:Pixel;
    pos:number[];
    originEvent:{
        lnglat:LngLat;
        pixel:Pixel;
    } & MouseEvent;
    target:any;
    type:"click"
}

export interface AMapMapEventHotspotclick {
    typs:string;
    lnglat:LngLat;
    name:string;
    id:string;
}

export interface AMapMapEventMap {
    "click":AMapMapEventClick
    "dblclick":AMapMapEventClick
    "mousemove":AMapMapEventClick
    "mousewheel":AMapMapEventClick
    "mouseover":AMapMapEventClick
    "mouseout":AMapMapEventClick
    "mouseup":AMapMapEventClick
    "mousedown":AMapMapEventClick
    "rightclick":AMapMapEventClick
    "touchstart":AMapMapEventClick
    "touchend":AMapMapEventClick
    "complete":unknown
    "mapmove":unknown
    "movestart":unknown
    "moveend":unknown
    "zoomchange":unknown
    "zoomstart":unknown
    "zoomend":unknown
    "dragstart":unknown
    "dragging":unknown
    "dragend":unknown
    "resize":unknown
    "hotspotclick": AMapMapEventHotspotclick
    "hotspotover": AMapMapEventHotspotclick
    "hotspotout": AMapMapEventHotspotclick
}
export class Circle {
    constructor(CircleOptions:Partial<CircleOptions>) {
    }
}
export interface Circle {}
export class PolylineOptions {
    constructor(PolylineOptions:Partial<PolylineOptions>) {
    }
}
export interface Polyline {}
export class Polygon {
    constructor(PolygonOptions:Partial<PolygonOptions>) {
    }
}
export interface PolygonOptions {}
export interface overlayersMap {
    "marker":Marker
    "circle":Circle
    "polyline":Polyline
    "polygon":Polygon
}

export class AMapMap{
    constructor(el:any, opts:Partial<AMapMapOptions>) {}
    addControl(obj:any){}
    setBounds(Bounds:Bounds){}
    add(overlayers:any[] | any){}
    remove(overlayers:any[] | any){}
    getAllOverlays<K extends keyof overlayersMap>(type?:K): overlayersMap[K]
    on<K extends keyof AMapMapEventMap>(type:K, callback:(ev:AMapMapEventMap[K])=>any, context?:any){}
}

// https://lbs.amap.com/api/javascript-api/reference/overlay#marker
export class Marker {
    constructor(MarkerOptions:Partial<MarkerOptions>) {
    }
}

export class Size {
    constructor(public width:Number, public height:Number) {
    }
    getWidth():number;
    getHeight():number;
    toString():string;
}



export class Icon {
    constructor(IconOptions:Partial<IconOptions>) {
    }
    getImageSize():Size
    setImageSize(size:Size):void
}

export interface IconOptions {
    size:Size;
    imageOffset:Pixel;
    image:string;
    imageSize:Size
}

export interface MarkerOptions {
    map:AMapMap;
    position:LngLat
    anchor:string
    offset:Pixel
    icon:Icon | string
    content:object | string
}

export class Pixel {
    constructor(public x:number,public y:number) {
    }
    getX():number
    getY():number
    equals(point:Pixel):boolean
    toString():string
}

export class Scale {
    constructor() {}
}
export class CitySearch {
    getLocalCity(callback:(status:StatusType,result: {
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
export class Bounds {
    className:string
    northEast:LngLat;
    southWest:LngLat;
}
export class LngLat {
    className:string
    KL:number;
    kT:number;
    lat:number;
    lng:number;
    pos:number[];
}
export interface GeolocationOptions {
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

export class Geolocation {
    constructor(GeolocationOptions:GeolocationOptions) {}
    getCurrentPosition(callback:(status:StatusType, result:{
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

export class ContextMenu {
    constructor(ContextMenuOptions?:Partial<ContextMenuOptions>) {
    }
    addItem(text:string, callback:(ev:any)=>void, num:Number)
    removeItem(text:string, callback:(ev:any)=>void)
    open(map:AMapMap,position:LngLat):void
    close():void
}

export interface ContextMenuOptions {
    position:LngLat;
    content:string| HTMLElement
    width:number;
}

export class Autocomplete {
    constructor(AutocompleteOptions:Partial<AutocompleteOptions>) {
    }
    search(keyword:string, callback:(status:StatusType, result:{
        count:number;
        info:"OK"|'ok';
        tips:AutocompleteSearchTipsItem[]
    })=>void):void
    setType(type:string):void
    setCity(city:string):void
    setCityLimit(isLimit:boolean):void
}

export interface AutocompleteSearchTipsItem {
    adcode:string;
    address:string;
    city:any[];
    district:string;
    id:string;
    location:LngLat;
    name:string;
    typecode:string;
}

export interface AutocompleteOptions {
    type:string;
    city:string;
    datatype:string;
    citylimit:boolean;
    input:string | HTMLElement;
    output:string | HTMLElement;
    outPutDirAuto:boolean;
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
    Pixel:typeof Pixel
    Icon:typeof Icon
    Size:typeof Size
    Marker:typeof Marker
    Circle:typeof Circle
    Polyline:typeof Polyline
    Polygon:typeof Polygon
    ContextMenu:typeof ContextMenu
    Autocomplete:typeof Autocomplete
}

declare global {
    export const AMap:AMapInstance;
}
