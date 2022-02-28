import { ref, unref, inject, computed } from 'vue'
import { elFormItemKey, elFormKey } from '@wisdom-plus/tokens'
import { buildProp, componentSize } from '@wisdom-plus/utils/props'
import { useProp } from '../use-prop'
import { useGlobalConfig } from '../use-global-config'
import type { ComponentSize } from '@wisdom-plus/utils/types'
import type { MaybeRef } from '@vueuse/core'

export const useSizeProp = buildProp({
  type: String,
  values: ['', ...componentSize],
  default: '',
} as const)

export const useSize = (
  fallback?: MaybeRef<ComponentSize | undefined>,
  ignore: Partial<Record<'prop' | 'form' | 'formItem' | 'global', boolean>> = {}
) => {
  const emptyRef = ref(undefined)

  const size = ignore.prop ? emptyRef : useProp<ComponentSize>('size')
  // 'size'
  const globalConfig = ignore.global ? emptyRef : useGlobalConfig()
  const form = ignore.form ? { size: undefined } : inject(elFormKey, undefined)
  const formItem = ignore.formItem
    ? { size: undefined }
    : inject(elFormItemKey, undefined)

  return computed(
    (): ComponentSize =>
      size.value ||
      unref(fallback) ||
      formItem?.size ||
      form?.size ||
      globalConfig.value ||
      'default'
  )
}

export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
  const disabled = useProp<boolean>('disabled')
  const form = inject(elFormKey, undefined)
  return computed(
    () => disabled.value || unref(fallback) || form?.disabled || false
  )
}
