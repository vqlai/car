<style lang="less">
  @import './404.less';
</style>

<template>
  <div class="error404">
    <div class="error">
      <div class="error-img"><img src="../../common/images/404.png" alt="404错误页面"></div>
      <p>当前访问页面不存在</p>
      <router-link to="/index" tag="a"><el-button type="primary">返回首页</el-button></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error404',
  methods: {},
  components:{}
};
</script>