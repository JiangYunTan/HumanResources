<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- 上传组件 -->
        <upload-excel :on-success="handleSuccess" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { formatExcelDate } from '@/utils'
// 导入 API 模块
import { importEmployee } from '@/api/employees'

export default {
  name: 'Salarys',
  methods: {
    // 将 Excel 具体的内容解析成后端需要使用的数据格式
    transExcel(results) {
      // 先定义一份需要枚举的数据，实现中文和英文的对应的关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }

      return results.map(item => {
        // 声明一个变量，这个变量的 key 是英文的
        const obj = {}

        // 将每一项中文的 key 组成一个数组
        // ['入职时间', '姓名', '工号'....]
        const contentKeys = Object.keys(item)

        contentKeys.forEach(key => {
          // 利用枚举的数据，取到中文 key 对应的 英文
          const transKey = userRelations[key]

          if (transKey === 'timeOfEntry' || transKey === 'correctionTime') {
            // 将时间转换成标准的时间戳
            obj[transKey] = new Date(formatExcelDate(item[key]))
          } else {
            // 例如：var item = {姓名: '亚瑟'}
            // item[key] = item['姓名'] = '亚瑟'
            // obj['username'] = item['姓名']
            obj[transKey] = item[key]
          }
        })

        return obj
      })
    },

    async handleSuccess({ header, results }) {
      const data = this.transExcel(results)
      // 调用 API
      const res = await importEmployee(data)
      // 返回到上一页
      this.$router.back()
      // 给用户成功的提示
      this.$message.success(res.message)
    }
  }
}
</script>

<style lang="scss" scoped></style>