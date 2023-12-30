<script setup>
import { ref, defineAsyncComponent } from 'vue'
// import Some from './Some.vue'

const isLoaded = ref(false)

const Some = defineAsyncComponent(() => {
    return import('./Some.vue')
})
</script>

<template>
    <h2>异步组件</h2>
    <div class="box">
        <button type="button" @click="isLoaded = true">加载组件</button>
        <Some v-if="isLoaded" />
    </div>
</template>