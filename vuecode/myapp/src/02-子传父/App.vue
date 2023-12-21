<script setup>
import Child from './child.vue'

const handleEvent = (data) => {
    console.log("app-event", data)
}
</script>

<template>
    <!-- 父组件绑定自定义事件 -->
    <Child @event="handleEvent" />
</template>

<style></style>
