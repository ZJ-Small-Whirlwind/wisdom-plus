import {defineConfig} from "vite"
import vue from '@vitejs/plugin-vue'
import jsx from "@vitejs/plugin-vue-jsx"
import Markdown from "vite-plugin-md"
export default defineConfig({
    plugins:[
        vue({
            include: [/\.vue$/, /\.md$/],
        }),
        jsx(),
        Markdown()
    ],
    server:{
        port:3002
    }
})
