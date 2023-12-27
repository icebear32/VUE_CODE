<template>
    <div>
        <h1>A 组件</h1>
    </div>
    <div>
        <el-checkbox v-model="checked1" label="Option 1" size="large" />
        <el-checkbox v-model="checked2" label="Option 2" size="large" />
    </div>
    <div>
        <el-checkbox v-model="checked3" label="Option 1" />
        <el-checkbox v-model="checked4" label="Option 2" />
    </div>
    <div>
        <el-checkbox v-model="checked5" label="Option 1" size="small" />
        <el-checkbox v-model="checked6" label="Option 2" size="small" />
    </div>
    <div>
        <el-checkbox v-model="checked5" label="Option 1" size="small" disabled />
        <el-checkbox v-model="checked6" label="Option 2" size="small" disabled />
    </div>
</template>
  
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)
const checked6 = ref(false)

// keep-alive 生命周期的变化
// * 初次进入时： onMounted onActivated
// * 退出后触发 deactivated
// * 再次进入：只会触发 onActivated
// * 事件挂载的方法等，只执行一次的放在 onMounted 中；组件每次进去执行的方法放在 onActivated 中
onMounted(() => {
    console.log('初始化')
})

onActivated(() => {
    console.log('keep-alive 初始化')
})

onDeactivated(() => {
    console.log('keep-alive 卸载')
})

onUnmounted(() => {
    console.log('卸载')
})
</script>
  