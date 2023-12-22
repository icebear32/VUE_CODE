<script setup>
import { ref, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated } from 'vue'

// setup语法糖模式是没有 beforeCreate、created这两个生命周期
// onBeforeMount 读取不到dom | onMounted 可以读取到dom
// onBeforeUpdate 获取的是更新之前的dom | onUpdated 获取更新之后的dom

console.log('setup')

const str = ref('ich')
const div = ref()

const change = () => {
    str.value = 'du'
}

// 创建
onBeforeMount(() => {
    console.log('创建之前=====>', div.value)
})
onMounted(() => {
    console.log('创建完成=====>', div.value)
})

// 更新
onBeforeUpdate(() => {
    console.log('更新组件之前=====>', div.value.innerText)
})
onUpdated(() => {
    console.log('更新组件完成=====>', div.value.innerText)
})

// 销毁
onBeforeUnmount(() => {
    console.log('销毁之前=====>')
})
onUnmounted(() => {
    console.log('销毁完成=====>')
})
</script>

<template>
    <div>
        <h3>A组件</h3>
        <div ref="div">{{ str }}</div>
        <button @click="change">修改str</button>
    </div>
</template>