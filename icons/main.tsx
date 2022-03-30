import {createApp} from "vue"
import "./style.scss"
import "@wisdom-plus/theme-chalk/src/index.scss"
import route from "./src/router"
import App from "./src/App"
import "github-markdown-css/github-markdown-light.css"
createApp(App)
    .use(route)
    .mount("#app")
