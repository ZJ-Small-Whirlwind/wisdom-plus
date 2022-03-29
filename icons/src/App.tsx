import {defineComponent, ref} from "vue"
import {
    WpImage,
    WpInput,
} from "@wisdom-plus/components"
import logo from "../../wisdom-plus.png"
export default defineComponent({
    name:"App",
    setup(){
        const search = ref()
        const searchChange = async v=>{
            const res = await fetch("https://www.iconfont.cn/api/icon/search.json", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-csrf-token": "r7Gi4zWH1coRREauhymRcF2K",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.iconfont.cn/search/index?searchType=icon&q=%E5%88%A0%E9%99%A4",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "q=%E5%88%A0%E9%99%A4&sortType=updated_at&page=1&pageSize=54&fromCollection=-1&fills=&t=1648521786575&ctoken=r7Gi4zWH1coRREauhymRcF2K",
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            console.log(res)
        }
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
                             onInput={searchChange}
                             onClear={searchChange}
                    ></WpInput>
                </div>
                <div class={"navs"}>
                    <div>中文</div>
                    <div>帮助文档</div>
                </div>
            </div>
        </div>)
    }
})
