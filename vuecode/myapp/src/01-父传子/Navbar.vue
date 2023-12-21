<script setup>
const props = defineProps([
    "title",
    "left",
    "right"
])
</script>

<template>
    <div>
        <button>{{ left }}</button>
        {{ title }}
        <button>{{ right }}</button>
    </div>
</template>

<style></style>
