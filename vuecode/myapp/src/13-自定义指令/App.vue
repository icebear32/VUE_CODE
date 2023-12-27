<script setup>
import { ref } from 'vue'
import A from './A.vue'

let flag = ref(true)

const vMove = {
    created: () => {
        console.log("初始化====>");
    },
    beforeMount(...args) {
        // 在元素上做些操作
        console.log("初始化一次=======>");
        console.log(args)
    },
    mounted(el, dir) {
        el.style.background = dir.value.background;
        console.log("初始化========>");
    },
    beforeUpdate() {
        console.log("更新之前");
    },
    updated() {
        console.log("更新结束");
    },
    beforeUnmount(...args) {
        console.log(args);
        console.log("======>卸载之前");
    },
    unmounted(...args) {
        console.log(args);
        console.log("======>卸载完成");
    },
};
</script>

<template>
    <div>
        <button @click="flag = !flag">切换</button>
        <A v-if="flag" v-move:aaa.ich="{ background: 'red' }" />
    </div>
</template>