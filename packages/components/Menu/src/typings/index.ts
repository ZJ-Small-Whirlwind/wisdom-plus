import type { Component } from 'vue'

export interface MenuRecord {
    index: string,
    title?: string,
    icon?: Component,
    disabled?: boolean,
    children?: MenuRecord[]
}
export type MenuList = MenuRecord[]