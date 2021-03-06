import { setConfig } from '@wisdom-plus/utils/config'
import { LocaleInjectionKey, localeProviderMaker } from '@wisdom-plus/hooks'
import { version } from './version'

import type { App, Plugin } from 'vue'
import type { ComponentSize } from '@wisdom-plus/utils/types'
import type { InstallOptions } from '@wisdom-plus/utils/config'

const makeInstaller = (components: Plugin[] = []) => {
  const apps: App[] = []

  const install = (app: App, opts: InstallOptions) => {
    const defaultInstallOpt: InstallOptions = {
      size: '' as ComponentSize,
      zIndex: 2000,
    }

    const option = Object.assign(defaultInstallOpt, opts)
    if (apps.includes(app)) return
    apps.push(app)

    components.forEach((c) => {
      app.use(c)
    })

    if (option.locale) {
      const localeProvides = localeProviderMaker(opts.locale)
      app.provide<any>(LocaleInjectionKey, localeProvides)
    }

    app.config.globalProperties.$ELEMENT = option
    // app.provide() ? is this better? I think its not that flexible but worth implement
    setConfig(option)
  }

  return {
    version,
    install,
  }
}

export default makeInstaller
