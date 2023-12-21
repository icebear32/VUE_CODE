<script setup>
// 通过defineEmits编译器宏生成emit方法
const emits = defineEmits(['event'])
const childTitle = "child-title"
const handleClick = () => {
    // 触发自定义事件，并传递参数
    emits('event', childTitle)
}
</script>

<template>
    <div>
        child
        <button @click="handleClick">click</button>
    </div>
</template>

<style></style>
