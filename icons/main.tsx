import {createApp} from "vue"
import "./style.scss"
import "@wisdom-plus/theme-chalk/src/index.scss"
// import wisdomPlus from "@wisdom-plus/components"
import App from "./src/App"
createApp(App)
    // .use(wisdomPlus)
    .mount("#app")
