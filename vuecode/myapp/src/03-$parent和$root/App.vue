<script setup>
import { ref } from 'vue'
import Parent from './Parent.vue'

const title = ref("app-111")

defineExpose({
    title
})
</script>

<template>
    app
    <Parent />
</template>

<style></style>