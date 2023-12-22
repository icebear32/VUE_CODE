<script setup>
import { ref, computed } from 'vue'

const todos = ref([
    { isComplete: true, name: 'yesname' },
    { isComplete: false, name: 'noname' }
])

// 过滤
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
    return numbers.value.filter((n) => n % 2 === 0)
})

// 排序
const sets = ref([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10]
])

function even(numberssets) {
    return [...numberssets].reverse().filter((number) => number % 2 === 0)
}
</script>

<template>
    <div>
        <!-- 这会抛出一个错误，因为属性 todo 此时没有在该实例上定义 -->
        <!-- <li v-for="todo in todos" v-if="!todo.isComplete">
            {{ todo.name }}
        </li> -->
        <template v-for="todo in todos">
            <li v-if="todo.isComplete">
                {{ todo.name }}
            </li>
        </template>
    </div>
    <hr>
    <div>
        <li v-for="n in evenNumbers">{{ n }}</li>
    </div>
    <hr>
    <div>
        <ul v-for="numbersset in sets">
            <li v-for="n in even(numbersset)">{{ n }}</li>
        </ul>
    </div>
</template>