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



# 5. nextTick



## 基本用法

App.vue

```vue
<script setup>
import { reactive, ref } from 'vue'

let chatList = reactive([
    { name: 'zs', message: 'xxxxxx' }
])

let ipt = ref('')
const send = () => {
    chatList.push({
        name: 'ich',
        message: ipt.value
    })
    // ipt.value = ''
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
```

案例的内容是，一个聊条框，不断发送信息，填满聊天框，**发现滚动条并没有随最新内容滚动到最下面**



使用以下也没有解决滚动条滚动

```
box.value.scrollTop = 999999
```

因为vue更新 dom shi异步的，数据更新是同步的

本次执行的代码是同步代码，执行完方法才会更新 dom，所以来不及使得滚动条继续往下滚

```js
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
```





1. nextTick是Vue提供的一个全局API，由于vue的异步更新策略导致对数据的修改不会立刻体现在dom变化上，此时如果想要立即获取更新后的dom状态，就需要使用这个方法
2. Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。nextTick方法会在队列中加入一个回调函数，确保该函数在前面的dom操作完成后才调用。
3. 所以当想在修改数据后立即看到dom执行结果就需要用到nextTick方法。
4. 比如，在干什么的时候就会使用nextTick，传一个回调函数进去，在里面执行dom操作即可。
5. 也有简单了解nextTick实现，它会在callbacks里面加入传入的函数，然后用timerFunc异步方式调用它们，首选的异步方式会是Promise。这让我明白了为什么可以在nextTick中看到dom操作结果。



# 6. computed 和 watch



## computed 计算属性

### 基本用法

```vue
<script setup>
import { ref, computed, reactive } from 'vue'

let firstName = ref('ich')
let lastName = ref('du')

// 1. 选项式写法
// const name = computed({
//     get() { // 读取值操作
//         return firstName.value + '&' + lastName.value
//     },
//     set(newVal) { // 设置值操作
//         [firstName.value,lastName.value] = newVal.split('&')
//     }
// })
// const changeName = () => {
//     name.value = 'icebear&panda'
// }

// 2. 函数式写法 只能支持一个getter函数不允许修改值的
let name = computed(() => {
    firstName.value + '&' + lastName
})
// const changeName = () => {
//     name.value = 'icebear&panda'
// }
// 警告：Write operation failed: computed value is readonly
// 函数式写法只运行只读，不允许修改值的
</script>

<template>
    <div>
        <div>
            姓：<input v-model="firstName" type="text">
        </div>
        <div>
            名：<input v-model="lastName" type="text">
        </div>
        <div>
            全名：{{ name }}
        </div>
        <div>
            <button @click="changeName">changeName</button>
        </div>
    </div>
</template>
```

### 购物车案例

当computed里的依赖的值发生变化，会自动触发计算属性的更新，这样就不会当需要更新数据的时候去调用更新数据的函数

```vue
<script setup>
import { ref, computed, reactive } from 'vue'

// 购物车案例
let keyWord = ref('')

const data = reactive([
    {
        name: "小满的绿帽子",
        price: 100,
        num: 1,
    },
    {
        name: "小满的红衣服",
        price: 200,
        num: 1,
    },
    {
        name: "小满的黑袜子",
        price: 300,
        num: 1,
    }
])

let searchData = computed(() => {
    return data.filter(item => item.name.includes(keyWord.value))
})

let total = computed(() => {
    return data.reduce((prev, next) => {
        return prev + next.num * next.price
    }, 0)
})

const del = (index) => {
    data.splice(index, 1)
}
</script>

<template>
    <hr>
    <div>
        <input placeholder="请输入名称" v-model="keyWord" type="text">
        <table style="margin-top:10px;" width="500" cellspacing="0" cellpadding="0" border>
            <thead>
                <tr>
                    <th>物品</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>总价</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in searchData">
                    <td align="center">{{ item.name }}</td>
                    <td align="center">{{ item.price }}</td>
                    <td align="center">
                        <button @click="item.num > 1 ? item.num-- : null">-</button>
                        <input v-model="item.num" type="number" style="width: 30px;">
                        <button @click="item.num < 99 ? item.num++ : null">+</button>
                    </td>
                    <td align="center">{{ item.price * item.num }}</td>
                    <td align="center">
                        <button @click="del(index)">删除</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" align="right">
                        <span>总价：{{ total }}</span>
                    </td>
                </tr>
            </tfoot>

        </table>
    </div>
</template>
```



## watch

watch 需要侦听特定的数据源，并在单独的回调函数中执行副作用

watch第一个参数监听源

watch第二个参数回调函数cb（newVal，oldVal）

watch第三个参数一个options配置项是一个对象

```
{
    immediate:true // 是否立即调用一次
    deep:true // 是否开启深度监听
    flush: "pre" // pre:组件更新之前调用
    // flush: "sync" // sync:同步执行
    // flush: "post" //post:组件更新之后执行
}
```



```vue
<script setup>
import { ref, reactive, watch } from 'vue'

let message = ref('ich')
let message2 = ref('du')
let message3 = ref({ // 对象
    foo: {
        bar: {
            name: "icebear"
        }
    }
})
let message4 = reactive({ // 使用reactive监听深层次的对象
    foo: {
        bar: {
            name: "panda"
        }
    }
})
let message5 = reactive({ // 使用reactive监听单个属性值,比如只监听name,不监听age
    foo: {
        bar: {
            name: "ichdu",
            age: 20
        }
    }
})
let message6 = ref('ichdu')
let message7 = ref('icebear panda')

watch([message, message2], (newVal, oldVal) => {
    console.log(newVal, oldVal)
})

watch(message3, (newVal, oldVal) => {
    console.log(newVal, oldVal)
}, {
    deep: true // 深度监听，不然无法监听深层次的内容
    // ，问题是显示新内容和旧内容都是一样的，但还是起到监听作用的
})

// 使用reactive监听深层次的对象
watch(message4, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})

// 使用reactive监听单个属性值,比如只监听name,不监听age
watch(() => message5.foo.bar.name, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})

watch(message6, (newVal, oldVal) => {
    console.log(newVal, oldVal)
},{
    immediate: true // 立即执行一次
})

watch(message7, (newVal, oldVal) => {
    console.log(newVal, oldVal)
},{
    flush: "pre" // pre:组件更新之前调用
    // flush: "sync" // sync:同步执行
    // flush: "post" //post:组件更新之后执行
})
</script>

<template>
    <div>
        case1：<input v-model="message" type="text">
        <hr>
        case2：<input v-model="message2" type="text">
        <hr>
        case3-监听对象并使用深度监听：<input v-model="message3.foo.bar.name" type="text">
        <hr>
        case4-使用reactive监听深层次的对象：<input v-model="message4.foo.bar.name" type="text">
        <hr>
        case5-监听单个属性值：<input v-model="message5.foo.bar.name" type="text">
        case5-监听单个属性值：<input v-model="message5.foo.bar.age" type="text">
        <hr>
        case6-immediate：<input v-model="message6" type="text">
        <hr>
        case7-immediate：<input v-model="message7" type="text">
    </div>
</template>
```



