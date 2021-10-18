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
 /**
 * @description: 导入excel
 * @param {*} data
 * @return {*}
 */
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 保存员工的基本信息
 * @param {*} data
 * @returns
 */
 export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}