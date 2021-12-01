import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const epRoot = resolve(pkgRoot, 'wisdom-plus')
//
/** dist */
export const buildOutput = resolve(projRoot, 'dist')
/** dist/wisdom-plus */
export const epOutput = resolve(buildOutput, 'wisdom-plus')
export const epPackage = resolve(epRoot, 'package.json')