## watchEffect

立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数

```vue
<script setup>
import { ref, watchEffect } from 'vue'

let message = ref('ich')
let message1 = ref('du')

const stop = watchEffect((oninvalidate) => {
    console.log('message ===> ', message.value)
    console.log('message1 ===> ', message1.value)
    oninvalidate(() => { // 清除副作用,就是在触发监听之前会调用一个函数可以处理你的逻辑例如防抖
        console.log('before')
    })
}, {
    // 副作用刷新时机 flush 一般使用post
    flush: "post", // 组件更新后执行
    // flush: "pre", // 组件更新前执行
    // flush: "sync", // 强制效果始终同步触发

    // onTrigger  可以帮助调试 watchEffect
    onTrigger(e) {
        debugger
    }
})

// 停止跟踪 watchEffect 返回一个函数, 调用之后将停止更新
const stopWatch = () => stop()
</script>

<template>
    <input v-model="message" type="text">
    <input v-model="message1" type="text">
    <button @click="stopWatch">停止监听</button>
</template>
```



## watch和computed的区别以及选择?

1. 计算属性可以**从组件数据派生出新数据**，最常见的使用方式是设置一个函数，返回计算之后的结果，computed和methods的差异是它具备缓存性，如果依赖项不变时不会重新计算。侦听器**可以侦测某个响应式数据的变化并执行副作用**，常见用法是传递一个函数，执行副作用，watch没有返回值，但可以执行异步操作等复杂逻辑。
2. 计算属性常用场景是简化行内模板中的复杂表达式，模板中出现太多逻辑会使模板变得臃肿不易维护。侦听器常用场景是状态变化之后做一些额外的DOM操作或者异步操作。选择采用何用方案时首先看是否需要派生出新值，基本能用计算属性实现的方式首选计算属性。
3. 使用过程中有一些细节，比如计算属性也是可以传递对象，成为既可读又可写的计算属性。watch可以传递对象，设置deep、immediate等选项。
4. vue3中watch选项发生了一些变化，例如不再能侦测一个点操作符之外的字符串形式的表达式； reactivity API中新出现了watch、watchEffect可以完全替代目前的watch选项，且功能更加强大。



## watch 和 watchEffect 异同

- `watchEffect`立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数。`watch`侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数。
- `watchEffect(effect)`是一种特殊`watch`，传入的函数既是依赖收集的数据源，也是回调函数。如果我们不关心响应式数据变化前后的值，只是想拿这些数据做些事情，那么`watchEffect`就是我们需要的。watch更底层，可以接收多种数据源，包括用于依赖收集的getter函数，因此它完全可以实现watchEffect的功能，同时由于可以指定getter函数，依赖可以控制的更精确，还能获取数据变化前后的值，因此如果需要这些时我们会使用watch。
- `watchEffect`在使用时，传入的函数会立刻执行一次。`watch`默认情况下并不会执行回调函数，除非我们手动设置`immediate`选项。
- 从实现上来说，`watchEffect(fn)`相当于`watch(fn,fn,{immediate:true})`



# 7. kepp-alive

## 内置组件keep-alive

有时候不希望组件被重新渲染影响使用体验；或者处于性能考虑，避免多次重复渲染降低性能。而是希望组件可以缓存下来，维持当前的状态。就需要用到`keep-alive`组件。

App.vue

```vue
<script setup>
import { ref, reactive } from 'vue'
import A from './A.vue'
import B from './B.vue'

const flag = ref(true)
</script>

<template>
    <el-button type="primary" size="default" @click="flag = !flag">切换组件</el-button>
    <hr>
    <!-- 
        include 允许哪个组件缓存
        exclude 不允许运行哪个组件缓存
        include 和 exclude 允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示
    -->
    <!-- <KeepAlive :include="['A', 'B']" :exclude="['A']"> -->
    <!-- 通过传入 max 来限制可被缓存的最大组件实例数 -->
    <KeepAlive :max="10">
        <A v-if="flag" />
        <B v-else />
    </KeepAlive>
</template>
```



* 开启keep-alive 生命周期的变化
  * 初次进入时： onMounted onActivated
  * 退出后触发 deactivated
  * 再次进入：只会触发 onActivated
  * 事件挂载的方法等，只执行一次的放在 onMounted 中；组件每次进去执行的方法放在 onActivated 中

A.vue

```vue
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
  
```



B.vue

```vue
<template>
    <div>
        <h1>B 组件</h1>
    </div>
    <div class="demo-date-picker">
        <div class="container">
            <div class="block">
                <span class="demonstration">Week</span>
                <el-date-picker v-model="value1" type="week" format="[Week] ww" placeholder="Pick a week" />
            </div>
            <div class="block">
                <span class="demonstration">Month</span>
                <el-date-picker v-model="value2" type="month" placeholder="Pick a month" />
            </div>
        </div>
        <div class="container">
            <div class="block">
                <span class="demonstration">Year</span>
                <el-date-picker v-model="value3" type="year" placeholder="Pick a year" />
            </div>
            <div class="block">
                <span class="demonstration">Dates</span>
                <el-date-picker v-model="value4" type="dates" placeholder="Pick one or more dates" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
const value4 = ref('')
</script>

<style scoped>
.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}

.demo-date-picker .container {
    flex: 1;
    border-right: solid 1px var(--el-border-color);
}

.demo-date-picker .container .block {
    border-right: none;
}

.demo-date-picker .container .block:last-child {
    border-top: solid 1px var(--el-border-color);
}

.demo-date-picker .container:last-child {
    border-right: none;
}

.demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}
</style>
  
```



## 怎么缓存当前组件？缓存后怎么更新？

