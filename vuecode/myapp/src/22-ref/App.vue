<script setup>
import { ref, isRef, shallowRef, triggerRef, customRef } from 'vue'

const ich = ref({ name: 'ich' })
const change1 = () => {
    // 注意被ref包装之后需要.value 来进行赋值
    ich.value.name = 'du'

    // 判断是不是一个ref对象
    console.log(isRef(ich))
}

const du = shallowRef({ name: 'du' })
const change2 = () => {
    // shallowRef 浅层次的响应，创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的
    // du.value.name = "ich" // 改变了，但是视图不会发生变化，修改其属性是非响应式的这样是不会改变的
    // console.log(du)

    du.value = {
        name: 'ich'
    }
    console.log(du)

    // ref和 shallowRef是不能一块写的不然会影响shallowRef 造成视图的更新
}

const ichdu = shallowRef({ name: 'ichdu' })
const change3 = () => {
    ichdu.value.name = "我被影响了"
    triggerRef(ichdu)
    console.log(ichdu)
}

// 自定义ref 
// customRef 是个工厂函数要求返回一个对象 并且实现 get 和 set  适合去做防抖之类的
function myRef(value) {
    let timer
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newVal) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    console.log('触发了set')
                    value = newVal
                    trigger()
                }, 500)
            }
        }
    })
}
const name = myRef('my name')
const change4 = () => {
    name.value = 'ichdu'
}
</script>

<template>
    <div>ref：{{ ich }}</div>
    <button @click="change1">修改ich</button>
    <hr>
    <div>shallowRef：{{ du }}</div>
    <button @click="change2">修改du</button>
    <hr>
    <div>triggerRef：{{ ichdu }}</div>
    <button @click="change3">强制更新</button>
    <hr>
    <div>customRef：{{ name }}</div>
    <button @click="change4">自定义ref </button>
</template>