import type { ComponentSize } from './types'
import { WpConfig } from '../components/ConfigProvider/src/utils'
import { inject } from 'vue'

export interface InstallOptions {
  size: ComponentSize
  zIndex: number
  locale?: any
}

let $ELEMENT = {} as InstallOptions

const setConfig = (option: InstallOptions): void => {
  $ELEMENT = option
}

const getConfig = (key: keyof InstallOptions): unknown => {
  return $ELEMENT[key]
}

export const configSymbol = Symbol('config')

const useConfig = () => {
  const config = inject<WpConfig>(configSymbol)
  return config
}

export { getConfig, setConfig, useConfig }
