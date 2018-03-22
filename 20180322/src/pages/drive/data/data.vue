<style scoped lang="less">
  @import "./data.less";
</style>

<template>
	<section class="data">
    <searchBox @onSearch="onSearch" :exportBtn="true" @onExport="onExport"></searchBox>
    <div v-loading="loading" element-loading-text="数据加载中...">
    	<el-table
  	    :data="tableData"
        :empty-text="tableEmptyText"
  	    border
        height="531"
  	    style="width: 100%">
  	    <el-table-column
  	      prop="vehicle_number"
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
          :formatter="formatMileAndOil"
  	      label="总里程(公里)">
  	    </el-table-column>
        <el-table-column
          prop="total_fuel"
          :formatter="formatMileAndOil"
          label="总油耗(L)">
        </el-table-column>
        <el-table-column
          prop="total_idle_time"
          :formatter="formatTime"
          label="总怠速时长(分钟)">
        </el-table-column>
        <el-table-column
          prop="total_travel_time"
          :formatter="formatTime"
          label="总行程时间(分钟)">
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="最近行驶时间"
          width="160">
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
    </div>
	</section>
</template>

<script>
import {getDriveData} from '@/api/drive'
import moment from 'moment'
import searchBox from '@/components/search-box'
export default {
  name: 'v-data', // 如命名data，vue报错
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
      this._getDriveData()
    },20)
  },
  methods:{
    _getDriveData(){
      let params = {
        page: this.currentPage,
        page_size: this.pageSize,
        vehicle_number: this.queryText
      }
      this.loading = true
      getDriveData(params).then((res)=>{
        // console.log(res)
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
        if(!this.tableData.length) this.tableEmptyText = '暂无数据'
      })
    },
    onSearch(value){
      this.queryText = value
      if(this.currentPage == 1){
        this._getDriveData()
      }else{
        this.currentPage = 1
      }
    },
    // 分页每页显示大小变化事件
    onSizeChange(size){ 
      this.pageSize = size 
      this._getDriveData()
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this.currentPage = page
        this._getDriveData()
      }
    },
    // 导出
    onExport(){
      location.href = `${process.env.BASE_API}/travel_data/export`
    },
    // 格式化时间
    // formatTime(row, column, cellValue){
    //   return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    // },
    onEditClick(row){
      console.log(row)
    },
    onDetailClick(row){
      console.log(row.vehicle_number)
      // this.$router.push({ path: `/record/${row.vehicle_number}` }) 
      this.$router.push({ path: 'record', query: { id: row.vehicle_number }})
    },
    formatMileAndOil(row, column, cellValue){
      return (cellValue/1000).toFixed(2)
    },
    formatTime(row, column, cellValue){
      return (cellValue/60).toFixed(2)
    }
  },
  components:{
    searchBox
  }
}
</script>

