/* Layout */
import Layout from '@/layout'

export default { 
   path:'/approvals',
   component:Layout,
   children:[
     {
       path:"",
       name:'approvals',
       component: () => import('@/views/approvals'),
       // 源信息 自拟定路由属性
       meta:{ title:'审批', icon:'tree-table'}
     }
    ]
}