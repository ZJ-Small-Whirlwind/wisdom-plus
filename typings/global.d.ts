// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    WpPopover: typeof import('wisdom-plus')['WpPopover']
    WpButton: typeof import('wisdom-plus')['WpButton']
    WpCollapse: typeof import('wisdom-plus')['WpCollapse']
    WpCollapseItem: typeof import('wisdom-plus')['WpCollapseItem']
    CollapseTransition: typeof import('wisdom-plus')['CollapseTransition']
    WpGrid: typeof import('wisdom-plus')['WpGrid']
    WpGridItem: typeof import('wisdom-plus')['WpGridItem']
    WpGi: typeof import('wisdom-plus')['WpGi']
    WpSpace: typeof import('wisdom-plus')['WpSpace']
    WpIcon: typeof import('wisdom-plus')['WpIcon']
    WpTooltip: typeof import('wisdom-plus')['WpTooltip']
    WpMenu: typeof import('wisdom-plus')['WpMenu']
    WpScrollList: typeof import('wisdom-plus')['WpScrollList']
  }
}

export {}
