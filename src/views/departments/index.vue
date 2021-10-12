<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="组织架构" name="first" class="tab-pane">
            <!-- 使用 Layout 布局绘制头部区域 -->
            <el-row type="flex" justify="space-between" align="middle" class="department-header">
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">小柒AI科技研发股份有限公司</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <el-col>负责人</el-col>
                  <el-col>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="good()">添加子部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- 使用树形控件完成显示 -->
            <!-- 主体区域绘制 -->
            <el-tree class="departments-tree" :data="treeData" :props="defaultProps" :default-expand-all="true">
              <template slot-scope="{ data }">
                <el-row type="flex" justify="space-between" style="height: 50px; width: 100%;" align="middle">
                <el-col :span="20">
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <el-row type="flex" justify="end">
                    <el-col>{{ data.manager }}</el-col>
                    <el-col>
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addDept(data.id)">添加子部门</el-dropdown-item>
                          <el-dropdown-item @click.native="editDept(data.id)">编辑部门</el-dropdown-item>
                          <el-dropdown-item v-if="data && !data.children" @click.native="delDept(data.id)">删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
        <!-- 添加或编辑弹框 -->
        <el-dialog 
          :visible.sync="showDialog" 
          width="50%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :title="isEdit ? '编辑子部门' : '添加子部门'">
            <!-- 添加子组件弹层 -->
            <deptDialog v-if="showDialog" :parent-id="parentId" @update-depart="updateDepart" :is-edit="isEdit"  @close="closeDialog" :origin-list="originList"/>
        </el-dialog>
      </el-card>
      <!-- Terr树形结构 -->
      <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
    </div>
  </div>
</template>

<script>
import { getDepartments, delDepartment } from '@/api/departments'
// 引入子组件
import deptDialog from './deptDialog.vue'
export default {
  name: 'Departments',
  components: {
    deptDialog
  },
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
       // 树形控件数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false, // 控制添加或编辑弹框展示
      parentId:'',
      isEdit: false, // 用来显示编辑页面的
    }
  },
  methods: {
    good() {
      // console.log(1);
      this.parentId = ''
      this.showDialog = true
      // isEdit 为 false，说明是添加
      this.isEdit = false
      // this.$refs.goods.hSubmit()
    },
    // 隐藏弹框
    updateDepart() {
      // 关闭弹层
      this.showDialog = false
      // 重新获取数据
      this.getDepartments()
    },
    handleNodeClick() {
      console.log(666);
    },
    // 把数据渲染成 树结构 filter方法
    // arrToTree(list) {
    //   const treeData = []
    //   list.forEach(item => {
    //     if(!item.pid) {
    //       treeData.push(item)
    //     }
    //     const children = list.filter(data => data.pid === item.id)
    //     if(!children.length) return
    //     item.children = children
    //   })
    //   // console.log(treeData);
    //   return treeData
    // }, 
    // 递归方式渲染成树形结构
    arrToTree(list, rootValue) {
      const treeData = [] 
      list.forEach(item => {
        if(item.pid === rootValue) {
          // treeData.push(item)
          const children = this.arrToTree(list, item.id)
          // console.log(children);
          if(children.length) {
            item.children = children
          }
          treeData.push(item)
        }
      })
      // console.log(treeData);
      return treeData
    },
    // 获取组织架构
    async getDepartments() {
      const res = await getDepartments()
      // console.log(res.data.depts);
      // this.treeData = res.data.depts
        // 格式化需要传递给子组件的数据
      this.originList = res.data.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          pid: item.pid,
          name: item.name
        }
      ))
      this.treeData = this.arrToTree(res.data.depts, '')
          // console.log(this.treeData);
    },
    // 添加子部门
    addDept(id) {
      // console.log(id)
      this.parentId = id
      this.showDialog = true
      // isEdit 为 false，说明是添加
      this.isEdit = false
    },
    // 编辑部门
    editDept(id) {
      this.parentId = id
      this.showDialog = true
      // isEdit 为 true，说明是编辑
      this.isEdit = true
    },
    // 删除部门
    async delDept(id) {
       // 显示删除确认消息对话框
      const delRes = await this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果返回的结果是 cancel 说明用户取消了删除
      if (delRes === 'cancel') return this.$message('您取消了删除')
      const res = await delDepartment(id)
      // this.$message.success(res.message)
      if (!res.success) return this.$message.error(res.message)
      // 删除成功需要给用户进行提示
      this.$message.success(res.message)
      // 删除后需要重新获取当前页面数据
      this.getDepartments()
    },
     // 隐藏新增、编辑弹框
    closeDialog() {
      this.showDialog = false
    }
  },
  created() {
    this.getDepartments()
  }
}
</script>

<style lang="scss" scoped>
.departments-tree {
  margin: 12px 0px;
}
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
