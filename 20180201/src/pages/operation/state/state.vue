<style scoped lang="less">
  @import "./state.less";
</style>

<template>
	<section class="state">
		<el-row type="flex" class="top-btns">
      <el-col :span="4" :offset="10">
        <el-input placeholder="请输入车牌号" v-model="searchText" class="input-with-select">
          <el-button slot="append" type="primary" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <ul>
      <li><span>电瓶电压：</span><el-input v-model="voltage" placeholder="电瓶电压" readonly></el-input></li>
      <li><span>发动机转速：</span><el-input v-model="speed" placeholder="发动机转速" readonly></el-input></li>
      <li><span>水温：</span><el-input v-model="temp" placeholder="水温" readonly></el-input></li>
    </ul>
	</section>
</template>

<script>
export default {
  name: 'state',
  data () {
    return {
    	searchText: '',
      voltage: '',
      speed: '',
      temp: ''
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

