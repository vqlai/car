<style scoped lang="less">
  @import "./state.less";
</style>

<template>
	<section class="state">
		<el-row type="flex" class="top-btns">
      <el-col :span="4" :offset="10">
        <el-input v-model="searchText" placeholder="请输入搜索内容"></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </el-col>
    </el-row>
    <ul>
      <li><span>电瓶电压：</span><el-input v-model="input" placeholder="电瓶电压" readonly></el-input></li>
      <li><span>发动机转速：</span><el-input v-model="input" placeholder="发动机转速" readonly></el-input></li>
      <li><span>水温：</span><el-input v-model="input" placeholder="水温" readonly></el-input></li>
    </ul>
	</section>
</template>

<script>
export default {
  name: 'state',
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

