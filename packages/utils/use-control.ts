import { useVModel, VModelOptions } from '@vueuse/core'
import { Ref, computed, watch } from 'vue'
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
    const watchOptions = {
        deep: options?.deep
    }

    /**
     * 为了保证数据同步
     * 一旦数据变更就要上报到外层
     */
    watch(ref, value => {
        if (!key || !emit) return
        emit?.(options?.eventName as Name || `update:${key}` as Name, value)
    }, watchOptions)
    
    /**
    * 如果外层数据被更新为 undefined
    * 为了避免显示内部数据，内部数据也应更新为 undefined
    */
    watch(vModal, value => {
        if (value === undefined) ref.value = undefined
    }, watchOptions)

    return computed<P[K] | undefined>({
        get() {
            return vModal.value === undefined ? ref.value : vModal.value
        },
        set(value) {
            if (vModal.value === undefined || value === undefined) {
                ref.value = value
            } else {
                vModal.value = value
            }
        }
    })
}