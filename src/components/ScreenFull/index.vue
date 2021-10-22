<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" class="fullscreen" @click="toggleScreen" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
   return {
      isFullscreen: false // 全屏
   }
  },
  methods: {
    // 点击全屏
    toggleScreen() {
      screenfull.toggle()
      // 切换全屏与否状态
      this.isFullscreen = !this.isFullscreen
      // 监听全屏的状态是否切换
      screenfull.on('change', () => {
        this.isFullscreen = screenfull.isFullscreen
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
