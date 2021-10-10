/* Layout */
import Layout from '@/layout'

export default { 
   path:'/salarys',
   component:Layout,
   children:[
     {
       path:"",
       name: 'salarys',
       component: () => import('@/views/salarys'),
       // 源信息 自拟定路由属性
       meta:{ title:'工资', icon:'money'}
     }
    ]
}