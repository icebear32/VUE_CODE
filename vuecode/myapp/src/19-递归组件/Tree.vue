<script setup>
const props = defineProps([
    'data'
])

const clickTap = (item, e) => {
    console.log(item)
    console.log(e.target)
}
</script>

<template>
    <!-- 递归组件处理事件，加 .stop 阻止冒泡事件 -->
    <div @click.stop="clickTap(item, $event)" class="tree" v-for="item in data">
        <input v-model="item.checked" type="checkbox"><span>{{ item.name }}</span>
        <Tree v-if="item.children" :data="item.children" />
    </div>
</template>

<style scoped lang="less">
.tree {
    margin-left: 10px;
}
</style>