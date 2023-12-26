<script setup>
import { ref, computed, reactive } from 'vue'

let firstName = ref('ich')
let lastName = ref('du')

// 1. 选项式写法
// const name = computed({
//     get() { // 读取值操作
//         return firstName.value + '&' + lastName.value
//     },
//     set(newVal) { // 设置值操作
//         [firstName.value,lastName.value] = newVal.split('&')
//     }
// })
// const changeName = () => {
//     name.value = 'icebear&panda'
// }

// 2. 函数式写法 只能支持一个getter函数不允许修改值的
let name = computed(() => {
    firstName.value + '&' + lastName
})
// const changeName = () => {
//     name.value = 'icebear&panda'
// }
// 警告：Write operation failed: computed value is readonly
// 函数式写法只运行只读，不允许修改值的

// 购物车案例
let keyWord = ref('')

const data = reactive([
    {
        name: "小满的绿帽子",
        price: 100,
        num: 1,
    },
    {
        name: "小满的红衣服",
        price: 200,
        num: 1,
    },
    {
        name: "小满的黑袜子",
        price: 300,
        num: 1,
    }
])

let searchData = computed(() => {
    return data.filter(item => item.name.includes(keyWord.value))
})

let total = computed(() => {
    return data.reduce((prev, next) => {
        return prev + next.num * next.price
    }, 0)
})

const del = (index) => {
    data.splice(index, 1)
}
</script>

<template>
    <div>
        <div>
            姓：<input v-model="firstName" type="text">
        </div>
        <div>
            名：<input v-model="lastName" type="text">
        </div>
        <div>
            全名：{{ name }}
        </div>
        <div>
            <button @click="changeName">changeName</button>
        </div>
    </div>
    <hr>
    <div>
        <input placeholder="请输入名称" v-model="keyWord" type="text">
        <table style="margin-top:10px;" width="500" cellspacing="0" cellpadding="0" border>
            <thead>
                <tr>
                    <th>物品</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>总价</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in searchData">
                    <td align="center">{{ item.name }}</td>
                    <td align="center">{{ item.price }}</td>
                    <td align="center">
                        <button @click="item.num > 1 ? item.num-- : null">-</button>
                        <input v-model="item.num" type="number" style="width: 30px;">
                        <button @click="item.num < 99 ? item.num++ : null">+</button>
                    </td>
                    <td align="center">{{ item.price * item.num }}</td>
                    <td align="center">
                        <button @click="del(index)">删除</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" align="right">
                        <span>总价：{{ total }}</span>
                    </td>
                </tr>
            </tfoot>

        </table>
    </div>
</template>