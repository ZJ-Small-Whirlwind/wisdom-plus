// .vitepress/theme/index.js

import * as components from '@wisdom-plus/components'
import DefaultTheme from 'vitepress/theme'
import 'vitepress-theme-demoblock/theme/styles/index.css'

import '@wisdom-plus/theme-chalk/src/index.scss'

import Demo from 'vitepress-theme-demoblock/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/components/DemoBlock.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    for(const name in components) {
      if (components[name].install) {
        app.component(name, components[name])
      }
    }
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData` is a `ref` of current site-level metadata.
  }
}