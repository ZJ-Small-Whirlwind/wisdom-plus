// 本地图标node服务地址
export const serverApiUrl =  "http://localhost:81/Dome/Iconfont";

// 获取Api地址
export const getApi = (url:string)=>{
    return `${serverApiUrl}${url}`
}

export type Icon = {
    // 图标id
    id:number
    // 图标svg
    show_svg:string
    // 图标名称
    name:string
    // 图标组件名称
    font_class:string
    // 是否删除图标
    is_delete_wp_icon:string
}

// 获取配置
export const getConfigs = async ()=>(await (await fetch(getApi(`/getConfigs`))).json()).data

// 更新本地图标
export const setConfigs = async (icon)=>await fetch(getApi(`/setConfigs`),{
    method:"post",
    headers:{
        "Content-Type":"application/json; charset=utf-8"
    },
    body:JSON.stringify(icon)
})

// 同步本地图标
export const synchronousConfigs = async ()=> await fetch(getApi(`/synchronousConfigs`))

// 搜索图标
export const searchIcon = async (keyword:string, params?: { [key:string]:any })=>(await (await fetch(getApi(`/search?q=${keyword}&${new URLSearchParams(params || {}).toString()}`))).json()).data
