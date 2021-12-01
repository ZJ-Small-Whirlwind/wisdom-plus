import type { InjectionKey } from 'vue'
import type { BreadcrumbProps } from '@wisdom-plus/components/breadcrumb'

export const elBreadcrumbKey: InjectionKey<BreadcrumbProps> =
  Symbol('elBreadcrumbKey')
