import { useVModel, VModelOptions } from '@vueuse/core'
import { Ref, computed, nextTick } from 'vue'
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
    return computed<P[K]>({
        get() {
            if (typeof vModal.value === 'undefined') {
                return ref.value
            } else {
                return vModal.value
            }
        },
        set(value) {
            if (typeof vModal.value === 'undefined') {
                if (key && emit) emit?.(`update:${key}` as Name, value)
                nextTick(() => {
                    if (typeof value === 'undefined') {
                        ref.value = value
                        vModal.value = value
                        return
                    }
                    if (typeof vModal.value === 'undefined') {
                        ref.value = value
                    } else {
                        vModal.value = value
                    }
                })
            } else {
                vModal.value = value
            }
        }
    })
}