1. 开发中缓存组件使用keep-alive组件，keep-alive是vue内置组件，keep-alive包裹动态组件component时，会缓存不活动的组件实例，而不是销毁它们，这样在组件切换过程中将状态保留在内存中，防止重复渲染DOM。

   ```vue
   <keep-alive>
    <component :is="view"></component>
   </keep-alive>
   ```

2. 结合属性include和exclude可以明确指定缓存哪些组件或排除缓存指定组件。vue3中结合vue-router时变化较大，之前是`keep-alive`包裹`router-view`，现在需要反过来用`router-view`包裹`keep-alive`：

   ```vue
   <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
   </router-view>
   ```

------

3. 缓存后如果要获取数据，解决方案可以有以下两种：

- beforeRouteEnter：在有vue-router的项目，每次进入路由的时候，都会执行`beforeRouteEnter`

  ```js
  beforeRouteEnter(to, from, next){
   next(vm=>{
     console.log(vm)
     // 每次进入路由执行
     vm.getData()  // 获取数据
   })
  },
  ```

- actived：在`keep-alive`缓存的组件被激活的时候，都会执行`actived`钩子

  ```js
  activated(){
       this.getData() // 获取数据
  },
  ```

------

4. keep-alive是一个通用组件，它内部定义了一个map，缓存创建过的组件实例，它返回的渲染函数内部会查找内嵌的component组件对应组件的vnode，如果该组件在map中存在就直接返回它。由于component的is属性是个响应式数据，因此只要它变化，keep-alive的render函数就会重新执行。



# 8. 自定义指令



```vue
<script setup>
import { ref } from 'vue'
import A from './A.vue'

let flag = ref(true)

const vMove = {
    created: () => {
        console.log("初始化====>");
    },
    beforeMount(...args) {
        // 在元素上做些操作
        console.log("初始化一次=======>");
        console.log(args)
    },
    mounted(el, dir) {
        el.style.background = dir.value.background;
        console.log("初始化========>");
    },
    beforeUpdate() {
        console.log("更新之前");
    },
    updated() {
        console.log("更新结束");
    },
    beforeUnmount(...args) {
        console.log(args);
        console.log("======>卸载之前");
    },
    unmounted(...args) {
        console.log(args);
        console.log("======>卸载完成");
    },
};
</script>

<template>
    <div>
        <button @click="flag = !flag">切换</button>
        <A v-if="flag" v-move:aaa.ich="{ background: 'red' }" />
    </div>
</template>
```

A.vue

```vue
<script setup>

</script>

<template>
    <div class="A">
        A 组件
    </div>
</template>

<style scoped>
.A {
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
}
</style>
```



## 案例

### 按钮权限

App.vue

```vue
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
```



### 指令拖拽

App.vue

```vue
<template>
    <div v-move class="box">
        <div class="header"></div>
        <div>
            内容
        </div>
    </div>
</template>
   
<script setup>
const vMove = {
    mounted(el) {
        let moveEl = el.firstElementChild
        const mouseDown = (e) => {
            //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
            console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft)
            let X = e.clientX - el.offsetLeft
            let Y = e.clientY - el.offsetTop
            const move = (e) => {
                el.style.left = e.clientX - X + "px"
                el.style.top = e.clientY - Y + "px"
                console.log(e.clientX, e.clientY, "---改变")
            }
            document.addEventListener("mousemove", move)
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", move)
            })
        }
        moveEl.addEventListener("mousedown", mouseDown)
    },
}
</script>
   
<style lang='less'>
.box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;

    .header {
        height: 20px;
        background: black;
        cursor: move;
    }
}
</style>
```



### 图片懒加载

默认展示vue logo，滑动到可视区域加载图片

App.vue

```vue
<template>
    <div>
        <div v-for="item in arr">
            <img height="500" :data-index="item" v-lazy="item" width="360" alt="">
        </div>
    </div>
</template>
 
<script setup>
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
```



## 自定义指令使用场景？

- Vue有一组默认指令，比如`v-mode`l或`v-for`，同时Vue也允许用户注册自定义指令来扩展Vue能力
- 自定义指令主要完成一些可复用低层级DOM操作
- 使用自定义指令分为定义、注册和使用三步：
  - 定义自定义指令有两种方式：对象和函数形式，前者类似组件定义，有各种生命周期；后者只会在mounted和updated时执行
  - 注册自定义指令类似组件，可以使用app.directive()全局注册，使用{directives:{xxx}}局部注册
  - 使用时在注册名称前加上v-即可，比如v-focus
- 在项目中常用到一些自定义指令，例如：
  - 复制粘贴 v-copy
  - 长按 v-longpress
  - 防抖 v-debounce
  - 图片懒加载 v-lazy
  - 按钮权限 v-premission
  - 页面水印 v-waterMarker
  - 拖拽指令 v-draggable
- vue3中指令定义发生了比较大的变化，主要是钩子的名称保持和组件一致，这样开发人员容易记忆，不易犯错。另外在v3.2之后，可以在setup中以一个小写v开头方便的定义自定义指令，更简单了！

# 9. 属性透传

App.vue，爷组件

```vue
<script setup>
import Navbar from './Navbar.vue'

const handleClick = () => {
    console.log('app-111')
}
</script>

<template>
    <div>
        <h1>App</h1>
        <Navbar class="navbar" id="navbarid" style="background-color: yellow;" @click="handleClick()" />
    </div>
</template>
```

Navbar.vue，父组件

```vue
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
```

NavbarChlid.vue，孙组件

```vue
<script setup>

</script>

<template>
    <div class="bbb"  style="background: green;">
        <h3>NavbarChlid</h3>
    </div>
</template>
```





## $attrs 和 $listeners的使用场景

- 可能会有一些属性和事件没有在props中定义，这类称为非属性特性，结合v-bind指令可以直接透传给内部的子组件。
- 这类“属性透传”常常用于包装高阶组件时往内部传递属性，常用于爷孙组件之间传参。比如我在扩展A组件时创建了组件B组件，然后在C组件中使用B，此时传递给C的属性中只有props里面声明的属性是给B使用的，其他的都是A需要的，此时就可以利用v-bind="$attrs"透传下去。
- 最常见用法是结合v-bind做展开；$attrs本身不是响应式的，除非访问的属性本身是响应式对象。
- vue2中使用**listeners**获取事件，vue3中已移除，均合并到**attrs**中，使用起来更简单了。



