/* Layout */
import Layout from '@/layout'

export default { 
   path:'/permission',
   component:Layout,
   children:[
     {
       path:"",
       name: 'permission',
       component: () => import('@/views/permission'),
       // 源信息 自拟定路由属性
       meta:{ title:'权限管理', icon:'lock'}
     }
    ]
}