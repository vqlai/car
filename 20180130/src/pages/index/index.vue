<style scoped lang="less">
  @import "./index.less";
</style>
<template>
  <section class="index">    
	  <el-container>
	    <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="info-box clearfix">
              <div class="info-box-icon info-box-bg1">
                <svg-icon icon-class="home"></svg-icon>
              </div>
              <div class="info-box-content">
                <p class="info-box-text">车辆总数</p>
                <p class="info-box-number">200</p>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-box clearfix">
              <div class="info-box-icon info-box-bg2">
                <svg-icon icon-class="home"></svg-icon>
              </div>
              <div class="info-box-content">
                <p class="info-box-text">运行中车辆</p>
                <p class="info-box-number">200</p>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-box clearfix">
              <div class="info-box-icon info-box-bg3">
                <svg-icon icon-class="home"></svg-icon>
              </div>
              <div class="info-box-content">
                <p class="info-box-text">停止车辆</p>
                <p class="info-box-number">200</p>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-box clearfix">
              <div class="info-box-icon info-box-bg4">
                <svg-icon icon-class="home"></svg-icon>
              </div>
              <div class="info-box-content">
                <p class="info-box-text">离线车辆</p>
                <p class="info-box-number">200</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
	    <!-- <el-aside width="300px">Aside</el-aside> -->
	  </el-container>
  </section> 
</template>

<script>
export default {
  name: 'index',
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
