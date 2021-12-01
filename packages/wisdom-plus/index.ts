import installer from './defaults'
export * from '@wisdom-plus/components'
export * from '@wisdom-plus/directives'
export * from '@wisdom-plus/hooks'
export * from '@wisdom-plus/tokens'

export { default as makeInstaller } from './make-installer'
export { default } from './defaults'

export const install = installer.install
export const version = installer.version
