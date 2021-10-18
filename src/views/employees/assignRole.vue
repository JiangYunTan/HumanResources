<template>
  <div>
    <!-- 渲染角色列表 -->
    <!-- 666 -->
   <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
         {{ item.name }}
      </el-checkbox>
   </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="addRole">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoles } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
        roleIds: [], // 保存当前选中的权限列表
        roleList: [] // 角色列表数据
    }
  },
    created() {
     // 调用获取角色列表数据的方法
      this.getRoles()
      // 调用员工详情数据的方法
      this.getUserRoles()
  },
  methods: {
    // 取消弹框
    cancleDialog() {
      this.$emit('close')
    },

    // 获取角色列表数据
    async getRoles() {
      const res = await getRoles()
      // if (!res.success) return this.$message.error(res.message)
      this.roleList = res.data.rows
    },

    // 调用员工详情数据
    async getUserRoles() {
       const infoRes = await getUserDetailById(this.userId)
      //  if (!infoRes.success) return this.$message.error(infoRes.message)
       this.roleIds = infoRes.data.roleIds === null ? [] : infoRes.data.roleIds
      //  console.log(infoRes);
    },

    // 员工角色分配
   async addRole() {
      // 调用 API，传入参数
      const res = await assignRoles({ id: this.userId, roleIds: this.roleIds })
      if (!res.success) return this.$message.error(res.message)
      
      // 员工分配成功，给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.$emit('close')
      // 重新获取当前当前列表数据
      this.getRoles()
   }
  }

}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
