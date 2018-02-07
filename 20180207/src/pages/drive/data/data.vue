<style scoped lang="less">
  @import "./data.less";
</style>
<template>
	<section class="data">
    <el-row type="flex" class="top-btns">
      <el-col :span="2" :offset="22"><el-button type="primary" icon="el-icon-plus">添加</el-button></el-col>
    </el-row>
    <!-- :formatter="formatTime" -->
  	<el-table
      v-loading="loading"
	    :data="tableData"
      :empty-text="emptyText"
	    border
      height="600"
	    style="width: 100%">
	    <el-table-column
	      prop="vechile_number"
	      label="车牌"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="tbox_id"
	      label="设备序列号"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="total_mileage"
	      label="总里程">
	    </el-table-column>
      <el-table-column
        prop="total_fuel"
        label="总油耗">
      </el-table-column>
      <el-table-column
        prop="total_travel_time"
        label="总怠速时长">
      </el-table-column>
      <el-table-column
        prop="last_travel_time"
        label="总行程时间">
      </el-table-column>
      <el-table-column
        prop="total_idle_time"
        label="最近行驶时间">
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" @click="onDetailClick(scope.row)" size="small">详情</el-button>
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
import {getDriveData} from '@/api/drive'
import moment from 'moment'
export default {
  name: 'v-data', // 如命名data，vue报错
  data () {
    return {
    	tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: true,
      emptyText: ' '
    }
  },
  mounted() {
    let params = {
      page: this.currentPage,
      page_size: this.pageSize
    }
    this._getDriveData(params)
  },
  methods:{
    _getDriveData(params){
      getDriveData(params).then((res)=>{
        console.log(res)
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
        if(!this.tableData.length) this.emptyText = '暂无数据'
      })
    },
    // 分页每页显示大小变化事件
    onSizeChange(page){ 
      console.log(page)
      this.pageSize = page 
      this._getDriveData({page: this.currentPage, page_size: this.pageSize})
    },
    // 当前页数变化事件
    onCurrentChange(page){
      console.log(page)
      if(!this.pageFlag){
        this.pageFlag = true
        this._getDriveData({page: page, page_size: this.pageSize})
      }
    },
    // 格式化时间
    // formatTime(row, column, cellValue){
    //   return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    // },
    onEditClick(row){
      console.log(row)
    },
    onDetailClick(row){
      console.log(row.vechile_number)
      // this.$router.push({ path: `/record/${row.vechile_number}` }) 
      this.$router.push({ path: 'record', query: { id: row.vechile_number }})
    }
  },
  components:{
  }
}
</script>

