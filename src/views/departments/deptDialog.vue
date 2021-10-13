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
       // 校验部门编码是否重复
      const validCode = (rule, value, callback) => {
         let existCodeList = this.originList.map(item => item.code)

         // 如果是编辑状态，则将需要编辑的这一项排除在外
         if (this.isEdit) {
            
            // 使用 filter 方法筛选出 id 不一致的那一项，这时候只剩余 15 项
            // 将筛选出来 15 项中的 code 取出来形成一个新的数组
            existCodeList = this.originList.filter(item => item.id !== this.parentId).map(item => item.code)
         }

         existCodeList.includes(value) ? callback(new Error('编码' + value + '已经存在')) : callback()
      }
      // 同级部门禁止出现重复部门
      const validName = (rule, value, callback) => {
         // 查找同级的分类
         let existNameList = this.originList.filter(item => item.pid === this.parentId).map(item => item.name)
         // 3. 编辑时的校验
         if (this.isEdit) {
            // 3.1 【先找到自身对应的对象】
            // 找到父级的 id，因为父级的 id 和 子级的 pid 一致
            // 所以只要使用 find 判断每一项 id 和 传入的 id 是否一致，就可以获取到当前编辑这一项的对象
            const dept = this.originList.find(item => item.id === this.parentId)

            // 3.2 【获取父级的 id】，因为父级的 id 和 子级的 pid 一致，直接 【对象.pid】 就能够获取到父级的 id
            const pid = dept.pid

            // 3.3 既然已经有了父级 id，只需获取兄弟节点：从 originList 中筛选出和 父级 id 一致的 pid
            // 先使用 filter 筛选出兄弟节点，同时将自己排除
            // 在使用 map 方法将兄弟节点的 name 组装成一个数组
            existNameList = this.originList.filter(item => item.pid === pid && item.id !== this.parentId).map(item => item.name)
         }
         // 判断最新输入的部门名称是否存在
         existNameList.includes(value) ? callback(new Error('名字' + value + '已经被占用了')) : callback()
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
               { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger:'blur'},
               { validator: validName, trigger: 'blur' }
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