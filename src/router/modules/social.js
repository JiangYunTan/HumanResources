/* Layout */
import Layout from '@/layout'

export default { 
   path:'/social',
   component:Layout,
   children:[
     {
       path:"",
       name: 'social',
       component: () => import('@/views/social'),
       // 源信息 自拟定路由属性
       meta:{ title:'社保', icon:'table'}
     }
    ]
}