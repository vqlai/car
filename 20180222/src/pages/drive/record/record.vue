<style scoped lang="less">
  @import "./record.less";
</style>
<template>
	<section class="record">
  	<el-row type="flex" class="top-btns">
      <el-col :span="2" :offset="22"><el-button type="primary" icon="el-icon-plus">添加</el-button></el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :empty-text="emptyText"
      border
      height="600"
      style="width: 100%">
      <el-table-column
        prop="vehicle_number"
        label="车牌号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="millage"
        label="公里数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="oil_consum"
        label="油耗">
      </el-table-column>
      <el-table-column
        prop="ave_oil_consum"
        label="平均油耗">
      </el-table-column>
      <el-table-column
        prop="ave_speed"
        label="平均速度">
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="travel_time"
        label="行驶时间">
      </el-table-column>
      <el-table-column
        prop="idle_time"
        label="怠速时间">
      </el-table-column>
      <!-- <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column> -->
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
import {getDriveRecord} from '@/api/drive'
import moment from 'moment'
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
      loading: true,
      emptyText: ' '
    }
  },
  mounted() {
    console.log(this.$route)
    // if(this.$route.query.id){
    //   this.carNumber = this.$route.query.id
    // }
    let params = {
      page: this.currentPage,
      page_size: this.pageSize,
      // vehicle_number: this.carNumber
    }
    this._getDriveRecord(params)
  },
  methods:{
    _getDriveRecord(params){
      getDriveRecord(params).then((res)=>{
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
      this._getDriveRecord({page: this.currentPage, page_size: this.pageSize, vehicle_number: this.carNumber})
    },
    // 当前页数变化事件
    onCurrentChange(page){
      console.log(page)
      if(!this.pageFlag){
        this.pageFlag = true
        this._getDriveRecord({page: page, page_size: this.pageSize, vehicle_number: this.carNumber})
      }
    },
    // 格式化时间
    formatTime(row, column, cellValue){
      return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    },
    onEditClick(row){
      console.log(row)
    }
  },
  components:{
  }
}
</script>

