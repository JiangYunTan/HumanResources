<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <PageTools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共{{total}}条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small" @click="$router.push('/excel')">导入excel</el-button>
          <el-button type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 新增员工组件 -->
      <el-dialog title="新增员工" :visible.sync="showDialog" @close="dialogClose">
        <EmpDialog @close="showDialog=false" @update-depart="updateEmpolyee" ref="AddEmployee"></EmpDialog>
      </el-dialog>
      <!-- 数据表格数据 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" :default-sort="{prop: 'workNumber', order: 'ascending'}">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column label="头像" width="120">
            <template slot-scope="scope">
              <ImageHolder :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" label="工号" sortable/>
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatter"/>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column label="入职时间" sortable>
            <template slot-scope="scope">
              <span>{{ scope.row.timeOfEntry | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push('/employees/detail?id=' + scope.row.id)">查看</el-button>
              <el-button type="text" size="small" @click="setEmp(scope.row.id)">分配角色</el-button>             
              <el-button type="text" size="small" @click="delEmployee(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>

      <!-- 设置角色组件弹框 -->
        <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancleDialog">
          <!-- 设置角色组件 -->
          <AssignRole ref="assignRole" v-if="showRoleDialog" :user-id="userId"  @close="showRoleDialog = false" />
        </el-dialog>
    </div>
  </div>
</template>

<script>
// 导入组件
import PageTools from '@/components/PageTools'
import AssignRole from './assignRole'
import { getEmployeeList, delEmployee } from '@/api/employees'
//导入美枚举
import EmployeeEnum from '@/constant/employees'
// 引入子组件
import EmpDialog from './empDialog'
// 导入时间格式化组件
import dayjs from 'dayjs'
export default {
  components: {
    PageTools, // 导入自定义组件
    EmpDialog, // 新增弹窗
    AssignRole, // 弹窗
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false, // 添加员工组件的展示
      showRoleDialog:false,
      userId:''
    }
  },

  methods: {
    // 获取员工列表
    async getEmployeeList() {
      // 调用获取员工列表的 API
      const res = await getEmployeeList(this.query)
      // 根据返回的状态码给用户提示
      if (!res.success) return this.$message.error(res.message)
      // 将返回的结果赋值 data 中的数据
      this.employeesList = res.data.rows
      this.total = res.data.total
    },

    //格式化
    formatter(row, column, cellValue, index) {
      // 用数组的 find 方法找到 id = 1 的元素，再取出它的 value
      const obj = EmployeeEnum.hireType.find(item => item.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },

    // 删除功能
    async delEmployee(id) {
      // 判断是不是最后一条数据
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')
      const res = await delEmployee(id)
      // console.log(res);
      this.$message.error(res.message)
      // 删除成功后的提示
      this.$message.success(res.message)
      // 重新获取数据
      this.getEmployeeList()
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    },

    // 点击确定后调用的方法
    updateEmpolyee() {
      this.getEmployeeList()
      this.showDialog = false
    },

    // 清空表单调用
    dialogClose() {
      this.$refs.AddEmployee.resetForm()
    },

    // 导出excel
    async downloadExcel() {
      const res = await getEmployeeList()
      const excelObj = this.transData(res.data.rows)
      import('@/vendor/Export2Excel').then(excel => {
        // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: excelObj.header, // 表头 必填
          data: excelObj.data, // 具体数据 必填
          filename: '员工列表', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },

    transData(rows) {
      // 写代码
      const map = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }

      const headerKeys = Object.keys(rows[0])
      const header = headerKeys.map(item => {
        return map[item]
      })

      const data = rows.map(obj => {
        return Object.values(obj)
      })

      return { header, data }
    },

    // 关闭分配角色弹框
    cancleDialog() {
      this.showRoleDialog = false
    },

    // 分配角色
    setEmp(id) {
      this.userId = id
      this.showRoleDialog = true
      // console.log(this.userId);
      // 在父组件中点击分配角色时，直接调用子组件中方法重新获取当前用户的数据
      // this.$nextTick(() => {
        // this.$refs.assignRole.getUserRoles()
      // })
    }
  },
  created() {
    this.getEmployeeList()
  },
  filters: {
    // 格式化入职日期的方法
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
