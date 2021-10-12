<template>
  <div>
     <el-form ref="deptForm" :model="deptFrom" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptFrom.name" style="width:90%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="deptFrom.code" style="width:90%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="deptFrom.manager" style="width:90%" placeholder="请选择">
          <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username"/>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="deptFrom.introduce" style="width:90%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
        <el-button size="small" @click="hCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  name: 'DeptDialog',
  data() {
     // 校验部门编码是否重复
      const validCode = (rule, value, callback) => {
         // 将给个组织架构的编码取出，组成一个新的数组
         const existCodeList = this.originList.map(item => item.code)

         if(this.isEdit) {
            existCodeList = this.originList.filter(item => item.pid === this.parentId).map(item => item.name)
         }
         // 使用 includes 判断是否能否找到对应的部门，如果找到了则返回一个布尔值
         // 如果存在该对象，则说明编码已经存在，抛出错误
         // 如果不存在该对象，不做任何处理
         existCodeList.includes(value) ? callback(new Error('编码' + value + '已经存在')) : callback()
      }
     return {
        deptFrom: {
           name:'', 
           noShowingChildrencode: '', // 部门编码
           manager: '', // 部门管理者
           introduce: '' // 部门介绍
        },
        employees: [] ,// 部门负责人列表
        rules: {
            name: [
               { required: true, message: '部门名称不能为空', trigger: 'blur'},
               { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger:'blur'}
            ],
            code: [
               { required: true, message: '部门编码不能为空', trigger: 'blur'},
               { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur'},
               { validator: validCode, trigger: 'blur' }
            ],
            manager: [
               { required: true, message: '部门负责人不能为空', trigger: 'blur'}
            ],
            introduce: [
               { required: true, message: '部门介绍不能为空', trigger:'blur'},
               { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur'}
            ]
        }
     }
  },
  props: {
      parentId: {
         type: String,
         required: true
      },
      // 判断是编辑还是新增
      isEdit: {
         type: Boolean,
         required: false
      },
      // 所有部门数据
      originList: {
         type: Array,
         required: true
      }
  },
  methods: {
      // 添加编辑确认按钮
      async hSubmit() {
         this.$refs.deptForm.validate(valid => {
            if (valid) {
               this.isEdit ? this.editDepart() : this.addDepart()
            }
         })
         //  // 组装参数
         // const params = { ...this.deptFrom, pid: this.parentId }
         // // 发起请求
         // const res = await addDepartments(params)
         // if (!res.success) return this.$message.error(res.message)
         // this.$emit('update-depart')
      },     
      // 取消编辑确认按钮
      hCancel() {
         this.$emit('close')
      },
      // 获取负责人列表
      async getEmployeeSimple() {
         const res = await getEmployeeSimple()
         this.employees = res.data
      },
      async getDepartDetail() {
         if(this.isEdit) {
            const res = await getDepartDetail(this.parentId)
            this.deptFrom = res.data
         }
      },
      // 添加子部门
      async addDepart() {
      // 组装参数
      const params = { ...this.deptFrom, pid: this.parentId }
      const res = await addDepartments(params)
      if (!res.success) return this.$message.error(res.message)
      this.$emit('update-depart')
      },

      // 编辑子部门
      async editDepart() {
      const res = await updateDepartments(this.deptFrom)
      if (!res.success) return this.$message.error(res.message)
      this.$message({ type: 'success', message: '修改成功' })
      this.$emit('update-depart')
      }
  },
  created() {
     this.getEmployeeSimple()
     this.getDepartDetail( )
  },
}
</script>

<style lang="scss" scoped>
</style>