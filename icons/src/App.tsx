import {defineComponent, onMounted, ref, h, provide} from "vue"
import {Toast as WpToast, WpImage, WpInput, WpSpin} from "@wisdom-plus/components";
import logo from "../../wisdom-plus.png";
import {synchronousConfigs} from "../config";

export default defineComponent({
    name:"App",
    setup(){
        const search = ref("");
        const loading = ref(false);
        const route = ref(null)
        const searchChange = async ()=>{
            route.value.searchChange()
        }
        const synchronousIconConfigs = async ()=>{
            route.value.synchronousIconConfigs()
        }
        provide("search",search)
        return {
            search,
            searchChange,
            synchronousIconConfigs,
            route,
            loading,
        }
    },
    render(){
        return (<div class={{
            "icons-main":true
        }}>
            <div class={{
                "icons-main-header": true
            }}>
                <WpImage class={'logo'} src={logo}></WpImage>
                <div class="search">
                    <WpInput placeholder={'搜索图标'}
                             clearable
                             v-model={this.search}
                             onKeyup={e => e.code === 'Enter' ? this.searchChange() : null}
                             onClear={this.searchChange}
                    ></WpInput>
                </div>
                <div class={"navs"}>
                    <div onClick={this.synchronousIconConfigs}>本地同步</div>
                </div>
            </div>
            <router-view v-slots={{
                default:({Component})=>h(Component || 'div', {
                    ref:"route",
                    props:{
                        search:this.search
                    }
                })
            }}></router-view>
        </div>)
    }
})
