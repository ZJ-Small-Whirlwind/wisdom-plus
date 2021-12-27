import { createApp } from 'vue'
import App from './src/App.vue'
import wisdomPlus from '@wisdom-plus/components'
import '@wisdom-plus/theme-chalk/src/index.scss'

const app = createApp(App)
app
    .use(wisdomPlus)
    .mount('#play')
