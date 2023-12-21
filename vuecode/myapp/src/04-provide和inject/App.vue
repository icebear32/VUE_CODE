<script setup>
import { ref, provide } from 'vue'
import Navbar from './Navbar.vue'
import Tabbar from './Tabbar.vue'

const navTitle = ref("首页")
provide('navTitle', navTitle)
</script>

<template>
    <div>
        <Navbar />
        <Tabbar />
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
}

ul {
    list-style: none;
}
</style>