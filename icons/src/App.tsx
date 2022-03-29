import {defineComponent, ref, h} from "vue"
import {
    WpImage,
    WpInput,
    WpSpin
} from "@wisdom-plus/components"
import logo from "../../wisdom-plus.png"
export default defineComponent({
    name:"App",
    setup(){
        const search = ref("删除");
        const IconList = ref<Array<{
            show_svg:string
        }>>([]);
        const loading = ref(false);
        const searchChange = async ()=>{
            loading.value = true;
            if(search.value){
                IconList.value = (await (await fetch(`http://localhost:81/Dome/Iconfont/search?search=${search.value}`)).json()).data;
            }else {
                // console.log((await (await fetch(`http://localhost:81/Dome/Iconfont/getConfigs`)).json()).data)
            }
            loading.value = false;
        }
        searchChange()
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
                             onClear={searchChange()}
                    ></WpInput>
                </div>
                <div class={"navs"}>
                    <div>中文</div>
                    <div>帮助文档</div>
                </div>
            </div>
            {loading.value ? <WpSpin></WpSpin> : null}
            <div class={"icons-container"}>
                {IconList.value.map((item)=>(<div class={{
                    "icons-container-item":true,
                    // "icons-container-item-active":true,
                }}>
                    {h("div", {
                        class:"icons-container-item-icon",
                        innerHTML:item.show_svg
                    })}
                    <div class={{
                        "icons-container-item-action":true,
                    }}>保存图标</div>
                </div>))}
                {IconList.value.length === 0 ? <div class={'notSearchResult'}>暂无数据！</div> : null}
            </div>
        </div>)
    }
})
