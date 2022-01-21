import { ref, watch, nextTick } from 'vue'

const closeAll = ref(false)

watch(closeAll, () => {
    if (closeAll.value) {
        nextTick(() => {
            closeAll.value = false
        })
    }
})

const closeAllPopovers = () => {
    closeAll.value = true
}

export { closeAll, closeAllPopovers }