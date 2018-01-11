<style scoped lang="less">
  @import "./index.less";
</style>
<template>
  <section class="index">    
    <top-header></top-header>
	  <el-container>
	    <el-main>Main
        <svg-icon icon-class="home"></svg-icon>
      </el-main>
	    <el-aside width="300px">Aside</el-aside>
	  </el-container>
	  <!-- <el-footer>bottom</el-footer> -->
  </section> 
</template>

<script>
export default {
  name: 'car-index',
  data () {
    return {
    }
  },
  mounted() {
  },
  methods:{
  },
  components:{
  }
}
</script>
