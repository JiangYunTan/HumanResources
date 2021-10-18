<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <UploadImg  ref="imageUrl"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>

        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import EmployeeEnum from '@/constant/employees'
import { saveUserDetailById } from '@/api/employees'

export default {
  data() {
    return {
      userId: this.$route.query.id,
      EmployeeEnum, // 员工枚举数据
      userInfo: {}
    }
  },
  created() {
    // 调用获取用户信息的 API
    this.loadUserInfoById()
  },
  methods: {
    async loadUserInfoById() {
      const res = await getUserDetailById(this.userId).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
      // 将接口返回的图片赋值给图片组件
      this.$refs.imageUrl.imageUrl = res.data.staffPhoto
    },

    // 保存用户信息的更改
    async saveUser() {
       // 获取到子组件中的图片地址
       const newimageUrl = this.$refs.imageUrl.imageUrl
       this.userInfo.staffPhoto = newimageUrl
       const res = await saveUserDetailById(this.userInfo)
       if (!res.success) return this.$message.error(res.message)
       this.loadUserInfoById()
       this.$message.success(res.message)
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>