<script setup>
import { inject } from 'vue'

const navTitle = inject('navTitle') // 注入父组件的值
</script>

<template>
    <div>
        <button>返回</button>
        <span>{{ navTitle }}</span>
        <button>标题</button>
    </div>
</template>

<style scoped>
div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    background: gray;
}
</style>