// 全局通信组件
// 呼叫中心
// 可以让任意组件之间进行通信
import Vue from 'vue'

export default new Vue()

// b注册通信的事件
// import globalBus from '@/utils/global-bus'
// globalBus.$on('foo', (data) => {
//   处理函数
// })

// a发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('foo', 15613)
// 通信两端所使用的事件名称必须一致
