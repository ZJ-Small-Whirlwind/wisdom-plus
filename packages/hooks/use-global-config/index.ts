import { inject } from 'vue'
import { configProviderContextKey } from '@wisdom-plus/tokens'
import type { ConfigProvdierContext } from '@wisdom-plus/tokens'

const defaultConfig: ConfigProvdierContext = {
  button: {
    autoInsertSpace: false,
  },
}

export const useGlobalConfig = () => {
  return inject(configProviderContextKey, defaultConfig)
}
