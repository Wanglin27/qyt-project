import Vue from 'vue'
import VueRouter from 'vue-router'

// 在VueCLI创建的项目中 @表示src目录
// 它是src目录的路径别名
// 建议：如果加载的资源路径就在当前目录下 那就正常写
// 如果需要进行父级路径查找都是用@
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout'

Vue.use(VueRouter)

//  路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/', // 命名路由 layout 有一个默认子路由 这个名字没有意义 所以警告
    // name: 'layout', // 正确的做法： 如果有默认子路由 就不要给父路由起名
    component: Layout,
    children: [
      {
        path: '', // path 为空 会作为默认子路由渲染
        name: 'home',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
