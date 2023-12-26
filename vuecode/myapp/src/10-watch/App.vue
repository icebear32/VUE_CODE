<script setup>
import { ref, reactive, watch } from 'vue'

let message = ref('ich')
let message2 = ref('du')
let message3 = ref({ // 对象
    foo: {
        bar: {
            name: "icebear"
        }
    }
})
let message4 = reactive({ // 使用reactive监听深层次的对象
    foo: {
        bar: {
            name: "panda"
        }
    }
})
let message5 = reactive({ // 使用reactive监听单个属性值,比如只监听name,不监听age
    foo: {
        bar: {
            name: "ichdu",
            age: 20
        }
    }
})
let message6 = ref('ichdu')
let message7 = ref('icebear panda')

watch([message, message2], (newVal, oldVal) => {
    console.log(newVal, oldVal)
})

watch(message3, (newVal, oldVal) => {
    console.log(newVal, oldVal)
}, {
    deep: true // 深度监听，不然无法监听深层次的内容
    // ，问题是显示新内容和旧内容都是一样的，但还是起到监听作用的
})

// 使用reactive监听深层次的对象
watch(message4, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})

// 使用reactive监听单个属性值,比如只监听name,不监听age
watch(() => message5.foo.bar.name, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})

watch(message6, (newVal, oldVal) => {
    console.log(newVal, oldVal)
},{
    immediate: true // 立即执行一次
})

watch(message7, (newVal, oldVal) => {
    console.log(newVal, oldVal)
},{
    flush: "pre" // pre:组件更新之前调用
    // flush: "sync" // sync:同步执行
    // flush: "post" //post:组件更新之后执行
})
</script>

<template>
    <div>
        case1：<input v-model="message" type="text">
        <hr>
        case2：<input v-model="message2" type="text">
        <hr>
        case3-监听对象并使用深度监听：<input v-model="message3.foo.bar.name" type="text">
        <hr>
        case4-使用reactive监听深层次的对象：<input v-model="message4.foo.bar.name" type="text">
        <hr>
        case5-监听单个属性值：<input v-model="message5.foo.bar.name" type="text">
        case5-监听单个属性值：<input v-model="message5.foo.bar.age" type="text">
        <hr>
        case6-immediate：<input v-model="message6" type="text">
        <hr>
        case7-immediate：<input v-model="message7" type="text">
    </div>
</template>