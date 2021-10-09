// token持久化
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserProfile, getUserDetailById } from '@/api/user'

const state = {
  token: getToken() || '', // 共享的token
  userInfo: {} // 用户信息
}

const mutations = {
  setToken(state,newToken) {
    state.token = newToken
    // 持久化token
    setToken(newToken)
  },
  // 移除token
  removeToken(state) {
    state.token = ''

    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },

  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // data表示接口参数
  async userLogin(context, obj) {
    // console.log('action userLogin', context, obj)
    // 调用ajax请求去做登陆
    const res = await login(obj)
    // 在actions中，如果要修改state，还是要调用mutaions
    // context.commit('mutation名'， 参数)
    context.commit('setToken', res.data)
  },
  // 获取用户信息
  async getUserInfo(context) {
    // 获取用户信息的接口
    const res = await getUserProfile()
    // 获取头像的接口
    const detailInfo = await getUserDetailById(res.data.userId)
    // 将两个数据合并成完成的用户信息对象
    context.commit('setUserInfo', { ...detailInfo.data, ...res.data })
  },
  // 退出功能
  userLogout(context) {
    // 移除 token
    context.commit('removeToken')
    // 移除 userInfo
    context.commit('reomveUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

