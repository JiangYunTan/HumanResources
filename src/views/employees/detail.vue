<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置" >
             <LoginSetting></LoginSetting>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
             <UserInfo></UserInfo>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
             <JobInfo></JobInfo>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入子组件
import JobInfo from './components/job-info'
import LoginSetting from './components/login-setting'
import UserInfo from './components/user-info'

export default {
  name: 'EmployeesDetail',
  // 挂载子组件
  components: {
    JobInfo,
    LoginSetting,
    UserInfo
  }
}
</script>

<style lang="scss" scoped>
</style>
