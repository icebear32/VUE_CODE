<script setup>
import { inject } from 'vue'

const navTitle = inject('navTitle') // 注入爷组件

const props = defineProps(["item"]) // 接受父组件传值

const handleClick = (item) => {
    console.log(item)
    navTitle.value = item // 要修改数据要用 .value
} 
</script>

<template>
    <li @click="handleClick(item)">{{ item }}</li>
</template>