/* Layout */
import Layout from '@/layout'

export default { 
   path:'/employees',
   component:Layout,
   children:[
     {
       path:"",
       name: 'Employees',
       component: () => import('@/views/employees'),
       // 源信息 自拟定路由属性
       meta:{ title:'员工管理', icon:'people'}
     }
    ]
}