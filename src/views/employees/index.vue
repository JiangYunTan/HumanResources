<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <PageTools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small">导入excel</el-button>
          <el-button type="success" size="small">导出excel</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </PageTools>
    </div>
  </div>
</template>

<script>
// 导入组件
import PageTools from '@/components/PageTools'

export default {
  components: {
    PageTools // 导入自定义组件
  }
}
</script>

<style lang="scss" scoped></style>
