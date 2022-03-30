import {createRouter, createWebHashHistory} from "vue-router"
export default createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            name:"首页",
            component:()=>import("../view/Home")
        },
        {
            path:"/help",
            name:"帮助说明",
            component:()=>import("../view/Help.md")
        }
    ],
})
