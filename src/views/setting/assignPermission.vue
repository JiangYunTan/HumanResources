<template>
  <div>
    <!-- 权限点数据展示 -->
    <el-tree 
    ref="tree"
    :data="permissionList" 
    :props="{ label: 'name' }" 
    node-key="id"
    show-checkbox
    default-expand-all
    check-strictly/>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTree } from '@/utils/index'
import { getRoleId, assignPerm } from '@/api/setting'
export default {
  name: 'AssignPermission',
  props: {
    roleId: {
      type: [Number, String],
      required: true,
    }
  },
  data() {
    return {
       permissionList: []
    }
  },
  created() {
    // 调用获取权限列表的方法
    this.getPermissionList()
    // 调用获取某一角色的权限
    this.getRoles()
  },
  methods: {
     // 获取权限列表
    async getPermissionList() {
      const res = await getPermissionList()
      if (!res.success) return this.$message.error(res.message)
      this.permissionList = tranListToTree(res.data, '0')
    },

    // 取消按钮
    cancelButton() {
      this.$emit('close')
    },

    // 设置权限按钮
   async setRolesBtn() {
   // console.log(1);
   // 获取选中项的 ID
   const permIds = this.$refs.tree.getCheckedKeys()
   const data = {
      id:this.roleId, 
      permIds:permIds
   }
   console.log(data);
   // 调用 API，给角色设置权限
   const res = await assignPerm(data).catch(err => err)
   console.log(res);
   // if (!res.success) return this.$message.error(res.message)
   // this.$message.success(res.message)

   // 关闭弹框
   this.$emit('close')
   // 重新获取权限列表
   this.getPermissionList()
   },
    // 获取当前角色的 ID
   async getRoles() {
      // console.log(this.roleId);
      const res = await getRoleId(this.roleId.id)
      if (!res.success) return this.$message.error(res.message)
      this.$refs.tree.setCheckedKeys(res.data.permIds)
   }
  },
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
