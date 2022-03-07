interface ImportInfo {
    name?: string;
    importName?: string;
    path: string;
}
declare type SideEffectsInfo = (ImportInfo | string)[] | ImportInfo | string | undefined;
interface ComponentInfo extends ImportInfo {
    sideEffects?: SideEffectsInfo;
}
declare type ComponentResolveResult = Promise<string | ComponentInfo | null | undefined | void>;
declare type ComponentResolverFunction = (name: string) => ComponentResolveResult;
interface ComponentResolverObject {
    type: 'component' | 'directive';
    resolve: ComponentResolverFunction;
}

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
    ] as ComponentResolverObject[]
}