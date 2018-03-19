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
		  <el-table-column
		    prop="opt"
		    label="操作"
		    width="80"
		    align="center"
		    header-align="center">
		    <template slot-scope="scope">
		      <el-button type="text" size="small" @click="unBindClick(scope.row)">解绑</el-button>
		    </template>
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
	import {getCarNumberByFence,unBindCar} from '@/api/operation'
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
	  			fence_id: this.fenceId,
	  			page: this.currentPage,
	  			page_size: this.pageSize
	  		}
	  		getCarNumberByFence(params).then((res)=>{
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
	  					// this.currentPage = parseInt(this.total/this.pageSize)
	  				}else{
	  					this.emptyText = '暂无数据'
	  				}
	  			}
	  		})
	  	},
	  	onCurrentChange(page){
	  		this.currentPage = page
      	this._getCarNumberByFence()
	  	},
	  	unBindClick(row){
	  		unBindCar({vehicle_number: row.carNumber,fence_id: this.fenceId}).then(res=>{
	  			if(res.data.ret == 0){
	  				this.$message({
	  				  message: '解绑成功!',
	  				  type: 'success'
	  				})
	  				this._getCarNumberByFence()
	  			}else{
	  				this.$message({
	  				  message: '解绑失败，请重新解绑!',
	  				  type: 'error'
	  				})
	  			}
	  		})
	  	}
	  }
	}
</script>

<style scoped lang="less">
.el-pagination{
  text-align: right;
}
</style>