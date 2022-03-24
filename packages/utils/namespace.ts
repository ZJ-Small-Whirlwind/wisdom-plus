const prefix = 'wp'
export const useNamespace = (name: string) => {
    const basic = `${prefix}-${name}`
    return {
        basic,
        of: (of: string, prefix?: string) => {
            return `${prefix ?? basic}-${of}`
        },
        is: (is: string, prefix?: string) => {
            return `${prefix ?? basic}--${is}`
        }
    }
}