<template>
    <div>
        <div v-for="item in arr">
            <img width="360" height="500" :data-index="item" v-lazy="item" alt="">
        </div>
    </div>
</template>
 
<script setup>
// glob 懒加载模式，(参数,{ eager: true })
const images = import.meta.glob('../assets/images/*.*', { eager: true })
// console.log(images)
let arr = Object.values(images).map(v => v.default)

let vLazy = async (el, binding) => {
    let url = await import('../assets/vue.svg')
    el.src = url.default;
    let observer = new IntersectionObserver((entries) => {
        console.log(entries[0], el)
        if (entries[0].intersectionRatio > 0 && entries[0].isIntersecting) {
            setTimeout(() => {
                el.src = binding.value;
                observer.unobserve(el)
            }, 2000)
        }
    })
    observer.observe(el)
}

</script>
 
<style scoped lang='less'></style>