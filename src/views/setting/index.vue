<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <!-- 角色管理区域 -->
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
           <el-row style="height:60px">
             <el-button
               icon="el-icon-plus"
               size="small"
               type="primary"
               @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            
            <!-- 新增弹框 -->
            <el-dialog
              title="新增角色"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :visible.sync="showDialog"
            >
              <!-- @close="cancleAddRoles" -->
              <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="roleForm.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="roleForm.description" />
                </el-form-item>
              </el-form>

              <!-- 底部 -->
              <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small" @click="cancleRoles">取消</el-button>
                  <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
                </el-col>
              </el-row>
            </el-dialog>

            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table border style="width: 100%" :data="rolesList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column label="角色名" width="240" prop="name"/>
              <el-table-column label="描述" prop="description"/>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分配权限弹窗 -->
            <!-- 分配权限弹框 -->
            <el-dialog
              title="分配权限"
              :visible.sync="dialogVisible"
              width="50%"
              @close="setVisible"
            >
              <assign-permission v-if="dialogVisible" :role-id="roleId" @close="setVisible"/>
            </el-dialog>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>

          <!-- 公司信息区域 -->
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input disabled style="width:400px"  v-model="formData.name" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width:400px" v-model="formData.companyAddress"/>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width:400px" v-model="formData.mailbox"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :rows="3" disabled style="width:400px"  v-model="formData.remarks"/>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoles, getCompanyInfo, addRole, getRoleId, updateRole, deleteRole } from '@/api/setting'
import { mapGetters  } from 'vuex'
import AssignPermission from './assignPermission.vue'
export default {
  components: {
    AssignPermission
  },
  data() {
    return {
      activeName: 'first',
      dialogVisible:false, // 分配权限弹窗显示
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      formData:{}, // 公司信息
      showDialog: false, // 控制弹框的隐藏和展示
      isEdit: false, // 判断是否由编辑打开
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      roleId:{
        name:'1',
        id:'1',
        description:'1'
      },
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  methods: {
    //新增
    addRoles() {
      this.$refs.roleForm.b   (async valid => {
        if (valid) {

          if(this.isEdit) {
            // 调用新增角色的 API
            const res = await updateRole(this.roleForm)
            // 根据状态码判断请求成功与否
            if (!res.success) return this.$message.error(res.message)
            // 添加成功，给用户进行提示
            this.$message.success(res.message)
            // 重新获取权限列表数据
            this.getRoles()
            // 隐藏弹框
            this.showDialog = false
            return
          }
          // 调用新增角色的 API
          const res = await addRole(this.roleForm)
          // 根据状态码判断请求成功与否
          if (!res.success) return this.$message.error(res.message)
          // 添加成功，给用户进行提示
          this.$message.success(res.message)
          // 重新获取权限列表数据
          this.getRoles()
          // 隐藏弹框
          this.showDialog = false
          this.roleForm = {}
        }
      })
    },
    // 获取角色列表
    async getRoles() {
      const res = await getRoles(this.query)
      // console.log(res);
      // 将返回的数据进行赋值
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取的公司的信息
    async getCompanyInfo(newPage) {
      const res = await getCompanyInfo(this.companyId)
      if (!res.success) return this.$message.error(res.message)
      this.formData = res.data
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange() {
      this.query.pagesize = newSize
      this.getRoles()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRoles()
    },

    // 设置角色
    setRoles(id) {
      console.log(id);
      this.roleId = id
      this.dialogVisible = true
    },
    // 分配权限弹框隐藏
    setVisible() {
      this.dialogVisible = false
    },

    // 编辑角色
    async editRoles(id) {
      this.isEdit = true
      // console.log(id);
      // 调用接口，获取需要编辑的角色数据
      const res = await getRoleId(id)
      if (!res.success) return this.$message.error(res.message)
      this.roleForm = res.data
      // 让弹框展示
      this.showDialog = true
    },

    // 删除角色
    async delRoles(id) {
      // 显示删除询问对话框
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')

      // 调用删除的 API
      const res = await deleteRole(id)
      if(this.rolesList.length === 1) {
        this.query.page--
        if(this.query.page <= 0) {
          this.query.page = 1
        }
      }
      // 根据返回的状态码进行错误提示
      if (!res.success) return this.$message.error(res.message)
      // 删除成功后的提示
      this.$message.success(res.message)
      // 重新获取数据
      this.getRoles()
    },
    // 添加权限按钮
    roleSubmit() {
      // this.roleForm = ''
      this.addRoles()
      this.showDialog = false
    },

    // 取消权限按钮
    cancleRoles() {
       this.roleForm = {
          name: '',
          description: ''
       }
       this.$refs.roleForm.resetFields()
       this.showDialog = false
    }
  },
  created() { 
    this.getRoles()
    // 调用获取公司信息的方法
    this.getCompanyInfo()
  }
} 
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
