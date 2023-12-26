<script setup>
import { ref, watchEffect } from 'vue'

let message = ref('ich')
let message1 = ref('du')

const stop = watchEffect((oninvalidate) => {
    console.log('message ===> ', message.value)
    console.log('message1 ===> ', message1.value)
    oninvalidate(() => { // 清除副作用,就是在触发监听之前会调用一个函数可以处理你的逻辑例如防抖
        console.log('before')
    })
}, {
    // 副作用刷新时机 flush 一般使用post
    flush: "post", // 组件更新后执行
    // flush: "pre", // 组件更新前执行
    // flush: "sync", // 强制效果始终同步触发

    // onTrigger  可以帮助调试 watchEffect
    onTrigger(e) {
        debugger
    }
})

// 停止跟踪 watchEffect 返回一个函数, 调用之后将停止更新
const stopWatch = () => stop()
</script>

<template>
    <input v-model="message" type="text">
    <input v-model="message1" type="text">
    <button @click="stopWatch">停止监听</button>
</template>