# 10. v-once

- `v-once`是vue的内置指令，作用是仅渲染指定组件或元素一次，并跳过未来对其更新。
- 如果有一些元素或者组件在初始化渲染之后不再需要变化，这种情况下适合使用`v-once`，这样哪怕这些数据变化，vue也会跳过更新，是一种代码优化手段。
- 只需要作用的组件或元素上加上v-once即可。
- vue3.2之后，又增加了`v-memo`指令，可以有条件缓存部分模板并控制它们的更新，可以说控制力更强了。
- 编译器发现元素上面有v-once时，会将首次计算结果存入缓存对象，组件再次渲染时就会从缓存获取，从而避免再次计算。

App.vue

```vue
<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1 v-once>{{ msg }}</h1>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>
```



# 11. 递归组件

1. 如果某个组件通过组件名称引用它自己，这种情况就是递归组件。
2. 实际开发中类似Tree、Menu这类组件，它们的节点往往包含子节点，子节点结构和父节点往往是相同的。这类组件的数据往往也是树形结构，这种都是使用递归组件的典型场景。
3. 使用递归组件时，由于并未也不能在组件内部导入它自己，所以设置组件`name`属性，用来查找组件定义，如果使用SFC，则可以通过SFC文件名推断。组件内部通常也要有递归结束条件，比如model.children这样的判断。
4. 查看生成渲染函数可知，递归组件查找时会传递一个布尔值给`resolveComponent`，这样实际获取的组件就是当前组件本身。



App.vue

在父组件配置数据结构 数组对象格式 传给子组件

```vue
<script setup>
import { reactive } from 'vue'
import Tree from './Tree.vue'

const data = reactive([
    {
        name: '1',
        checked: false,
        children: [
            {
                name: '1-1',
                checked: false,
            }
        ]
    },
    {
        name: '2',
        checked: false,
    },
    {
        name: '3',
        checked: false,
        children: [
            {
                name: '3-1',
                checked: false,
                children: [
                    {
                        name: '3-1-1',
                        checked: false,
                    },
                    {
                        name: '3-1-2',
                        checked: false,
                    }
                ]
            }
        ]
    }
])
</script>

<template>
    <div>
        <Tree :data="data" />
    </div>
</template>
```

Tree.vue

子组件接收值 第一个script

```vue
<script setup>
const props = defineProps([
    'data'
])
</script>

<template>
    <div class="tree" v-for="item in data">
        <input v-model="item.checked" type="checkbox"><span>{{ item.name }}</span>
        <Tree v-if="item.children" :data="item.children" />
    </div>
</template>

<style scoped lang="less">
.tree {
    margin-left: 10px;
}
</style>
```



## 递归组件处理事件

Tree.vue

```vue
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
```



# 12. 动态组件

什么是动态组件 就是：让多个组件使用同一个挂载点，并动态切换，这就是动态组件

在挂载点使用**component**标签，然后使用**v-bind:is="组件"**



## 基本用法

A.vue

```vue
<script setup>

</script>

<template>
    <div class="com">A 组件</div>
</template>

<style scoped lang="less">
.com {
    width: 660px;
    height: 300px;
    border: 2px solid #ccc;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
```

B.vue

```vue
<script setup>

</script>

<template>
    <div class="com">B 组件</div>
</template>

<style scoped lang="less">
.com {
    width: 660px;
    height: 300px;
    border: 2px solid #ccc;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
```

C.vue

```vue
<script setup>

</script>

<template>
    <div class="com">C 组件</div>
</template>

<style scoped lang="less">
.com {
    width: 660px;
    height: 300px;
    border: 2px solid #ccc;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
```

App.vue

```vue
<script setup>
import { ref, reactive } from 'vue'
import Avue from './A.vue'
import Bvue from './B.vue'
import Cvue from './C.vue'

const comId = ref(Avue)
const active = ref(0)

const data = reactive([
    {
        name: 'A组件',
        com: Avue
    },
    {
        name: 'B组件',
        com: Bvue
    },
    {
        name: 'C组件',
        com: Cvue
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
```

运行到浏览器查看，每点击其组件叫跳转至该组件



### 性能优化

1. 在Vue2 的时候is 是通过组件名称切换的 在Vue3 setup 是通过组件实例切换的

2. 如果把组件实例放到Reactive Vue会给你一个警告runtime-core.esm-bundler.js:38 [Vue warn]: Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`. 
   Component that was made reactive: 

这是因为 reactive 会进行proxy 代理，而组件代理之后毫无用处，节省性能开销 推荐使用shallowRef 或者 markRaw 跳过proxy 代理

修改如下：

```js
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
```



# 13. 异步组件

在大型项目中，如果首屏一次性加载所有的组件，会导致首次加载时间过长，影响用户体验(甚至导致用户流失)

解决：讲内容或组件分割出来，当需要的时候再加载，异步组件就是拆分的块



Some.vue

```vue
<script setup>
console.log("我是异步组件")
</script>

<template>
    <div>
        <h3>== 我是异步组件 ==</h3>
    </div>
</template>
```

App.vue

```vue
<script setup>
import { ref } from 'vue'
import Some from './Some.vue'

const isLoaded = ref(false)
</script>

<template>
    <h2>异步组件</h2>
    <div class="box">
        <button type="button" @click="isLoaded = true">加载组件</button>
        <Some v-if="isLoaded" />
    </div>
</template>
```

运行到浏览器查看

问题：在**network**中被没有新的资源被载入，说明这个组件在首屏已经被载入，之后只是被调用

修改 App.vue 的 script 代码

```vue
<script setup>
import { ref, defineAsyncComponent } from 'vue'
// import Some from './Some.vue'

const isLoaded = ref(false)

