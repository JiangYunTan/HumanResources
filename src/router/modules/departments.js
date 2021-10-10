/* Layout */
import Layout from '@/layout'

export default { 
   path:'/departments',
   component:Layout,
   children:[
     {
       path:"",
       name: 'departments',
       component: () => import('@/views/departments'),
       // 源信息 自拟定路由属性
       meta:{ title:'组织架构', icon:'tree'}
     }
    ]
}