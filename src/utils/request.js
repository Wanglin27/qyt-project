// 基于 axios 封装的请求模块
// 你之前这样
// axios.defaults.baseURL = ''
// 但这个只能写一个请求接口地址 所以我们可以用axios.create

import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '../router'
// 在非组件模块可以这样添加使用element的message提示组件
import {
  Message
} from 'element-ui'

// 创建一个axios实例，说白了就是复制了一个axios
// 不同的axios实例可以有不同的配置 而且不会相互冲突
// 我们通过这个实例去发请求，把需要的配置配置给这个实例处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径

  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// request.default.baseURL = ""

// Add a 请求拦截器
// 所有请求都会经过这里
request.interceptors.request.use(
  // config是当前请求相关的配置信息对象
  // config是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 当这里return config之后请求才会真正发出去
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败会经过这里
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有响应码为2xxx的响应都会经过这里
  // response是响应结果
  // 注意一定要return响应结果 否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  // 超出2xxx的响应码都会经过这里
  console.dir(error)
  const {
    status
  } = error.response
  if (status === 401) {
    // 清除本地存储的用户登录状态
    window.localStorage.removeItem('user')
    // 跳转到登录界面
    router.push('/login')
    Message('登录状态无效 请重新登录')
  } else if (status === 403) {
    // token未携带或已过期
    Message('没有操作权限')
  } else if (status === 400) {
    // 客户端参数错误
    Message('请求参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常 请稍后重试')
  }
  return Promise.reject(error)
})
// 导出请求方法
export default request
