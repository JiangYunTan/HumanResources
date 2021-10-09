<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- <button @click="text">测试</button> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {  getUserProfile } from '@/api/user'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // 测试请求头token
    // async text() {
    //   const res = await getUserProfile()
    //   console.log(res)
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

</style>
