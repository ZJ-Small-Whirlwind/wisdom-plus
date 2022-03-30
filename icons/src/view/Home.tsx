import {defineComponent, ref, h, onMounted, nextTick} from "vue"
import {useRoute} from "vue-router"
import {
    WpImage,
    WpInput,
    WpSpin,
    Toast as WpToast,
    WpEllipsis,
    Dialog
} from "@wisdom-plus/components"
import {getConfigs, setConfigs, Icon, synchronousConfigs, searchIcon} from "../../config"

export default defineComponent({
    name:"Home",
    setup(props, {expose}){
        const MyIconList = ref<Array<{
            [key:number]:Icon
        }>>({} as any);
        const IconList = ref<Array<Icon>>([]);
        const loading = ref(false);
        const getMyIconList = async ()=>{
            nextTick(async ()=>{
                MyIconList.value = await getConfigs();
                IconList.value = Object.values(MyIconList.value) as any
            })
        }
        const searchChange = async (search?:string)=>{
            loading.value = true;
            if(search){
                // 搜索图标
                IconList.value = await searchIcon(search);
            }else {
                await getMyIconList();
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
                onCopy(icon.font_class)
                WpToast({
                    message:`已复制`,
                    placement:"top",
                    dark:true
                })
            }else {
                // 添加图标
                loading.value = true;
                await setConfigs(icon);
                await getMyIconList();
                loading.value = false;
                WpToast({
                    message:"保存成功",
                    placement:"top",
                    dark:true
                })
            }
        }
        const delIcon = (icon:Icon, ev:any)=>{
            ev.stopPropagation();
            Dialog({
                title:"删除提示",
                content:`确定删除该【${icon.name}】图标吗`,
            }).then(async ()=>{
                loading.value = true;
                await setConfigs({
                    ...icon,
                    is_delete_wp_icon:true,
                });
                await getMyIconList();
                loading.value = false;
                WpToast({
                    message:"已删除",
                    placement:"top",
                    dark:true
                })
            })
        }

        const synchronousIconConfigs = async ()=>{
            loading.value = true;
            await synchronousConfigs();
            loading.value = false;
            WpToast({
                message:"同步成功",
                placement:"top",
                dark:true
            })
        }

        expose({
            searchChange,
            synchronousIconConfigs,
        })
        onMounted(async ()=>{
            await searchChange();
        })
        return ()=>(<div>
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
