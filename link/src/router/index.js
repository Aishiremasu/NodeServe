import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      // 首页
      path: '/',
      component: () => import('@/components')
    },
    {
      // 登录页
      path: '/login.html',
      component: () => import('@/components/user/login.vue')
    },
    {
      // 注册页
      path: '/register.html',
      component: () => import('@/components/user/register.vue')
    },
      // 调取easy-mock接口数据
    {
      path: '/info',
      component: () => import('@/components/info')
    }
  ]
})
