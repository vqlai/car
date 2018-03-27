<style scoped lang="less">
  @import "./record.less";
</style>
<template>
	<section class="record">
    <searchBox  @onSearch="onSearch" :exportBtn="true" @onExport="onExport"></searchBox>
    <div v-loading="loading" element-loading-text="数据加载中...">
      <el-table
        :data="tableData"
        :empty-text="tableEmptyText"
        border
        height="532"
        style="width: 100%">
        <el-table-column
          prop="vehicle_number"
          label="车牌号"
          width="140">
        </el-table-column>
        <el-table-column
          prop="millage"
          label="公里数(km)"
          :formatter="formatMileAndOil">
        </el-table-column>
        <el-table-column
          prop="oil_consum"
          :formatter="formatMileAndOil"
          label="油耗(L)">
        </el-table-column>
        <el-table-column
          prop="ave_oil_consum"
          label="平均油耗(百公里/L)">
        </el-table-column>
        <el-table-column
          prop="ave_speed"
          label="平均速度(km/h)">
        </el-table-column>
        <el-table-column
          prop="travel_time"
          :formatter="formatTime"
          label="行驶时间(分钟)">
        </el-table-column>
        <el-table-column
          prop="idle_time"
          :formatter="formatTime"
          label="怠速时间(分钟)">
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间">
        </el-table-column>
        <!-- <el-table-column
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
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
import {getDriveRecord} from '@/api/drive'
import moment from 'moment'
import searchBox from '@/components/search-box'
export default {
  name: 'record',
  data () {
    return {
  		tableData: [], 
      // carNumber: '', // 车牌号
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
    // console.log(this.$route)
    if(this.$route.query.id){
      this.queryText = this.$route.query.id
    }
    this._getDriveRecord()
  },
  // watch: {
  //   $route (to) {
  //     if(this.$route.query.id){
  //       this.queryText = this.$route.query.id
  //     }
  //     this._getDriveRecord()
  //   }
  // },
  methods:{
    _getDriveRecord(){
      let params = {
        page: this.currentPage, 
        page_size: this.pageSize, 
        vehicle_number: this.queryText
      }
      this.loading = true
      getDriveRecord(params).then((res)=>{
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
    // 搜索
    onSearch(value){
      this.queryText = value
      if(this.currentPage == 1){
        this._getDriveRecord()
      }else{
        this.currentPage = 1
      }
    },
    // 分页每页显示大小变化事件
    onSizeChange(size){ 
      this.pageSize = size 
      this._getDriveRecord()
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this.currentPage = page
        this._getDriveRecord()
      }
    },
    // 导出
    onExport(){
      location.href = `${process.env.BASE_API}/travel_record/export`
    },
    // 格式化时间
    formatTime(row, column, cellValue){
      return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    },
    onEditClick(row){
      console.log(row)
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

