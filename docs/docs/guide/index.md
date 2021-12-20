# 快速上手

### 安装

```bash
# 通过 npm 安装
npm i wisdom-plus -S

# 通过 yarn 安装
yarn add wisdom-plus
```

### 引入组件

#### 方式一. babel-plugin-import 自动按需引入组件

##### 使用 Vite 构建的项目

```bash
# 安装 vite-plugin-style-import 插件
# 通过 npm 安装
npm i vite-plugin-style-import -D

# 通过 yarn 安装
yarn add vite-plugin-style-import -D
```

```js
// 配置 vite.config.ts/js
import styleImport from 'vite-plugin-style-import'
export default defineConfig({
    ...
    plugins: [
        styleImport({
            libs: [
                {
                    libraryName: 'wisdom-plus',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `${name}/style/index.js`
                    }
                }
            ]
        }),
    ]
    ...
})
```

##### 使用 Vue-cli 构建的项目

```js
// 在.babelrc 中添加配置
// 注意：webpack 1 无需设置 libraryDirectory
{
    "plugins": [
        ["import", {
            "libraryName": "wisdom-plus",
            "libraryDirectory": "es",
            "style": true
        }]
    ]
}

// 对于使用 babel7 的用户，可以在 babel.config.js 中配置
module.exports = {
    plugins: [
        ['import', {
            libraryName: 'wisdom-plus',
            libraryDirectory: 'es',
            style: true
        }, 'wisdom-plus']
    ]
}
```

配置完成后，可在代码中直接引入 WisdomPlus 组件而无需引入 css

```js
import { WpSpace } from 'wisdom-plus'
```

#### 方式二. 导入所有组件

```js
import Vue from 'vue'
import WisdomPlus from 'wisdom-plus'
import 'wisdom-plus/dist/index.css'

Vue.use(WisdomPlus)
```

```json
// 另外，使用 Volar 的朋友请在 tsconfig.json 中配置，以获得全局的类型提示
"compilerOptions": {
    "types": [
        "wisdom-plus/global"
    ]
}
```
