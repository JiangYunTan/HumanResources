import router from './router'
import store from './store'

// 进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

const whitelist = ['/login', '/404']

// 路由前置守卫
import getPageTitle from '@/utils/get-page-title'
router.beforeEach(async (to, from, next) => {
   // 对当前页面的标题进行设计
   document.title = getPageTitle(to.meta.title)
   const token = store.state.user.token
   NProgress.start()
   if (token) {
      if(to.path === '/login') {
         next('/')
      } else {
         // 如果存在 token，访问的是其他页面，直接放行
         await store.dispatch('user/getUserInfo')
         next()
      }
   } else {
      if(whitelist.includes(to.path)) {
         next()
      } else {
         next('/login')
      }
   }
   NProgress.done()
})
// 路由后置守卫
router.afterEach((to, from, next) => {
   NProgress.done()
})



// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })


