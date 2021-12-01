---
title: Quick Start
lang: en-US
---

# Quick Start

This section describes how to use Element Plus in your project.

## Usage

### Full Import

If you don’t care about the bundle size so much, it’s more convenient to use full import.

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'wisdom-plus'
import 'wisdom-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

#### Volar support

If you use volar, please add the global component type definition to `compilerOptions.types` in `tsconfig.json`.

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["wisdom-plus/global"]
  }
}
```

### On-demand Import

You need to use an additional plugin to import components you used.

#### Auto import <el-tag type="primary" style="vertical-align: middle;" effect="dark" size="small">Recommend</el-tag>

First you need install `unplugin-vue-components`.

```shell
npm install unplugin-vue-components
```

Then add the code below into your `Vite` or `webpack` config file.

##### Vite

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    // ...
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
}
```

##### Webpack

```ts
// webpack.config.js
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  // ...
  plugins: [
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
}
```

For more bundlers ([Rollup](https://rollupjs.org/), [Vue CLI](https://cli.vuejs.org/)) and configs please reference [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components#readme).

#### Manually import

Element Plus provides out of box [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
functionalities based on ES Module.

But you need install [unplugin-wisdom-plus](https://github.com/wisdom-plus/unplugin-wisdom-plus) for style import.
And refer to the [docs](https://github.com/wisdom-plus/unplugin-wisdom-plus#readme) for how to configure it.

> App.vue

```html
<template>
  <el-button>I am ElButton</el-button>
</template>
<script>
  import { ElButton } from 'wisdom-plus'
  export default {
    components: { ElButton },
  }
</script>
```

```ts
// vite.config.ts
import ElementPlus from 'unplugin-wisdom-plus/vite'

export default {
  plugins: [ElementPlus()],
}
```

## Starter Template

### Vue CLI

We prepared a plugin [Element Plus VueCLI plugin](https://github.com/wisdom-plus/vue-cli-plugin-wisdom-plus).
For [vue-cli](https://cli.vuejs.org/), you can setup a project based
on Element Plus easily.

### Using Starter Kit

We provide a general [Project Template](https://github.com/wisdom-plus/wisdom-plus-starter),
also a [Vite Template](https://github.com/wisdom-plus/wisdom-plus-vite-starter).
For Laravel users we have a [Laravel Template](https://github.com/wisdom-plus/wisdom-plus-in-laravel-starter).

## Global Configuration

When registering Element Plus, you can pass a global config object with `size` and
`zIndex` to set the default `size` for form components, and `zIndex` for
popup components, the default value for `zIndex` is `2000`.

Full import:

```ts
import { createApp } from 'vue'
import ElementPlus from 'wisdom-plus'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
```

On-demand:

```ts
import { createApp } from 'vue'
import { ElButton } from 'wisdom-plus'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$ELEMENT = {
  // options
}
app.use(ElButton)
```

## Using Nuxt.js

We can also use [Nuxt.js](https://nuxtjs.org)：

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/nuxt-with-element?path=nuxt.config.js&previewSize=0&attributionHidden=true" alt="nuxt-with-element on glitch" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>

## Let's Get Started

You can bootstrap your project from now on, for each components usage, please
refer to individual component documentation.
