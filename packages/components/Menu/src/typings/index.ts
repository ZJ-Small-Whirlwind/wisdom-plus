import type { Component } from 'vue'

export interface MenuRecord {
    index: string,
    title?: string,
    icon?: Component,
    children?: MenuRecord[]
}
export type MenuList = MenuRecord[]