<template>
    <CollapseTransition
        :on-after-enter="handleAfterEnter"
        appear
        :reverse="isDelete"
    >
        <slot />
    </CollapseTransition>
</template>

<script lang="ts" setup>
import CollapseTransition from '../../CollapseTransition'
import { onMounted } from 'vue'

const props = defineProps<{
    isDelete: boolean,
    keyIs: string | number | symbol,
    done: () => void,
    leave: () => void,
    level: number
}>()

onMounted(() => {
    if (props.isDelete) {
        props.done()
    }
})

const handleAfterEnter = () => {
    if (props.isDelete) {
        props.leave()
    } else {
        props.done()
        props.leave()
    }
}
</script>