import type { Component } from 'vue'
import type { CollapseSupport } from '../../../Collapse'

export type MenuRecord = {
    index: CollapseSupport,
    title?: string,
    icon?: Component | string,
    disabled?: boolean,
    children?: MenuRecord[],
    info?: Record<string, any>
}
export type MenuList = MenuRecord[]