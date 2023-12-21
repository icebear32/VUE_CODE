# 1. 组件传值

## 父子传值

props：接受父组件传递过来的值

父：App.vue

```vue
<script setup>
import Navbar from './Navbar.vue'
</script>

<template>
    <div>
        <Navbar title="首页" left="返回" right="搜索" />
    </div>
</template>

<style>

</style>

```



子：Navbar.vue

```vue
<script setup>
const props = defineProps([
    "title",
    "left",
    "right"
])
</script>

<template>
    <div>
        <button>{{ left }}</button>
        {{ title }}
        <button>{{ right }}</button>
    </div>
</template>

<style></style>

```



## 子传值

子：child.vue

```vue
<script setup>
// 通过defineEmits编译器宏生成emit方法
const emits = defineEmits(['event'])
const childTitle = "child-title"
const handleClick = () => {
    // 触发自定义事件，并传递参数
    emits('event', childTitle)
}
</script>

<template>
    <div>
        child
        <button @click="handleClick">click</button>
    </div>
</template>

<style></style>

```

父：App.vue

```vue
<script setup>
import Child from './child.vue'

const handleEvent = (data) => {
    console.log("app-event", data)
}
</script>

<template>
    <!-- 父组件绑定自定义事件 -->
    <Child @event="handleEvent" />
</template>

<style></style>

```



## $parent 和 $root

`$parent`可以获取某一个组件的父组件实例`VC`,因此可以使用父组件内部的数据与方法

必须子组件内部拥有一个按钮点击时候获取父组件实例，当然父组件的数据与方法需要通过`defineExpose`方法对外暴露

`$root`用来访问当前 Vue 应用的根组件。在组件中可以通过 `$root`访问到根组件实例，进而访问其属性或方法



创建**App.vue，parent.vue，child.vue**

App.vue

```vue
<script setup>
import { ref } from 'vue'
import Parent from './Parent.vue'

const title = ref("app-111")

defineExpose({
    title
})
</script>

<template>
    app
    <Parent />
</template>

<style></style>
```

parent.vue

```vue
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const title = ref('parent-111')

defineExpose({
    title
})
</script>

<template>
    <div>
        parent
        <Child />
    </div>
</template>
```

child.vue

```vue
<script setup>
const handleClick = (parent) => {
    console.log(parent.title)
    // console.log($root.title)
}

const handleClick1 = (root) => {
    console.log(root.title)
}
</script>

<template>
    <div>
        child-parent-<button @click="handleClick($parent)">click</button><br>
        child-root-<button @click="handleClick1($root)">click</button>
    </div>
</template>
```


