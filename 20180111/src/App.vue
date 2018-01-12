<template>
  <div id="app">
    <router-view :key="key"/>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    key() {
      // 确保路由切换时都会重新渲染触发created或者mounted钩子
      return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  overflow: hidden;
  padding-top: 60px;
  position: relative;
  box-sizing: border-box;
}
</style>
