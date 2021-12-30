import { useVModel, VModelOptions } from '@vueuse/core'
import { Ref } from 'vue'
/**
 * 自动使用受控非受控模式
 */
export function useAutoControl<
    T extends Ref,
    P extends object,
    K extends keyof P,
    Name extends string
>(ref: T, props: P, key?: K, emit?: (name: Name, ...args: any[]) => void, options?: VModelOptions) {
    const vModal = useVModel(props, key, emit, options)
    if (typeof vModal.value === 'undefined') {
        return ref
    } else {
        return vModal
    }
}