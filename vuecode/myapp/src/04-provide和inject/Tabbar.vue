<script setup>
import { ref } from 'vue'
import TableItem from './TableItem.vue'

const datalist = ref(["首页", "列表", "我的"])
</script>

<template>
    <ul>
        <TableItem v-for="data in datalist" :key="data" :item="data" />
    </ul>
</template>

<style scoped>
ul {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
}

li {
    flex: 1;
    text-align: center;
}
</style>