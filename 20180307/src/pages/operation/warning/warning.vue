<style scoped lang="less">
  @import "./warning.less";
</style>

<template>
	<section class="warning">
		<searchBox @onSearch="onSearch"></searchBox>
		<div v-loading="loading" element-loading-text="数据加载中...">
	  	<el-table
		    :data="tableData"
	      :empty-text="tableEmptyText"
		    border
	      height="532"
		    style="width: 100%">
		    <el-table-column
		      prop="vehicle_name"
		      label="车牌号">
		    </el-table-column>
		    <el-table-column
		      prop="fence_name"
		      label="围栏名称">
		    </el-table-column>
		    <el-table-column
		      prop="monitored_status"
		      :formatter="formatType"
		      label="报警类型">
		    </el-table-column>
		    <el-table-column
		      prop="monitored_status"
		      label="地理坐标">
		      <template slot-scope="scope">
		        <div v-html="scope.row.latitude+','+scope.row.longitude" style="padding: 4px 0 5px;"></div>
		      </template>
		    </el-table-column>
	      <!-- <el-table-column
	        width="100"
	        label="操作">
	        <template slot-scope="scope">
	          <el-button type="text" size="small">编辑</el-button>
	          <el-button type="text" size="small">详情</el-button>
	        </template>
	      </el-table-column> -->
		  </el-table>
	  </div>
    <el-pagination
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
	</section>
</template>

<script>
import searchBox from '@/components/search-box'
import {getWarning} from '@/api/operation'
export default {
  name: 'warning',
  data () {
    return {
  		tableData: [], 
  	  currentPage: 1, // 当前页
  	  pageSize: 10, // 每页大小
  	  total: 0, // 总记录数
  	  pageFlag: false, // 防止分页快速点击bug
  	  loading: false,
  	  tableEmptyText: ' ',
  	  queryText: ''
    }
  },
  mounted() {
  	setTimeout(() => {
  	  this._getWarning()
  	},20)
  },
  methods:{
  	_getWarning(){
  		let params = {
  		  page: this.currentPage,
  		  page_size: this.pageSize,
  		  // vehicle_name: this.queryText
  		}
  		this.loading = true
  		getWarning(params).then(res=>{
  			this.pageFlag = false
  			if(res.data.ret == 0){
  				this.currentPage = res.data.datas.cur_page
  				this.pageSize = res.data.datas.page_size
  				this.total = res.data.datas.item_counts
  				this.tableData = res.data.datas.list
  			}else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
        this.loading = false // 关闭加载动画
        if(!this.tableData.length) this.tableEmptyText = '暂无数据'
  		})
  	},
  	onSearch(){},
  	// 分页每页显示大小变化事件
  	onSizeChange(size){ 
  	  this.pageSize = size 
  	  this._getWarning()
  	},
  	// 当前页数变化事件
  	onCurrentChange(page){
  	  if(!this.pageFlag){
  	    this.pageFlag = true
  	    this.currentPage = page
  	    this._getWarning()
  	  }
  	},
  	formatType(row, column, cellValue){
  	  switch(cellValue){
  	    case 1:
  	      return '进入围栏报警'
  	      break
  	    case 2:
  	      return '出去围栏报警'
  	      break
  	    case 3:
  	      return '未知报警'
  	      break
  	    default:
  	      return '-'
  	  }
  	}
  },
  components:{
  	searchBox
  }
}
</script>

