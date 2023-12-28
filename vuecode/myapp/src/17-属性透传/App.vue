<script setup>
import Navbar from './Navbar.vue'

const handleClick = () => {
    console.log('app-111')
}
</script>

<template>
    <div>
        <h1>App</h1>
        <Navbar class="navbar" id="navbarid" style="background-color: yellow;" @click="handleClick()" />
    </div>
</template>