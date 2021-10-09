import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求的时候 带上token
    const token = store.state.user.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if(response.data.success) {
      return response.data
    } else {
      // 统一进行错误提示
      Message({
        message: response.data.message,
        type:'error',
        duration: 5 * 1000,
      })
      // 抛出接口异常
      return Promise.reject(new Error(response.data.message))
    }
  },
  error => {
    // 判断后端返回的状态码
    if(error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/userLogout')

      router.push('/login')

      return Message({
        message: '用户信息过期,请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
