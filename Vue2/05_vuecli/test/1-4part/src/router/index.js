import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Hi from '@/components/Hi'
import Hi1 from '@/components/Hi1'
import Hi2 from '@/components/Hi2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/Hi',
      name: 'Hi',
      component: Hi,
      children: [
        { path: '/', name: 'HelloWorld/Hi', component: Hi },
        { path: 'hi1', name: 'HelloWorld/Hi/hi1', component: Hi1 },
        { path: 'hi2', name: 'HelloWorld/Hi/hi2', component: Hi2 }
      ]
    }
  ]
})
