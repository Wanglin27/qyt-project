import Vue from 'vue'
import VueRouter from 'vue-router'

// 在VueCLI创建的项目中 @表示src目录
// 它是src目录的路径别名
// 建议：如果加载的资源路径就在当前目录下 那就正常写
// 如果需要进行父级路径查找都是用@
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/artical'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Fans from '@/views/fans'
import Settings from '@/views/settings'

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
      }, {
        path: '/article',
        name: 'article',
        component: Article
      }, {
        path: '/publish',
        name: 'publish',
        component: Publish
      }, {
        path: '/image',
        name: 'image',
        component: Image
      }, {
        path: '/comment',
        name: 'comment',
        component: Comment
      }, {
        path: '/fans',
        name: 'fans',
        component: Fans
      }, {
        path: 'settings',
        name: 'settings',
        component: Settings
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

const user = JSON.parse(window.localStorage.getItem('user'))
// 路由导航守卫：说白了所有页面的导航都会经过这里
// to：要去的路由页面信息
// from： 从那个页面来的路由页面信息
// next：放行方法
router.beforeEach((to, from, next) => {
  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    // 已登录允许通过
    if (user) {
      next()
    } else {
      // 没有登录跳转到登录页面
      next('/login')
    }
  } else {
    // 是登录页面正常通过
    next()
  }
})
// 其实我们在组件中使用的this.$router其实就是这个模块中的router
// 如果想要在非组件模块就要导入router
export default router
