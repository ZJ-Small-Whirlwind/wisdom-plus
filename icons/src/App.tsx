import {defineComponent, onMounted, ref, h, provide} from "vue"
import {Toast as WpToast, WpImage, WpInput, WpSpin} from "@wisdom-plus/components";
import logo from "../../wisdom-plus.png";
import {synchronousConfigs} from "../config";
import {useRoute} from "vue-router";

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
                {this.$route.path === '/' ? <div class="search">
                    <WpInput placeholder={'搜索图标'}
                             clearable
                             v-model={this.search}
                             onKeyup={e => e.code === 'Enter' ? this.searchChange() : null}
                             onClear={this.searchChange}
                    ></WpInput>
                </div> : null}
                <div class={"navs"}>
                    {this.$route.path === '/' ? <div onClick={this.synchronousIconConfigs}>本地同步</div> : <div  onClick={()=>this.$router.push("/")}>首页</div>}
                    <div onClick={()=>this.$router.push("/help")}>帮助说明</div>
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
