<script setup>
import { ref } from 'vue'
import A from './A.vue'

const flag = ref(true)
</script>

<template>
    <h1>生命周期</h1>
    <A v-if="flag" />
    <button @click="flag = !flag">创建-销毁</button>
</template>

<style></style>