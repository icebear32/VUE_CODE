<script setup>
import NavbarChild from './NavbarChild.vue'

// 禁止透传
defineOptions({
    inheritAttrs: false
})
</script>

<template>
    <div class="aaa" style="background: red;">
        <h2>Navbar</h2>
        <!-- 禁止透传后可以使用控制进行透传 -->
        <button v-bind="$attrs">test</button>
        <span>透传进来的：{{ $attrs }}</span>
        <NavbarChild />
    </div>
</template>