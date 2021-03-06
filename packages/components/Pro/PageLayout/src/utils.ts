import { ref, onActivated, onDeactivated } from "vue"

export const onPageEnter = (handleCreated: () => void, handleActivated?: () => void) => {
    const doQuery = ref(true)
    onActivated(() => {
        if (doQuery.value) return
        if (handleActivated) {
            handleActivated?.()
        } else {
            handleCreated()
        }
    })
    onDeactivated(() => {
        doQuery.value = false
    })
    handleCreated()
}