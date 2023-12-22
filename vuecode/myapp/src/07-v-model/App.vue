<script setup>
import {ref} from 'vue'
import VModel from './v-model.vue'

const isShow = ref(true)
const text = ref('ich')
</script>

<template>
    <div>
        <h1>父组件</h1>
        <div>isShow：{{ isShow }}</div>
        <div>text：{{ text }}</div>
        <div><button @click="isShow = !isShow">开关</button></div>
        <hr>
        <VModel v-model:textVal="text" v-model="isShow" />
    </div>
</template>