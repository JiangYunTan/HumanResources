<template>
  <!-- 表单 -->
  <el-form label-width="120px" ref="addForm" :model="formData" :rules="rules" >
    <el-form-item label="姓名" prop="username">
      <el-input style="width:50%" placeholder="请输入姓名" v-model="formData.username"/>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input style="width:50%" placeholder="请输入手机号" v-model="formData.mobile"/>
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker style="width:50%" placeholder="请选择入职时间" v-model="formData.timeOfEntry"/>
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select style="width:50%" placeholder="请选择" v-model="formData.formOfEmployment">
        <el-option
          v-for="item in hireType"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input style="width:50%" placeholder="请输入工号" v-model="formData.workNumber"/>
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input @focus="departmentNameFocus" style="width:50%" placeholder="请选择部门" v-model="formData.departmentName"/>
      <div class="tree-box" v-if="showTree">
        <el-tree 
        :data="treeData" 
        default-expand-all 
        :props="{ label: 'name' }" 
        @node-click="treeClick"/>
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker style="width:50%" placeholder="请选择转正时间" v-model="formData.correctionTime"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// 导入需要枚举的数据
import EmployeeEnum from '@/constant/employees'
// 引入api方法
import { getDepartments } from '@/api/departments'
// 树形结构的转换方法
import { tranListToTree } from '@/utils'
// 导入新增方法
import { addEmployee } from '@/api/employees'
export default {
  name: 'EmpDialog',
  data() {
      return {
         // 添加表单字段
         // 字段和后端接口要求的字段要一致
         formData: {
            username: '', // 用户名
            mobile: '', // 手机号
            formOfEmployment: '', // 聘用形式
            workNumber: '', // 工号
            departmentName: '', // 部门
            timeOfEntry: '', // 入职时间
            correctionTime: '' // 转正时间
         },
         // 表单校验
         rules: {
          username: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' },
            { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
          ],
          formOfEmployment: [
            { required: true, message: '聘用形式不能为空', trigger: 'blur' }
          ],
          workNumber: [
            { required: true, message: '工号不能为空', trigger: 'blur' }
          ],
          departmentName: [
            { required: true, message: '部门不能为空', trigger: 'change' }
          ],
          timeOfEntry: [
            { required: true, message: '请选择入职时间', trigger: 'blur' }
          ]
        },
        hireType: EmployeeEnum.hireType, // 聘用形式数据绑定
        treeData: [], // 树形结构数据
        showTree: false, // 控制树形结构的显示状态
      }
  },
  methods: {
    // 点击取消按钮
    addCancel() {
      this.$emit('close')
    },

    // 点击确定按钮
    addSubmit() {
      this.$refs.addForm.validate(async valid => {
        // console.log(valid)
        if(!valid) return
        const res = await addEmployee(this.formData)
        this.$message.success(res.message)
        this.$emit('update-depart')
      })
      // this.$emit('close')
    },

    // 获取组织架构
    async getDepartments() {
        const res = await getDepartments()
        // console.log(res);
        if (!res.success) return this.$message.error(res.message)
        this.treeData = tranListToTree(res.data.depts, '')
        this.showTree = true
    },
    // 点击部门输入框的时候执行 获取组织架构
    departmentNameFocus() {
      this.getDepartments()
    },
    // 点击树组件中的数据
    treeClick(data, node) {
      // 如果当前部门还有子部门，则不能被选中
      if (data && data.children) return
      // 把当前选中的节点显示在 input 框中
      this.formData.departmentName = data.name
      // 隐藏 tree
      this.showTree = false
    },
    // 清空表单
    resetForm() {
      // 1. 把表单的数据项清空
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      // 2.重置表单
      this.$refs.addForm.resetFields()
    }
  },
  created() {
    
  }
}
</script>

<style lang="scss" scoped></style>
