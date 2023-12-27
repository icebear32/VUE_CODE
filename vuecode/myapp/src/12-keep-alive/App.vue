<script setup>
import { ref, reactive } from 'vue'
import A from './A.vue'
import B from './B.vue'

const flag = ref(true)
</script>

<template>
    <el-button type="primary" size="default" @click="flag = !flag">切换组件</el-button>
    <hr>
    <!-- 
        include 允许哪个组件缓存
        exclude 不允许运行哪个组件缓存
        include 和 exclude 允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示
    -->
    <!-- <KeepAlive :include="['A', 'B']" :exclude="['A']"> -->
    <!-- 通过传入 max 来限制可被缓存的最大组件实例数 -->
    <KeepAlive :max="10">
        <A v-if="flag" />
        <B v-else />
    </KeepAlive>
</template>