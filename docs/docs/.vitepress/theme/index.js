// .vitepress/theme/index.js
import wisdomPlus from '@wisdom-plus/components'
import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'

import '@wisdom-plus/theme-chalk/src/index.scss'

import '../styles/common.css'

import Demo from 'vitepress-theme-demoblock/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/components/DemoBlock.vue'
export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.config.errorHandler = (err)=> {
        if(!new RegExp([
            "document.*is.*not.*defined",
            "reading.*isCE",
            "Image is not defined",
            "Cannot destructure property",
            "window is not defined",
        ].join("|")).test(err.message)){
            console.log(err.message)
        }
    };
    // app.config.warnHandler = ()=> null;
    app.use(wisdomPlus)
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData` is a `ref` of current site-level metadata.
  }
}
