import request from '@/utils/request'


export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'GET',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'POST'
  })
}

// 以后方便分析代码
/**
 * @description 登录接口
 * @param {mobile,password} data number
 * @returns Promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户资料
 * @param {*} 
 * @return {*}
*/
 export function getUserProfile() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * @description: 获取用户头像
 * @param {*} id 用户id
 * @return {*}
 */
 export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}