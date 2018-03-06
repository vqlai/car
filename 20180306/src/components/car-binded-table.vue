<template>
	<div class="car-binded-table">
		<el-table
		  :data="tableData"
		  border
		  :empty-text="emptyText"
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
		<el-pagination
		  :page-size="pageSize"
		  :current-page="currentPage"
		  :total="total"
		  small
		  layout="total, prev, next, jumper"
		  @current-change="onCurrentChange">
		</el-pagination>
	</div>
</template>
<script>
	import {getCarNumberByFence} from '@/api/operation'
	export default {
	  name: 'car-binded-table',
	  props: {
	  	fenceId: Number
	  },
	  data () {
	    return {
	    	tableData:[],
	    	currentPage: 1, // 当前页索引
	    	pageSize: 10, // 每页大小 固定
	    	total: 0, // 总数
	    	emptyText: ' '
	    }
	  },
	  mounted() {
	    this.$nextTick(()=>{
	      this._getCarNumberByFence()
	    })
	  },
	  methods:{
	  	_getCarNumberByFence(){
	  		let params = {
	  			fence_id:this.fenceId,
	  			page:this.currentPage,
	  			page_size:this.pageSize
	  		}
	  		getCarNumberByFence(params).then((res)=>{
	  			// console.log(res)
	  			if(res.data.ret == 0){
	  				this.tableData = []
	  				let cacheData = res.data.datas.monitored_person
	  				if(cacheData.length){
	  					for(let [index,item] of cacheData.entries()){
	  						let obj = {}
	  						obj.index = index
	  						obj.carNumber = item
	  						this.tableData.push(obj)
	  					}
	  					this.pageSize = res.data.datas.total
	  					this.total = res.data.datas.total
	  					this.currentPage = parseInt(this.total/this.pageSize)
	  				}else{
	  					this.emptyText = '暂无数据'
	  				}
	  			}
	  		})
	  	},
	  	onCurrentChange(){

	  	}
	  }
	}
</script>

<style scoped lang="less">
.el-pagination{
  text-align: right;
}
</style>