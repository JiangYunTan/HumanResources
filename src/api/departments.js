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