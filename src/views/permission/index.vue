<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </div>

        <el-table border :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
              <el-button type="text" @click="editPerHander(row.id)">编辑</el-button>
              <el-button type="text" @click="delPerHander(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
    </div>
    <!-- 弹窗 -->
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="isEdit ? '编辑权限点' : '新增权限点'" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="addPermissionSubmit">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, getPermissionDetail, updatePermission, delPermission } from '@/api/permission'
import { tranListToTree } from '@/utils/index'

export default {
  
  data() {
    // 校验权限名称：同级不能出现同名的 权限名称
    const validName = (rule, value, callback) => {
      // 添加时的校验： 名字不能取兄弟节点的名字
      // 所以：需要将同级别的节点的对象取出，组成一个新的数组
      let existNameList = this.originList.filter(item => item.pid === this.formData.pid)
      if (this.isEdit) {
        // 编辑时的校验： 名字不能取兄弟（排除自己）的名字
        // 找兄弟，排除自己
        existNameList = this.originList.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id)
      }
      existNameList.map(item => item.name).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }

    // 校验权限标识：项目中的 权限标识 是唯一的
    const validCode = (rule, value, callback) => {
      // 添加时的校验：code不能重复
      let existCodeList = this.originList
      if (this.isEdit) {
        // 编辑时的校验: code能取自己
        existCodeList = this.originList.filter(item => item.id !== this.formData.id)
      }
      existCodeList.map(it => it.code).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }
    return {
      permissionList: [], // 权限管理列表数据
      showDialog: false, // 是否显示弹层
      originList: [], // 在做校验时需要用到的数据
      isEdit: false, //判定编辑显示按钮
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          {validator:validName,trigger: 'blur'}
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          {validator:validCode,trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    // 调用获取权限管理列表的数据
    this.getPermissionList()
  },
  methods: {
    // 获取权限管理列表的数据
    async getPermissionList() {
      const res = await getPermissionList().catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.originList = res.data.map(({ id, pid, name, code }) => ({ id, pid, name: name.trim(), code }))
      // this.permissionList = res.data
      // 一级元素的 id 为 0
     this.permissionList = tranListToTree(res.data, '0')
    },
    // 关闭弹框
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
      // 关闭弹框时，让 isEdit 还原
      this.isEdit = false
    },
    // 添加权限
    addPermission(type, id) {
      // 控制弹框展示
      this.showDialog = true

      // 记录当前添加的关键信息
      this.formData.type = type
      this.formData.pid = id
    },
    // 添加权限
    async addPermissionSubmit() {
      // 验证用户是否输入了必填项
      this.$refs.perForm.validate(async valid => {
         if (valid) {
            this.isEdit ? this.editPermission() : this.addPerHandler()
          }
      })
    },
    // 编辑权限
    async editPerHander(id) {
      // 设置是否是编辑
      this.isEdit = true
      // 获取当前编辑这项 ID
      const res = await getPermissionDetail(id).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      // 数据回显
      this.formData = res.data
      // 显示编辑弹框
      this.showDialog = true
    },
    // 编辑权限
    async editPermission() {
      // 调用接口，传入参数，发起请求
      const res = await updatePermission(this.formData).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      // 重新获取页面数据
      this.getPermissionList()
      this.$message.success(res.message)
      this.showDialog = false
    },

    async addPerHandler() {
      // 调用接口，传入参数，发起请求
      const res = await addPermission(this.formData).catch(err => err)
      if (!res.success) return this.$message.error(res.message)

      // 重新获取页面数据
      this.getPermissionList()
      this.$message.success(res.message)
      this.showDialog = false
    },

    // 删除权限
    async delPerHander(id) {
      // 确认消息
      const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmRes === 'cancel') return this.$message.info('您取消了删除')

      // 调用接口，并传入 ID
      const res = await delPermission(id)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getPermissionList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
