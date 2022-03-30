import { Component, VNode } from 'vue'
import type { GridItemProps } from '../../../GridItem'
import type { FormItemProps } from '../../../Form'

type ExtractProps<T extends abstract new (...args: any) => any, P extends boolean = true> = P extends true ? Partial<(InstanceType<T>)['$props']> : (InstanceType<T>)['$props']

export type ColumnSchema = FormItemProps
export type Schema<T extends string | object = string> = Partial<ColumnSchema> & {
    prop: T extends string ? T : keyof T,
    label?: string,
    required?: boolean,
    defaultValue?: any,
    grid?: Partial<GridItemProps>,
    component?: Component | string | VNode | (abstract new (...args: any) => any),
    componentProps?: Record<string, any>,
    componentSlots?: Record<string, (...args: any[]) => any>,
    plain?: boolean,
    hide?: boolean,
    raw?: boolean,
    noVaild?: boolean,
    model?: string
} & Record<string, any>
export type Schemas<T extends string | object = string> = Schema<T>[]

export function buildSchema<
    T extends string | object = string,
    S extends Schema<T> = Schema<T>
>(schema: {
    [P in keyof S]: P extends 'componentProps' ? S['component'] extends abstract new (...args: any) => any ? ExtractProps<S['component']> : S[P] : S[P]
}) {
    return schema
}