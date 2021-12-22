import { ref, watch, nextTick } from 'vue'

const closeAll = ref(false)

watch(closeAll, () => {
    if (closeAll.value) {
        nextTick(() => {
            closeAll.value = false
        })
    }
})

const closeAllModals = () => {
    closeAll.value = true
}

export { closeAll, closeAllModals }