import type { TabsProps, TabPaneProps } from '@wisdom-plus/components/tabs'
import type {
  ComponentInternalInstance,
  ComputedRef,
  Ref,
  InjectionKey,
  UnwrapRef,
  ShallowReactive,
} from 'vue'

export type TabsPaneContext = UnwrapRef<{
  uid: number
  instance: ShallowReactive<ComponentInternalInstance>
  props: TabPaneProps
  paneName: ComputedRef<string | undefined>
  active: ComputedRef<boolean>
  index: Ref<string | undefined>
  isClosable: ComputedRef<boolean>
}>

export interface TabsRootContext {
  props: TabsProps
  currentName: Ref<string>
  updatePaneState: (pane: TabsPaneContext) => void
}

export const tabsRootContextKey: InjectionKey<TabsRootContext> =
  Symbol('tabsRootContextKey')
