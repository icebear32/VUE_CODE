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



## 跨级通信：provide 和 inject

provide`方法用于提供数据，此方法执需要传递两个参数,分别提供数据的`key`与提供数据`value

后代组件可以通过`inject`方法获取数据,通过`key`获取存储的数值，要修改数据要用**.value**



创建**App.vue，Navbar.vue，Tabbar.vue，TableItem.vue**

App.vue

```vue
<script setup>
import { ref, provide } from 'vue'
import Navbar from './Navbar.vue'
import Tabbar from './Tabbar.vue'

const navTitle = ref("首页")
provide('navTitle', navTitle)
</script>

<template>
    <div>
        <Navbar />
        <Tabbar />
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
}

ul {
    list-style: none;
}
</style>
```

Navbar.vue

```vue
<script setup>
import { inject } from 'vue'

const navTitle = inject('navTitle') // 注入父组件的值
</script>

<template>
    <div>
        <button>返回</button>
        <span>{{ navTitle }}</span>
        <button>标题</button>
    </div>
</template>

<style scoped>
div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
    background: gray;
}
</style>
```

Tabbar.vue

```vue
<script setup>
import { ref } from 'vue'
import TableItem from './TableItem.vue'

const datalist = ref(["首页", "列表", "我的"])
</script>

<template>
    <ul>
        <TableItem v-for="data in datalist" :key="data" :item="data" />
    </ul>
</template>

<style scoped>
ul {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
}

li {
    flex: 1;
    text-align: center;
}
</style>
```

TableItem.vue

```vue
<script setup>
import { inject } from 'vue'

const navTitle = inject('navTitle') // 注入爷组件

const props = defineProps(["item"]) // 接受父组件传值

const handleClick = (item) => {
    console.log(item)
    navTitle.value = item // 要修改数据要用 .value
} 
</script>

<template>
    <li @click="handleClick(item)">{{ item }}</li>
</template>
```



## vuex 或 pinia



# 2. v-if 和 v-for 优先级

同时使用 `v-if` 和 `v-for` 是**不推荐的**，因为这样二者的优先级不明显

当它们同时存在于一个节点上时，`v-if` 比 `v-for` 的优先级更高

这意味着 `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名

```vue
<script setup>
import { ref } from 'vue'

const todos = ref([
    { isComplete: true, name: 'yesname' },
    { isComplete: false, name: 'noname' }
])
</script>

<template>
    <div>
        <!-- 这会抛出一个错误，因为属性 todo 此时没有在该实例上定义 -->
        <li v-for="todo in todos" v-if="!todo.isComplete">
            {{ todo.name }}
        </li>
    </div>
</template>
```

在外新包装一层 `<template>` 再在其上使用 `v-for` 可以解决这个问题

```vue
<script setup>
import { ref, computed } from 'vue'

const todos = ref([
    { isComplete: true, name: 'yesname' },
    { isComplete: false, name: 'noname' }
])
</script>

<template>
    <div>
        <!-- 这会抛出一个错误，因为属性 todo 此时没有在该实例上定义 -->
        <!-- <li v-for="todo in todos" v-if="!todo.isComplete">
            {{ todo.name }}
        </li> -->
        <template v-for="todo in todos">
            <li v-if="todo.isComplete">
                {{ todo.name }}
            </li>
        </template>
    </div>
</template>
```

或者在计算属性中使用过滤

```vue
<script setup>
import { ref, computed } from 'vue'

// 过滤
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
    return numbers.value.filter((n) => n % 2 === 0)
})
</script>

<template>
    <hr>
    <div>
        <li v-for="n in evenNumbers">{{ n }}</li>
    </div>
</template>
```



在计算属性不可行的情况下 (例如在多层嵌套的 `v-for` 循环中)，你可以使用排序方法

在计算属性中使用 `reverse()` 和 `sort()` 的时候务必小心！这两个方法将变更原始数组，计算函数中不应该这么做

请在调用这些方法之前创建一个原数组的副本**return [...numbers].reverse()**

```vue
<script setup>
import { ref, computed } from 'vue'

// 排序
const sets = ref([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10]
])

function even(numberssets) {
    return [...numberssets].reverse().filter((number) => number % 2 === 0)
}
</script>

<template>
    <div>
        <li v-for="n in evenNumbers">{{ n }}</li>
    </div>
    <hr>
    <div>
        <ul v-for="numbersset in sets">
            <li v-for="n in even(numbersset)">{{ n }}</li>
        </ul>
    </div>
</template>
```



# 3.  vue 生命周期

```
vue生命周期
	Render encounters component
		渲染器，创建组件（全新生命周期开始）
	setup(Componsition API)
		最早发生
	beforeCreate
		创建前
	Init Options API

	created
		创建后
	Has pre-compiled template
		判断是否已经有预编译的模板
			yes：beforeMount
			no：在运行时进行实时编译模板
				Compile template on-the-fly
	beforeMount
		挂载前
	initial render create & insert DOM nodes
		初始渲染创建和插入DOM节点
	mounted
		挂载后
	（不断循环）Mounted when data changes 数据发生变化
		beforeupdate
			更新前
		re-render and patch
			重新渲染和更新		
		beforeupdate
			更新后
	when component is unmounted 卸载组件时
		beforeUnmount
			卸载前
		unmounted
			卸载
```



# 4.v-model

Vue 内置指令，支持input、select、表单元素、自定义组件

```
1. vue中双向绑定是一个指令v-model，可以绑定一个动态值到视图，同时视图中变化能改变该值。v-model是语法糖，默认情况下相当于:value和@input。
2. 使用v-model可以减少大量繁琐的事件处理代码，提高开发效率，代码可读性也更好
3. 通常在表单项上使用v-model
4. 原生的表单项可以直接使用v-model，自定义组件上如果要使用它需要在组件内绑定value并处理输入事件
5. 输出包含v-model模板的组件渲染函数，发现它会被转换为value属性的绑定以及一个事件监听，事件回调函数中会做相应变量更新操作，这说明神奇魔法实际上是vue的编译器完成的
```



单个 v-model 绑定 和 多个 v-model 绑定

App.vue

```vue
<script setup>
import {ref} from 'vue'
import VModel from './v-model.vue'

const isShow = ref(true)
const text = ref('ich')
</script>

<template>
    <div>
        <h1>父组件</h1>
        <div>isShow：{{ isShow }}</div>
        <div>text：{{ text }}</div>
        <div><button @click="isShow = !isShow">开关</button></div>
        <hr>
        <VModel v-model:textVal="text" v-model="isShow" />
    </div>
</template>
```

v-model.vue

```vue
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
```



## 
