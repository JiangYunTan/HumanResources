<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="password">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateUser">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入头像
import { getUserDetailById, saveUserDetailById } from '@/api/user'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  methods: {
    // 获取用户详情
    async loadUserDetailById() {
      const res = await getUserDetailById(this.$route.query.id).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
    },
    // 更新用户信息模块
    updateUser() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return this.$message.error('检查用户名和密码')
        const res = await saveUserDetailById(this.userInfo)
        this.loadUserDetailById()
        this.$message.success(res.message)
      })
    },
  },
  created() {
     this.loadUserDetailById()
  }
}
</script>

<style lang="scss" scoped></style>
