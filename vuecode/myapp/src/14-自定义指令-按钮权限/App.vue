<template>
    <div class="btns">
        <button v-has-show="'shop:create'">创建</button>
        <button v-has-show="'shop:edit'">编辑</button>
        <button v-has-show="'shop:delete'">删除</button>
    </div>
</template>
  
<script setup>
import { ref, reactive } from 'vue'

// permission
localStorage.setItem('userId', 'ich')
// mock后台返回的数据
const permission = [
    'ich:shop:edit',
    'ich:shop:create',
    'ich:shop:delete'
]
const userId = localStorage.getItem('userId')

const vHasShow = (el, bingding) => {
    if (!permission.includes(userId + ':' + bingding.value)) {
        el.style.display = 'none'
    }
    // console.log(el, bingding)
}

</script>
  
<style scoped lang='less'>
.btns {
    button {
        margin: 10px;
    }
}
</style>