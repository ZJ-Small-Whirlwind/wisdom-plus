function resolveComponent(name: string) {
    if (!name.match(/^Wp[A-Z]/))
        return
    if (name === 'WpG') name = 'WpGrid'
    if (name === 'WpGi') name = 'WpGridItem'
    return {
        importName: name,
        path: 'wisdom-plus/es'
    }
}
export function WisdomPlusResolver() {
    return [
        {
            type: 'component',
            resolve: async (name) => {
                return resolveComponent(name)
            }
        }
    ]
}