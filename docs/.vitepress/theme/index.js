import ElementPlus from 'wisdom-plus'

import VPApp, { globals, NotFound } from '../vitepress'

export default {
  NotFound,
  Layout: VPApp,
  logo: '/images/wisdom-plus-logo-small.svg',
  enhanceApp: ({ app }) => {
    app.use(ElementPlus)

    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
}
