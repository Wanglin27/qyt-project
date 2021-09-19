import Vue from 'vue'
import VueRouter from 'vue-router'

// 在VueCLI创建的项目中 @表示src目录
// 它是src目录的路径别名
// 建议：如果加载的资源路径就在当前目录下 那就正常写
// 如果需要进行父级路径查找都是用@
import Login from '@/views/login'

Vue.use(VueRouter)

//  路由配置表
const routes = [{
  path: '/login',
  name: 'login',
  component: Login
}]

const router = new VueRouter({
  routes
})

export default router
