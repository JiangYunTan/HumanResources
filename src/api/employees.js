import request from '@/utils/request'

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function getEmployeeList(params) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params
  })
}
/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
 export function delEmployee(id) {
   return request({
     method: 'delete',
     url: `/sys/user/${id}`
   })
 }
 /**
 * @description: 添加员工
 * @param {*} data
 * @return {*}
 */
export function addEmployee(data) {
   return request({
     method: 'post',
     url: '/sys/user',
     data
   })
 }