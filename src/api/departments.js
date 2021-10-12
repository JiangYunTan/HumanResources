import request from '@/utils/request'

/**
 * @description: 获取组织架构
 * @returns 
 */
export function getDepartments() {
   return request({
      url: '/company/department'
   })
}
/**
 * @description: 获取负责人列表
 * @returns 
 */

export function getEmployeeSimple() {
   return request({
     url: '/sys/user/simple'
   })
 }
/**
 * @description: 添加子组件
 * @param {*} data 
 * @returns 
 */

 export function addDepartments(data) {
   return request({
     url: '/company/department',
     method: 'post',
     data
   })
 }
/**
 * @description: 获取部门详情
 * @param {*} id 
 * @returns 
 */

 export function getDepartDetail(id) {
   return request({
     url: `/company/department/${id}`
   })
 }
 /**
  * @description: 更新部门数据
  * @param {*} data:form表单数据 但是要有id值
  * @return {*}
  */
export function updateDepartments(data) {
   return request({
     url: `/company/department/${data.id}`,
     method: 'put',
     data
   })
 }
 /**
 * @description: 删除部门
 * @param {*} id 当前点击的操作按钮 所在的项的id
 * @return {*}
 */
export function delDepartment(id) {
   return request({
     url: `/company/department/${id}`,
     method: 'delete'
   })
 }