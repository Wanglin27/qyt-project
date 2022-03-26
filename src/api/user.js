// 用户相关请求模块
import request from '@/utils/request'
// 用户登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // data 用来设置 POST 请求体
    data
  })
}

// export function login (data) {
//   return request({
//     method: 'POST',
//     url: '/mp/v1_0/authorizations',
//     // data 用来设置 POST 请求体
//     data
//   })
// }

export const getUserProfile = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // headers: {
    //   // 属性名和值看接口要求
    //   // Authorization: 'Bearer ' + user.token
    //   // token就相当于用户的令牌 放在请求头里给后台识别
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

export const updateUserPhoto = (data) => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 修改用户基本信息
export const updateUserProfile = (data) => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
