<template>
	<!-- 注意el-header/el-footer默认高度是60px而且是动态设置绑定的 -->
  <el-footer height="20px">
  <el-row type="flex" justify="center">
	    <el-col :span="12" :offset="7">@2018 <!-- 道能达 --> All rights reserved. <!-- 粤ICP备 180818号 --></el-col>
	    <el-col :span="5">客服热线：400-969-9655</el-col>
	  </el-row>
  </el-footer>
</template>

<script>
export default {
  name: 'btm-footer',
  data () {
    return {
    }
  },
  mounted() {
  },
  methods:{
  	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.el-footer{
		position: absolute;
		bottom: 0;
		left: 0;
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    line-height: 20px;
    background-color: #fff;
    color: #333;
    .el-row{
    	width: 100%;
    	height: 100%;
    	font-size: 12px;
    }
  }
</style>
