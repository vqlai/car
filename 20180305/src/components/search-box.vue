<template>
	<div class="search-box">
		<el-row type="flex" :gutter="20">
	    <el-col :sm="5" :xl="4">
	      <el-input v-model="queryText" :placeholder="queryTip"></el-input>
	    </el-col>
	    <el-col :sm="5" :xl="4" v-if="queryTwo">
	      <el-input v-model="queryTextTwo" :placeholder="queryTipTwo"></el-input>
	    </el-col>
	    <el-col :sm="10" :xl="7" v-if="queryDate">
	      <el-date-picker
          v-model="pickerValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          align="center">
        </el-date-picker>
	    </el-col>
	    <el-col :sm="5" :xl="5">
	      <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
	      <el-button type="primary" icon="el-icon-plus" @click="onAdd" v-if="addBtn">新增</el-button>
	      <el-button type="primary" icon="el-icon-download" @click="onExport" v-if="exportBtn">导出</el-button>
	    </el-col>
	  </el-row>
	</div>
</template>

<script>
export default {
  name: 'search-box',
  props: {
    queryTip: { 
      type: String,
      default: '请输入车牌号'
    },
    queryTipTwo: {
    	type: String,
      default: '请输入手机号'
    },
    addBtn: {
    	type: Boolean,
    	default: false
    },
    exportBtn: {
    	type: Boolean,
    	default: false
    },
    queryTwo: {
    	type: Boolean,
    	default: false
    },
    queryDate:{
    	type: Boolean,
    	default: false
    }
  },
  data(){
  	return {
  		queryText: '',
  		queryTextTwo: '',
  		pickerValue: '',
  		pickerOptions:{
  			shortcuts: [{
	        text: '最近一周',
	        onClick(picker) {
	          const end = new Date();
	          const start = new Date();
	          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	          picker.$emit('pick', [start, end]);
	        }
	      }, {
	        text: '最近一个月',
	        onClick(picker) {
	          const end = new Date();
	          const start = new Date();
	          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	          picker.$emit('pick', [start, end]);
	        }
	      }, {
	        text: '最近三个月',
	        onClick(picker) {
	          const end = new Date();
	          const start = new Date();
	          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
	          picker.$emit('pick', [start, end]);
	        }
	      }]
  		}
  	}
  },
  computed: {
  },
  methods:{
  	onSearch(){
  		let params = [this.queryText]
  		if(this.queryTwo){
  			params.push(this.queryTextTwo)
  		}
  		if(this.queryDate){
  			params.push(this.pickerValue)
  		}
  		this.$emit('onSearch', ...params)
  	},
  	onAdd(){
  		this.$emit('onAdd')
  	},
  	onExport(){
  		this.$emit('onExport')
  	}
  }
}
</script>

<style scoped lang="less">
	.search-box{
		.el-row{
			padding: 30px 0;
		}
	}
</style>