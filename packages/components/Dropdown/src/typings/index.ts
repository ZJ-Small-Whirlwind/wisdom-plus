import { Component } from 'vue'

export interface DropdownRecord {
    index?: string | symbol | number,
    title?: string,
    click?: (record?: DropdownRecord) => void,
    children?: DropdownRecord[],
    groupName?: string,
    disabled?: boolean,
    divided?: boolean,
    icon?: Component
}