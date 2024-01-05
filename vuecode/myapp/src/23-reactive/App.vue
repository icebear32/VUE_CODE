<script setup>
import { reactive, readonly, shallowReactive } from 'vue'

// ref 支持所有类型 reactive 引用类型 Array Object Map Set
// ref 取值赋值都需要加 .value，reactive 是不需要 .value
let form = reactive({
    name: 'ich',
    age: 23
})
const submit = () => {
    console.log(form)
}

let list = reactive([])
const add = () => {
    setTimeout(() => {
        // let res = ['x', 'xx', 'xxx']
        // list = res
        // console.log(list)
        // 出现数据变化但是视图没有变化问题
        // 原因：reactive 是一个 proxy 代理的对象，不能直接赋值，否则会破坏响应式对象的

        // 解决方案1：数组 可以使用 push 加 解构
        let res = ['x', 'xx', 'xxx']
        list.push(...res)
        console.log(list)
    }, 1000)
}

// 解决方案1：添加一个对象，把数组作为一个属性去解决
let list1 = reactive({ arr: [] })
const add1 = () => {
    setTimeout(() => {
        let res = ['x', 'xx', 'xxx']
        list1.arr = res
        console.log(list)
    }, 1000)
}

// readonly 拷贝一份proxy对象将其设置为只读
let obj = reactive({ name: 'ich' })
const read = readonly(obj)
const show = () => {
    // read.name = 'du' // 只读，不可以修改
    obj.name = 'du' //可以修改，受到原始对象影响
    console.log(obj, read)
}

// shallowReactive 只能对浅层的数据 如果是深层的数据只会改变值 不会改变视图
const obj1 = {
    a: 1,
    first: {
        b: 2,
        second: {
            c: 3
        }
    }
}
const state = shallowReactive(obj1)
function change1() {
    state.a = 7
}
function change2() {
    state.first.b = 8
    state.first.second.c = 9
    console.log(state)
}
</script>

<template>
    <div>
        <form>
            <input v-model="form.name" type="text">
            <br>
            <input v-model="form.age" type="text">
            <br>
            <button @click.prevent="submit">提交</button>
        </form>
    </div>
    <hr>
    <div>
        <ul v-for="item in list">
            <li>{{ item }}</li>
        </ul>
        <button @click="add">添加</button>
    </div>
    <hr>
    <div>
        <ul v-for="item1 in list1.arr">
            <li>{{ item1 }}</li>
        </ul>
        <button @click="add1">添加</button>
    </div>
    <hr>
    <div>
        <button @click="show">查看</button>
    </div>
    <hr>
    <div>
        <div>{{ state }}</div>
        <button @click="change1">test1</button>
        <button @click="change2">test2</button>
    </div>
</template>