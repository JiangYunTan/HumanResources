/* Layout */
import Layout from '@/layout'

export default { 
   path:'/attendances',
   component:Layout,
   children:[
     {
       path:"",
       name: 'attendances',
       component: () => import('@/views/attendances'),
       // 源信息 自拟定路由属性
       meta:{ title:'考勤', icon:'skill'}
     }
    ]
}