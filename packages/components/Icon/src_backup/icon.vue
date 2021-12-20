<template>
    <i :class="[
        'wp-icon'
    ]">
        撒打算大
    </i>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import {iconProps} from "@wisdom-plus/components/icon/src/icon";

export default defineComponent({
    name:"WpIcon",
    props:iconProps,
    setup(){

    }
})
</script>