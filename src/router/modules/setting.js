/* Layout */
import Layout from '@/layout'

export default { 
   path:'/setting',
   component:Layout,
   children:[
     {
       path:"",
       name: 'setting',
       component: () => import('@/views/setting'),
       // 源信息 自拟定路由属性
       meta:{ title:'公司设置', icon:'settings'}
     }
    ]
}