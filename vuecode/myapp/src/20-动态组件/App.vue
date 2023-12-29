<script setup>
import { ref, reactive, markRaw, shallowRef } from 'vue'
import Avue from './A.vue'
import Bvue from './B.vue'
import Cvue from './C.vue'

const comId = shallowRef(Avue)
const active = ref(0)

const data = reactive([
    {
        name: 'A组件',
        com: markRaw(Avue)
    },
    {
        name: 'B组件',
        com: markRaw(Bvue)
    },
    {
        name: 'C组件',
        com: markRaw(Cvue)
    }
])

const switchCom = (item, index) => {
    comId.value = item.com
    active.value = index
}
</script>

<template>
    <div style="display: flex;">
        <div @click="switchCom(item, index)" :class="[active == index ? 'active' : '']" class="tabs"
            v-for="(item, index) in data">
            <div>{{ item.name }}</div>
        </div>
    </div>
    <component :is="comId"></component>
</template>

<style scoped lang="less">
.active {
    background: skyblue;
}

.tabs {
    border: 1px solid #ccc;
    padding: 5px 10px;
    margin: 5px;
    cursor: pointer;
}
</style>