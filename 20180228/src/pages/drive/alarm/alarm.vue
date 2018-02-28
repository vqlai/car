<style scoped lang="less">
  @import "./alarm.less";
</style>

<template>
	<section class="alarm">
    <el-row type="flex" class="table-handle-box" :gutter="20">
      <el-col :sm="5" :xl="4">
        <el-input v-model="queryText" placeholder="请输入车牌号"></el-input>
      </el-col>
      <el-col :sm="3" :xl="2">
        <el-button type="primary" icon="el-icon-search" @click="onSearchClick">搜索</el-button>
      </el-col>
    </el-row>
		<el-table
      v-loading="loading"
      :data="tableData"
      :empty-text="tableText"
      border
      height="531"
      style="width: 100%">
      <el-table-column
        prop="vehicle_number"
        label="车牌号">
      </el-table-column>
      <el-table-column
        prop="alarm_content"
        :formatter="formatAlarm"
        label="报警内容">
      </el-table-column>
      <el-table-column
        prop="alarm_time"
        label="报警时间">
      </el-table-column>
      <el-table-column
        width="160"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button> -->
          <el-button @click="onDeleteClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import {getAlarmInfo, deleteAlarmInfo} from '@/api/drive'
export default {
  name: 'alarm',
  data () {
    return {
  		tableData: [], 
  	  currentPage: 1, // 当前页
  	  pageSize: 10, // 每页大小
  	  total: 0, // 总记录数
  	  pageFlag: false, // 防止分页快速点击bug
  	  loading: true,
  	  tableText: ' ',
  	  queryText: ''
    }
  },
  mounted() {
  	this.$nextTick(()=>{
  	  this._getAlarmInfo()
  	})
  },
  methods:{
  	_getAlarmInfo(){
  		let params = { 
  			page: this.currentPage, 
  			page_size: this.pageSize, 
  			vehicle_number: this.queryText 
  		}
  		getAlarmInfo(params).then(res=>{
  			this.pageFlag = false
  			if(res.data.ret == 0){
  			  this.currentPage = res.data.datas.cur_page
  			  this.pageSize = res.data.datas.page_size
  			  this.total = res.data.datas.item_counts
  			  this.tableData = [...res.data.datas.list]
  			}else{
  			  this.$message({
  			    message: res.data.msg,
  			    type: 'error'
  			  })
  			}
  			this.loading = false // 关闭加载动画
  			if(!this.tableData.length) this.tableText = '暂无数据'
  		})
  	},
  	onCurrentChange(page){
  		if(!this.pageFlag){
  		  this.pageFlag = true
  		  this.currentPage = page
  		  this._getAlarmInfo()
  		}
  	},
  	onSizeChange(size){
  		this.pageSize = size
  		this._getAlarmInfo()
  	},
  	onSearchClick(){
  		if(this.currentPage === 1 ){
  		  this._getAlarmInfo()
  		}else{
  		  // 通过改变页数来触发事件从而进行搜索
  		  this.currentPage = 1
  		}
  	},
  	// onEditClick(row){},
  	onDeleteClick(row){
  		this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
  		  confirmButtonText: '确定',
  		  cancelButtonText: '取消',
  		  type: 'warning'
  		}).then(() => {
  		  deleteAlarmInfo({fault_alarm_id: row.fault_alarm_id}).then((res)=>{
  		    this.loadTableData(res, 2)
  		  })
  		})
  	},
  	loadTableData(res, status){
      if(res.data.ret == 0){
        this._getAlarmInfo()
        let msg = status === 1 ? '添加成功！' : '删除成功！'
        this.$message({
          message: msg,
          type: 'success'
        })
      }else{
        this.$message({
          message: res.data.msg,
          type: 'error'
        })
      }
    },
  	formatAlarm(row){
  		switch(row.alarm_content){
  		  case 1:
  		    return `点火上报`
  		    break
  		  case 2:
  		    return `熄火上报`
  		    break
  		  case 3:
  		    return `终端拔出`
  		    break
  		  case 4:
  		    return `终端插入`
  		    break
  		  case 5:
  		    return `低电压报警`
  		    break
  		  case 6:
  		    return `车门打开`
  		    break
  		  case 7:
  		    return `车门关闭`
  		    break
  		  case 8:
  		    return `系统启动`
  		    break
  		  default:
  		    return '-'
  		}
  	}
  },
  components:{
  }
}
</script>

