import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import './style.css'
// import App from './App.vue'
// import App from './01-父传子/App.vue'
// import App from './02-子传父/App.vue'
// import App from './04-provide和inject/App.vue'
// import App from './05-v-if和v-for的优先级/App.vue'
// import App from './06-生命周期/App.vue'
// import App from './07-v-model/App.vue'
// import App from './08-nextTick/App.vue'
// import App from './09-computed/App.vue'
// import App from './10-watch/App.vue'
// import App from './11-watchRffect/App.vue'
// import App from './12-keep-alive/App.vue'
import App from './13-自定义指令/App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