const Some = defineAsyncComponent(() => {
    return import('./Some.vue')
})
</script>
```



# 14. vue3 新特性

- Composition API
- SFC Composition API语法糖
- Teleport传送门
- Fragments片段
- Emits选项
- 自定义渲染器
- SFC CSS变量
- Suspense



1. api层面Vue3新特性主要包括：Composition API、SFC Composition API语法糖、Teleport传送门、Fragments 片段、Emits选项、自定义渲染器、SFC CSS变量、Suspense
2. 另外，Vue3.0在框架层面也有很多亮眼的改进：

- 更快
  - 虚拟DOM重写
  - 编译器优化：静态提升、patchFlags、block等
  - 基于Proxy的响应式系统
- 更小：更好的摇树优化
- 更容易维护：TypeScript + 模块化
- 更容易扩展
  - 独立的响应化模块
  - 自定义渲染器



# 15. Vue 3.0的设计目标是什么？做了哪些优化?

- Vue3的最大设计目标是替代Vue2，为了实现这一点，Vue3在以下几个方面做了很大改进，如：易用性、框架性能、扩展性、可维护性、开发体验等
- 易用性方面主要是API简化，比如`v-model`在Vue3中变成了Vue2中`v-model`和`sync`修饰符的结合体，用户不用区分两者不同，也不用选择困难。类似的简化还有用于渲染函数内部生成VNode的`h(type, props, children)`，其中`props`不用考虑区分属性、特性、事件等，框架替我们判断，易用性大增。
- 开发体验方面，新组件`Teleport`传送门、`Fragments` 、`Suspense`等都会简化特定场景的代码编写，`SFC Composition API`语法糖更是极大提升我们开发体验。
- 扩展性方面提升如独立的`reactivity`模块，`custom renderer` API等
- 可维护性方面主要是`Composition API`，更容易编写高复用性的业务逻辑。还有对TypeScript支持的提升。
- 性能方面的改进也很显著，例如编译期优化、基于`Proxy`的响应式系统



# 16. ref 与 reactive 异同



## ref

接受一个内部值并返回一个[应式且可变的 ref 对象

ref 对象仅有一个 `.value` property，指向该内部值

```vue
<script setup>
import { ref, isRef, shallowRef, triggerRef, customRef } from 'vue'

const ich = ref({ name: 'ich' })
const change1 = () => {
    // 注意被ref包装之后需要.value 来进行赋值
    ich.value.name = 'du'

    // 判断是不是一个ref对象
    console.log(isRef(ich))
}

const du = shallowRef({ name: 'du' })
const change2 = () => {
    // shallowRef 浅层次的响应，创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的
    // du.value.name = "ich" // 改变了，但是视图不会发生变化，修改其属性是非响应式的这样是不会改变的
    // console.log(du)

    du.value = {
        name: 'ich'
    }
    console.log(du)

    // ref和 shallowRef是不能一块写的不然会影响shallowRef 造成视图的更新
}

const ichdu = shallowRef({ name: 'ichdu' })
const change3 = () => {
    ichdu.value.name = "我被影响了"
    triggerRef(ichdu)
    console.log(ichdu)
}

// 自定义ref 
// customRef 是个工厂函数要求返回一个对象 并且实现 get 和 set  适合去做防抖之类的
function myRef(value) {
    let timer
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newVal) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    console.log('触发了set')
                    value = newVal
                    trigger()
                }, 500)
            }
        }
    })
}
const name = myRef('my name')
const change4 = () => {
    name.value = 'ichdu'
}
</script>

<template>
    <div>ref：{{ ich }}</div>
    <button @click="change1">修改ich</button>
    <hr>
    <div>shallowRef：{{ du }}</div>
    <button @click="change2">修改du</button>
    <hr>
    <div>triggerRef：{{ ichdu }}</div>
    <button @click="change3">强制更新</button>
    <hr>
    <div>customRef：{{ name }}</div>
    <button @click="change4">自定义ref </button>
</template>
```



## reactive

用来绑定复杂的数据类型 例如 对象 数组

```vue
<script setup>
import { reactive, readonly, shallowReactive } from 'vue'

// ref 支持所有类型 reactive 引用类型 Array Object Map Set
// ref 取值赋值都需要加 .value，reactive 是不需要 .value
let form = reactive({
    name: 'ich',
    age: 23
})
const submit = () => {
    console.log(form)
}

let list = reactive([])
const add = () => {
    setTimeout(() => {
        // let res = ['x', 'xx', 'xxx']
        // list = res
        // console.log(list)
        // 出现数据变化但是视图没有变化问题
        // 原因：reactive 是一个 proxy 代理的对象，不能直接赋值，否则会破坏响应式对象的

        // 解决方案1：数组 可以使用 push 加 解构
        let res = ['x', 'xx', 'xxx']
        list.push(...res)
        console.log(list)
    }, 1000)
}

// 解决方案1：添加一个对象，把数组作为一个属性去解决
let list1 = reactive({ arr: [] })
const add1 = () => {
    setTimeout(() => {
        let res = ['x', 'xx', 'xxx']
        list1.arr = res
        console.log(list)
    }, 1000)
}

// readonly 拷贝一份proxy对象将其设置为只读
let obj = reactive({ name: 'ich' })
const read = readonly(obj)
const show = () => {
    // read.name = 'du' // 只读，不可以修改
    obj.name = 'du' //可以修改，受到原始对象影响
    console.log(obj, read)
}

// shallowReactive 只能对浅层的数据 如果是深层的数据只会改变值 不会改变视图
const obj1 = {
    a: 1,
    first: {
        b: 2,
        second: {
            c: 3
        }
    }
}
const state = shallowReactive(obj1)
function change1() {
    state.a = 7
}
function change2() {
    state.first.b = 8
    state.first.second.c = 9
    console.log(state)
}
</script>

<template>
    <div>
        <form>
            <input v-model="form.name" type="text">
            <br>
            <input v-model="form.age" type="text">
            <br>
            <button @click.prevent="submit">提交</button>
        </form>
    </div>
    <hr>
    <div>
        <ul v-for="item in list">
            <li>{{ item }}</li>
        </ul>
        <button @click="add">添加</button>
    </div>
    <hr>
    <div>
        <ul v-for="item1 in list1.arr">
            <li>{{ item1 }}</li>
        </ul>
        <button @click="add1">添加</button>
    </div>
    <hr>
    <div>
        <button @click="show">查看</button>
    </div>
    <hr>
    <div>
        <div>{{ state }}</div>
        <button @click="change1">test1</button>
        <button @click="change2">test2</button>
    </div>
