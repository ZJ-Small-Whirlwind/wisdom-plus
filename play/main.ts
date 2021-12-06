import { createApp } from 'vue'
import App from './src/App.vue'
import {WpIcon,WpButton} from '@wisdom-plus/components'
import '@wisdom-plus/theme-chalk/src/index.scss'

const app = createApp(App)

app
    .use(WpButton)
    .use(WpIcon)
    .mount('#play')
