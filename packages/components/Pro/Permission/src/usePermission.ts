import { RouteLocationNormalizedLoaded } from 'vue-router'

export const permissionConfig: {
    useRoute?: () => RouteLocationNormalizedLoaded
} = {}

export const hasPermissions = (
    route?: RouteLocationNormalizedLoaded,
    method: 'some' | 'every' = 'some',
    ...args: (string | string[])[]
): boolean => {
    if (!route) return false
    const meta = route.meta as any
    if (
        !meta.permissions ||
        meta.permissions.length === 0
    ) return false
    const flatArgs = args.flat()
    return meta.permissions[method]((permission: string) => flatArgs.includes(permission))
}

export const usePermission = (useRoute?: () => RouteLocationNormalizedLoaded) => {
    const route = useRoute?.() ?? permissionConfig.useRoute?.()
    return {
        route,
        has: (...args: (string | string[])[]) => hasPermissions(route, 'some', ...args),
        hasAll: (...args: (string | string[])[]) => hasPermissions(route, 'every', ...args),
        permissions: route?.meta.permissions || []
    }
}