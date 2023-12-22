<script setup>
const props = defineProps(['modelValue', 'textVal'])

const emit = defineEmits(['update:modelValue', 'update:textVal'])

const close = () => {
    emit('update:modelValue', false)
}

const change = (e) => {
    const target = e.target
    emit('update:textVal', target.value)
}
</script>

<template>
    <div v-if="modelValue" class="model">
        <div class="close">
            <button @click="close">关闭</button>
        </div>
        <h3>v-model 子组件 dialog</h3>
        <div>
            内容：<input @input="change" :value="textVal" type="text">
        </div>
    </div>
</template>

<style scoped>
.model {
    width: 500px;
    border: 5px solid #ccc;
    padding: 10px;
}
</style>