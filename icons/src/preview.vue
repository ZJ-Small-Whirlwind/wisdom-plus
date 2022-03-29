<template>
    <div class="preview" v-html="icon"></div>
</template>

<script>
export default {
    props:{
        icon:{type:String, default:null}
    },
    name: "preview"
}
</script>
