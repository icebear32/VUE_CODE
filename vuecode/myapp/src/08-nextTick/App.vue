<script setup>
import { reactive, ref, nextTick } from 'vue'

let chatList = reactive([
    { name: 'zs', message: 'xxxxxx' }
])
let ipt = ref('')
let box = ref()

const send = async () => {
    chatList.push({
        name: 'ich',
        message: ipt.value
    })
    // ipt.value = ''
    // box.value.scrollTop = 999999

    // 1. 回调函数模式
    // nextTick(() => {
    //     box.value.scrollTop = 999999
    // })

    // 2. async await 写法(下面开始的都是异步)
    await nextTick()
    box.value.scrollTop = 999999
}
</script>

<template>
    <div ref="box" class="wraps">
        <div>
            <div class="item" v-for="item in chatList">
                <div>{{ item.name }}：</div>
                <div>{{ item.message }}</div>
            </div>
        </div>
    </div>
    <div class="ipt">
        <div>
            <textarea v-model="ipt" type="text"></textarea>
        </div>
        <div>
            <button @click="send">send</button>
        </div>
    </div>
</template>

<style scoped lang="less">
.wraps {
    margin: 10px auto;
    width: 500px;
    height: 400px;
    overflow: auto;
    overflow-x: hidden;
    background: #fff;
    border: 1px solid #ccc;

    .item {
        width: 100%;
        height: 50px;
        background: #ccc;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-bottom: 1px solid #fff;
    }
}

.ipt {
    margin: 10px auto;
    width: 500px;
    height: 65px;
    overflow: auto;
    overflow-x: hidden;
    background: #fff;
    border: 1px solid #ccc;
}
</style>