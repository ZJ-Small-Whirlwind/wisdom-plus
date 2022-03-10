import { buildProps } from "@wisdom-plus/utils/props"
import { ExtractPropTypes, ToRefs } from "vue"

export const configProviderProps = buildProps({
    isMobileDevice: Boolean
})

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>

export type WpConfig = ToRefs<Readonly<Partial<ConfigProviderProps>>>