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
                <span class="company">江苏传智播客教育科技股份有限公司</span>
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
                        <el-dropdown-item>添加子部门</el-dropdown-item>
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
                          <el-dropdown-item>添加子部门</el-dropdown-item>
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
      </el-card>
      <!-- Terr树形结构 -->
      <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
    </div>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
export default {
  name: 'Departments',
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
       // 树形控件数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
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
      this.treeData = this.arrToTree(res.data.depts, '')
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
