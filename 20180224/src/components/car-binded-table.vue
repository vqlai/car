<template>
	<el-table
	  :data="tableData"
	  border
	  highlight-current-row
	  style="width: 100%">
	  <el-table-column
	    prop="index"
	    width="160"
	    label="索引">
	  </el-table-column>
	  <el-table-column
	    prop="carNumber"
	    label="车牌号">
	  </el-table-column>
	</el-table>
</template>
<script>
	import {getCarNumberByFence} from '@/api/operation'
	export default {
	  name: 'fence-table',
	  props: {
	  	fenceId: Number
	  },
	  data () {
	    return {
	    	tableData:[],
	    	currentPage: 1, // 当前页索引
	    	pageSize: 15, // 每页大小 固定
	    	total: 0, // 总数
	    }
	  },
	  mounted() {
	    this.$nextTick(()=>{
	      this._getCarNumberByFence({fence_id:this.fenceId,page:this.currentPage,page_size:this.pageSize})
	    })
	  },
	  methods:{
	  	_getCarNumberByFence(params){
	  		getCarNumberByFence(params).then((res)=>{
	  			console.log(res)
	  			if(res.data.ret == 0){
	  				this.tableData = []
	  				let cacheData = res.data.datas.monitored_person
	  				if(!cacheData.length){
	  					for(let [index,item] of cacheData.entries()){
	  						let obj = {}
	  						obj.index = index
	  						obj.carNumber = item
	  						this.tableData.push(obj)
	  					}
	  				}
	  			}
	  		})
	  	}
	  }
	}
</script>

<style scoped lang="less">
</style>