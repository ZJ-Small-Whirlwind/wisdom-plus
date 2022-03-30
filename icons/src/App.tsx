import {defineComponent, ref, h, onMounted} from "vue"
import {
    WpImage,
    WpInput,
    WpSpin,
    Toast as WpToast,
    WpEllipsis,
    Dialog
} from "@wisdom-plus/components"
import logo from "../../wisdom-plus.png"
import * as console from "console";
type Icon = {
    id:number
    show_svg:string
    name:string
    font_class:string
}
export default defineComponent({
    name:"App",
    setup(){
        const api = "http://localhost:81/Dome/Iconfont";
        const getApi = (url:string)=>{
            return `${api}${url}`
        }
        const search = ref("");
        const MyIconList = ref<Array<{
            [key:number]:Icon
        }>>({} as any);
        const IconList = ref<Array<Icon>>([]);
        const loading = ref(false);
        const getMyIconList = async ()=>{
            MyIconList.value = (await (await fetch(getApi(`/getConfigs`))).json()).data;
        }
        const searchChange = async ()=>{
            loading.value = true;
            if(search.value){
                // 搜索图标
                IconList.value = (await (await fetch(getApi(`/search?search=${search.value}`))).json()).data;
            }else {
                await getMyIconList();
                IconList.value = Object.values(MyIconList.value) as any
            }
            loading.value = false;
        }
        const onCopy = function (text) {
            const callback = function (e) {
                e.preventDefault();
                if (e.clipboardData) {
                    e.clipboardData.setData('text/plain', text);
                } else {
                    // @ts-ignore
                    if (window.clipboardData) {
                        // @ts-ignore
                        window.clipboardData.setData('Text', text);
                    }
                }
            }
            window.addEventListener('copy', callback);
            document.execCommand('copy');
            window.removeEventListener('copy', callback);
        }
        const IconClick = async (icon:Icon)=>{
            if(MyIconList.value[icon.id]){
                // 我的图标
                onCopy(icon.font_class.toUpperCase())
                WpToast({
                    message:`已复制`,
                    placement:"top",
                    dark:true
                })
            }else {
                // 添加图标
                loading.value = true;
                await fetch(getApi(`/setConfigs`),{
                    method:"post",
                    headers:{
                        "Content-Type":"application/json; charset=utf-8"
                    },
                    body:JSON.stringify(icon)
                })
                await getMyIconList();
                loading.value = false;
                WpToast({
                    message:"保存成功",
                    placement:"top",
                    dark:true
                })
            }
        }
        const delIcon = (icon:Icon, ev:PointerEvent)=>{
            ev.stopPropagation();
            Dialog({
                title:"删除提示",
                content:`确定删除该【${icon.name}】图标吗`,
            }).then(async ()=>{
                loading.value = true;
                await fetch(getApi(`/setConfigs`),{
                    method:"post",
                    headers:{
                        "Content-Type":"application/json; charset=utf-8"
                    },
                    body:JSON.stringify({
                        ...icon,
                        is_delete_wp_icon:true,
                    })
                })
                await getMyIconList();
                loading.value = false;
                WpToast({
                    message:"已删除",
                    placement:"top",
                    dark:true
                })
            })
        }
        onMounted(async ()=>{
            await getMyIconList();
            await searchChange();
        })
        return ()=>(<div class={{
            "icons-main":true
        }}>
            <div class={{
                "icons-main-header":true
            }}>
                <WpImage class={'logo'} src={logo}></WpImage>
                <div class="search">
                    <WpInput placeholder={'搜索图标'}
                             clearable
                             v-model={search.value}
                             onKeyup={e=>e.code === 'Enter' ? searchChange() : null}
                             onClear={searchChange}
                    ></WpInput>
                </div>
                <div class={"navs"}>
                    <div>中文</div>
                    <div>帮助文档</div>
                </div>
            </div>
            {loading.value ? <WpSpin></WpSpin> : null}
            <div class={"icons-container"}>
                {IconList.value.map((item)=>(<div
                    onClick={()=>IconClick(item)}
                    class={{
                    "icons-container-item":true,
                    "icons-container-item-active":MyIconList.value[item.id],
                }}>
                    {h("div", {
                        class:"icons-container-item-icon",
                        innerHTML:item.show_svg
                    })}
                    <div class={{
                        "icons-container-item-icon-name": true,
                    }}><WpEllipsis>{item.name}</WpEllipsis></div>
                    <div class={{
                        "icons-container-item-icon-name": true,
                    }}><WpEllipsis>({item.font_class})</WpEllipsis></div>
                    {MyIconList.value[item.id] ?
                        [
                            <div class={{
                                "icons-container-item-action": true,
                            }}>复制图标名称</div>,
                            <div class={{
                                "icons-container-item-operate": true,
                            }}>
                                <span onClick={(ev)=>delIcon(item,ev)}>删除图标</span>
                            </div>
                        ]
                        :
                        <div class={{
                            "icons-container-item-action": true,
                        }}>保存图标</div> }
                </div>))}
                {IconList.value.length === 0 ? <div class={'notSearchResult'}>暂无数据！</div> : null}
            </div>
        </div>)
    }
})
