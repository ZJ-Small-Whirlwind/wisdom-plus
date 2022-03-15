import { ref, watch } from "vue";

export const activeOverlay = ref<Symbol[]>([])

watch(activeOverlay, () => {
    if (activeOverlay.value.length > 0) {
        document.body.classList.add('wp-overflow--hidden')
    } else {
        document.body.classList.remove('wp-overflow--hidden')
    }
}, {
    deep: true
})