</template>
```



## ref 和 reactive 异同

- `ref`接收内部值（inner value）返回响应式`Ref`对象，`reactive`返回响应式代理对象
- 从定义上看`ref`通常用于处理单值的响应式，`reactive`用于处理对象类型的数据响应式
- 两者均是用于构造响应式数据，但是`ref`主要解决原始值的响应式问题
- ref返回的响应式数据在JS中使用需要加上`.value`才能访问其值，在视图中使用会自动脱ref，不需要`.value`；ref可以接收对象或数组等非原始值，但内部依然是`reactive`实现响应式；reactive内部如果接收Ref对象会自动脱ref；使用展开运算符(...)展开reactive返回的响应式对象会使其失去响应性，可以结合toRefs()将值转换为Ref对象之后再展开。
- reactive内部使用Proxy代理传入对象并拦截该对象各种操作（trap），从而实现响应式。ref内部封装一个RefImpl类，并设置get value/set value，拦截用户对值的访问，从而实现响应式。



# 17. vue3 性能提升体现在哪些方面？

* 代码层面性能优化主要体现在全新响应式API，基于Proxy实现，初始化时间和内存占用均大幅改进
* 编译层面做了更多编译优化处理，比如静态提升、动态内容标记、事件缓存，区块等，可以有效跳过大量diff过程
* 打包时更好的支持tree-shaking，因此整体体积更小，加载更快



# 18. vue3 为什么要用Proxy API替代defineProperty APl ?

* JS中做属性拦截常见的方式有三：`defineProperty`，`getter/setters`和`Proxies`
* Vue2中使用`defineProperty `的原因是，2013年时只能用这种方式。由于该API存在一些局限性，比如对于数组的拦截有问题，为此vue需要专门为数组响应式做一套实现。另外不能拦截那些新增、删除属性；最后`defineProperty`方案在初始化时需要深度递归遍历待处理的对象才能对它进行完全拦截，明显增加了初始化的时间。
* 以上两点在`Proxy`出现之后迎刃而解，不仅可以对数组实现拦截，还能对`Map`、`Set`实现拦截；另外`Proxy`的拦截也是懒处理行为，如果用户没有访问嵌套对象，那么也不会实施拦截，这就让初始化的速度和内存占用都改善了。
* 当然`Proxy`是有兼容性问题的，IE完全不支持，所以如果需要IE兼容就不合适



# 19. Composition API 与 Options API 有什么不同

* `Composition API`最主要作用是能够简洁、高效复用逻辑。解决了过去`options API`中 mixins`的各种缺点；另外 Composition API`具有更加敏捷的代码组织能力，很多用户喜欢`Options API`，认为所有东西都有固定位置的选项放置代码，但是单个组件增长过大之后这反而成为限制，一个逻辑关注点分散在组件各处，形成代码碎片，维护时需要反复横跳，`Composition API `则可以将它们有效组织在一起。最后`Composition API` 拥有更好的类型推断，对ts支持更友好，`Options API`在设计之初并未考虑类型推断因素，虽然官方为此做了很多复杂的类型体操，确保用户可以在使用`Options API `时获得类型推断，然而还是没办法用在`mixins`和`provide/inject`上。
* Vue3首推`Composition API` ，但是这会在代码组织上多花点心思，因此在选择上，如果项目属于中低复杂度的场景，`Options API`仍是一个好选择。对于那些大型，高扩展，强维护的项目上，`Composition API`会获得更大收益。



# 20. 子组件可以直接改变父组件的数据吗？

1. 所有的 prop 都使得其父子之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。另外，每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器控制台中发出警告。

   ```vue
   const props = defineProps(['foo'])
   // 下面行为会被警告, props是只读的!
   props.foo = 'bar'
   ```

2. 实际开发过程中有两个场景会想要修改一个属性：

- 这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。在这种情况下，最好定义一个本地的 data，并将这个 prop 用作其初始值：

  ```vue
  const props = defineProps(['initialCounter'])
  const counter = ref(props.initialCounter)
  ```

- 这个 prop 以一种原始的值传入且需要进行转换。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：

  ```vue
  const props = defineProps(['size'])
  // prop变化，计算属性自动更新
  const normalizedSize = computed(() => props.size.trim().toLowerCase())
  ```

3. 实践中如果确实想要改变父组件属性应该emit一个事件让父组件去做这个变更。注意虽然我们不能直接修改一个传入的对象或者数组类型的prop，但是我们还是能够直接改内嵌的对象或属性。



# 21. 从0到1自己构架一个vue项目，说说有哪些步骤、哪些重要插件、目录结构你会怎么组织

1. 从0创建一个项目大致会做以下事情：项目构建、引入必要插件、代码规范、提交规范、常用库和组件
2. 目前vue3项目我会用vite或者create-vue创建项目
3. 接下来引入必要插件：路由插件vue-router、状态管理vuex/pinia、ui库可以选择element-plus和antd-vue、http工具会选axios
4. 其他比较常用的库有vueuse，nprogress，图标可以使用vite-svg-loader
5. 下面是代码规范：结合prettier和eslint即可
6. 最后是提交规范，可以使用husky，lint-staged，commitlint

------

1. 目录结构有如下：

   `.vscode`：用来放项目中的 vscode 配置

   `plugins`：用来放 vite 插件的 plugin 配置

   `public`：用来放一些诸如 页头icon 之类的公共文件，会被打包到dist根目录下

   `src`：用来放项目代码文件

   `api`：用来放http的一些接口配置

   `assets`：用来放一些 CSS 之类的静态资源

   `components`：用来放项目通用组件

   `layout`：用来放项目的布局

   `router`：用来放项目的路由配置

   `store`：用来放状态管理Pinia的配置

   `utils`：用来放项目中的工具方法类

   `views`：用来放项目的页面文件



# 22. vue 最佳实践有哪些？

从编码风格、性能、安全等方面说几条：

1. 编码风格方面：
   - 命名组件时使用`多词`风格避免和HTML元素冲突
   - 使用`细节化`方式定义属性而不是只有一个属性名
   - 属性名声明时使用`驼峰命名`，模板或`jsx`中使用`肉串命名`
   - 使用`v-for`时务必加上`key`，且不要跟`v-if`写在一起
2. 性能方面：
   - 路由懒加载减少应用尺寸
   - 利用SSR减少首屏加载时间
   - 利用v-once渲染那些不需要更新的内容
   - 一些长列表可以利用虚拟滚动技术避免内存过度占用
   - 对于深层嵌套对象的大数组可以使用`shallowRef`或`shallowReactive`降低开销
   - 避免不必要的组件抽象

------

1. 安全：
   - 不使用不可信模板，例如使用用户输入拼接模板：`template: <div> + userProvidedString + </div>`
   - 小心使用v-html，:url，:style等，避免html、url、样式等注入
2. 等等......



# 23. Vue性能优化方法？

- 主要从Vue代码编写层面说一些优化手段，例如：代码分割、服务端渲染、组件缓存、长列表优化等

- 最常见的路由懒加载：有效拆分App尺寸，访问时才异步加载

  ```js
  const router = createRouter({
    routes: [
      // 借助webpack的import()实现异步组件
      { path: '/foo', component: () => import('./Foo.vue') }
    ]
  })
  ```

- `keep-alive`缓存页面：避免重复创建组件实例，且能保留缓存组件状态

  ```vue
  <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
    </keep-alive>
  </router-view>
  ```

- 使用`v-show`复用DOM：避免重复创建组件

  ```vue
  <template>
    <div class="cell">
      <!-- 这种情况用v-show复用DOM，比v-if效果好 -->
      <div v-show="value" class="on">
        <Heavy :n="10000"/>
      </div>
      <section v-show="!value" class="off">
        <Heavy :n="10000"/>
      </section>
    </div>
  </template>
  ```

- `v-for` 遍历避免同时使用 `v-if`：实际上在Vue3中已经是个错误写法

  ```vue
  <template>
      <ul>
        <li
          v-for="user in activeUsers"
          <!-- 避免同时使用，vue3中会报错 -->
          <!-- v-if="user.isActive" -->
          :key="user.id">
          {{ user.name }}
        </li>
      </ul>
  </template>
  <script>
    export default {
      computed: {
        activeUsers: function () {
          return this.users.filter(user => user.isActive)
        }
      }
    }
  </script>
  ```

- v-once和v-memo：不再变化的数据使用`v-once`

  ```vue
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  按条件跳过更新时使用`v-momo`：下面这个列表只会更新选中状态变化项

  ```vue
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  > https://vuejs.org/api/built-in-directives.html#v-memo

- 长列表性能优化：如果是大数据长列表，可采用虚拟滚动，只渲染少部分区域的内容

  ```html
  <recycle-scroller
    class="items"
    :items="items"
    :item-size="24"
  >
    <template v-slot="{ item }">
      <FetchItemView
        :item="item"
        @vote="voteItem(item)"
      />
    </template>
  </recycle-scroller>
  ```

  > 一些开源库：
  >
  > - [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
  > - [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)

- 事件的销毁：Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。

  ```js
  export default {
    created() {
      this.timer = setInterval(this.refresh, 2000)
    },
    beforeUnmount() {
      clearInterval(this.timer)
    }
  }
  ```

- 图片懒加载

  对于图片过多的页面，为了加速页面加载速度，所以很多时候我们需要将页面内未出现在可视区域内的图片先不做加载， 等到滚动到可视区域后再去加载。

  ```html
  <img v-lazy="/static/img/1.png">
  ```

  > 参考项目：[vue-lazyload](https://github.com/hilongjw/vue-lazyload)

- 第三方插件按需引入

  像`element-plus`这样的第三方组件库可以按需引入避免体积太大。

  ```js
  import { createApp } from 'vue';
  import { Button, Select } from 'element-plus';
  
  const app = createApp()
  app.use(Button)
  app.use(Select)
  ```

- 子组件分割策略：较重的状态组件适合拆分

  ```vue
  <template>
    <div>
      <ChildComp/>
    </div>
  </template>
  
  <script>
  export default {
    components: {
      ChildComp: {
        methods: {
          heavy () { /* 耗时任务 */ }
        },
        render (h) {
          return h('div', this.heavy())
        }
      }
    }
  }
  </script>
  ```

  但同时也不宜过度拆分组件，尤其是为了所谓组件抽象将一些不需要渲染的组件特意抽出来，组件实例消耗远大于纯dom节点。

- 服务端渲染/静态网站生成：SSR/SSG；如果SPA应用有首屏渲染慢的问题，可以考虑SSR、SSG方案优化。



# 24. SPA、SSR的区别是什么

- SPA（Single Page Application）即**单页面应用**。一般也称为 **客户端渲染**（Client Side Render）， 简称 CSR。SSR（Server Side Render）即 **服务端渲染**。一般也称为 **多页面应用**（Mulpile Page Application），简称 MPA。
- SPA应用只会首次请求html文件，后续只需要请求JSON数据即可，因此用户体验更好，节约流量，服务端压力也较小。但是首屏加载的时间会变长，而且SEO不友好。为了解决以上缺点，就有了SSR方案，由于HTML内容在服务器一次性生成出来，首屏加载快，搜索引擎也可以很方便的抓取页面信息。但同时SSR方案也会有性能，开发受限等问题。
- 在选择上，如果我们的应用存在首屏加载优化需求，SEO需求时，就可以考虑SSR。
- 但并不是只有这一种替代方案，比如对一些不常变化的静态网站，SSR反而浪费资源，我们可以考虑[预渲染](https://github.com/chrisvfritz/prerender-spa-plugin)（prerender）方案。另外nuxt.js/next.js中给我们提供了SSG（Static Site Generate）静态网站生成方案也是很好的静态站点解决方案，结合一些CI手段，可以起到很好的优化效果，且能节约服务器资源。



# 25. 使用vue渲染大量数据时应该怎么优化？

- 在大型企业级项目中经常需要渲染大量数据，此时很容易出现卡顿的情况。比如大数据量的表格、树。
- 处理时要根据情况做不通处理：
  - 可以采取分页的方式获取，避免渲染大量数据
  - [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)等虚拟滚动方案，只渲染视口范围内的数据
  - 如果不需要更新，可以使用`v-once`方式只渲染一次
  - 通过[v-memo](https://vuejs.org/api/built-in-directives.html#v-memo)可以缓存结果，结合`v-for`使用，避免数据变化时不必要的VNode创建
  - 可以采用懒加载方式，在用户需要的时候再加载数据，比如tree组件子树的懒加载
- 总之，还是要看具体需求，首先从设计上避免大数据获取和渲染；实在需要这样做可以采用虚表的方式优化渲染；最后优化更新，如果不需要更新可以v-once处理，需要更新可以v-memo进一步优化大数据更新性能。其他可以采用的是交互方式优化，无线滚动、懒加载等方案。



# 26. vue 响应式

- 所谓数据响应式就是能够使数据变化可以被检测并对这种变化做出响应的机制。
- mvvm框架中要解决的一个核心问题是连接数据层和视图层，通过数据驱动应用，数据变化，视图更新，要做到这点的就需要对数据做响应式处理，这样一旦数据发生变化就可以立即做出更新处理。
- 以vue为例说明，通过数据响应式加上虚拟DOM和patch算法，可以使我们只需要操作数据，完全不用接触繁琐的dom操作，从而大大提升开发效率，降低开发难度。
- vue2中的数据响应式会根据数据类型来做不同处理，如果是对象则采用Object.defineProperty()的方式定义数据拦截，当数据被访问或发生变化时，我们感知并作出响应；如果是数组则通过覆盖该数组原型的方法，扩展它的7个变更方法，使这些方法可以额外的做更新通知，从而作出响应。这种机制很好的解决了数据响应化的问题，但在实际使用中也存在一些缺点：比如初始化时的递归遍历会造成性能损失；新增或删除属性时需要用户使用Vue.set/delete这样特殊的api才能生效；对于es6中新产生的Map、Set这些数据结构不支持等问题。
- 为了解决这些问题，vue3重新编写了这一部分的实现：利用ES6的Proxy机制代理要响应化的数据，它有很多好处，编程体验是一致的，不需要使用特殊api，初始化性能和内存消耗都得到了大幅改善；另外由于响应化的实现代码抽取为独立的reactivity包，使得我们可以更灵活的使用它，我们甚至不需要引入vue都可以体验。

# 27. 虚拟 DOM

1. 虚拟dom顾名思义就是虚拟的dom对象，它本身就是一个 `JavaScript` 对象，只不过它是通过不同的属性去描述一个视图结构。

2. 通过引入vdom我们可以获得如下好处：

   **将真实元素节点抽象成 VNode，有效减少直接操作 dom 次数，从而提高程序性能**

   - 直接操作 dom 是有限制的，比如：diff、clone 等操作，一个真实元素上有许多的内容，如果直接对其进行 diff 操作，会去额外 diff 一些没有必要的内容；同样的，如果需要进行 clone 那么需要将其全部内容进行复制，这也是没必要的。但是，如果将这些操作转移到 JavaScript 对象上，那么就会变得简单了。
   - 操作 dom 是比较昂贵的操作，频繁的dom操作容易引起页面的重绘和回流，但是通过抽象 VNode 进行中间处理，可以有效减少直接操作dom的次数，从而减少页面重绘和回流。

   **方便实现跨平台**

   - 同一 VNode 节点可以渲染成不同平台上的对应的内容，比如：渲染在浏览器是 dom 元素节点，渲染在 Native( iOS、Android) 变为对应的控件、可以实现 SSR 、渲染到 WebGL 中等等
   - Vue3 中允许开发者基于 VNode 实现自定义渲染器（renderer），以便于针对不同平台进行渲染。

3. vdom如何生成？在vue中我们常常会为组件编写模板 - template， 这个模板会被编译器 - compiler编译为渲染函数，在接下来的挂载（mount）过程中会调用render函数，返回的对象就是虚拟dom。但它们还不是真正的dom，所以会在后续的patch过程中进一步转化为dom。

![image20220209153820845](https://gitee.com/57code/picgo/raw/master/image-20220209153820845.png)

1. 挂载过程结束后，vue程序进入更新流程。如果某些响应式数据发生变化，将会引起组件重新render，此时就会生成新的vdom，和上一次的渲染结果diff就能得到变化的地方，从而转换为最小量的dom操作，高效更新视图。



# 28. diff 算法

1. Vue中的diff算法称为patching算法，它由Snabbdom修改而来，虚拟DOM要想转化为真实DOM就需要通过patch方法转换。

2. 最初Vue1.x视图中每个依赖均有更新函数对应，可以做到精准更新，因此并不需要虚拟DOM和patching算法支持，但是这样粒度过细导致Vue1.x无法承载较大应用；Vue 2.x中为了降低Watcher粒度，每个组件只有一个Watcher与之对应，此时就需要引入patching算法才能精确找到发生变化的地方并高效更新。

3. vue中diff执行的时刻是组件内响应式数据变更触发实例执行其更新函数时，更新函数会再次执行render函数获得最新的虚拟DOM，然后执行patch函数，并传入新旧两次虚拟DOM，通过比对两者找到变化的地方，最后将其转化为对应的DOM操作。

4. patch过程是一个递归过程，遵循深度优先、同层比较的策略；以vue3的patch为例：

- 首先判断两个节点是否为相同同类节点，不同则删除重新创建
- 如果双方都是文本则更新文本内容
- 如果双方都是元素节点则递归更新子元素，同时更新元素属性
- 更新子节点时又分了几种情况：
  - 新的子节点是文本，老的子节点是数组则清空，并设置文本；
  - 新的子节点是文本，老的子节点是文本则直接更新文本；
  - 新的子节点是数组，老的子节点是文本则清空文本，并创建新子节点数组中的子元素；
  - 新的子节点是数组，老的子节点也是数组，那么比较两组子节点，更新细节blabla

5. vue3中引入的更新策略：编译期优化patchFlags、block等



# 30. key的作用

- key的作用主要是为了更高效的更新虚拟DOM。
- vue在patch过程中**判断两个节点是否是相同节点是key是一个必要条件**，渲染一组列表时，key往往是唯一标识，所以如果不定义key的话，vue只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了频繁更新元素，使得整个patch过程比较低效，影响性能。
- 实际使用中在渲染一组列表时key必须设置，而且必须是唯一标识，应该避免使用数组索引作为key，这可能导致一些隐蔽的bug；vue中在使用相同标签元素过渡切换时，也会使用key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。
- 从源码中可以知道，vue判断两个节点是否相同时主要判断两者的key和元素类型等，因此如果不设置key，它的值就是undefined，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的。



# 31. 从 template 到 render 处理过程

- Vue中有个独特的编译器模块，称为`compiler`，它的主要作用是将用户编写的`template`编译为`js`中可执行的`render`函数。
- 之所以需要这个编译过程是为了便于前端程序员能高效的编写视图模板。相比而言，我们还是更愿意用HTML来编写视图，直观且高效。手写`render`函数不仅效率底下，而且失去了编译期的优化能力。
- 在Vue中编译器会先对`template`进行解析，这一步称为`parse`，结束之后会得到一个JS对象，我们成为抽象语法树AST，然后是对AST进行深加工的转换过程，这一步成为`transform`，最后将前面得到的AST生成为JS代码，也就是render函数。



