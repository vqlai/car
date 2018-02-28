<template>
  <div class="car-table">
    <el-input placeholder="请输入车牌号" v-model="searchText" class="search-box" :class="{dialogSence: tableScene===2}">
      <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
    </el-input>
    <!-- :header-row-style="setHeaderClass" 修改头部样式 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      :height="tableHeight"
      border
      v-loading="loading"
      highlight-current-row
      @cell-click="onCellClick"
      :empty-text="emptyText"
      @selection-change="onSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        header-align="center"
        width="36" 
        v-if="showSelection">
      </el-table-column>
      <!-- <el-table-column
        prop="status"
        label="类型"
        width="60"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <i :class="getCarStatusIcon(scope.row.status)"></i>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="vehicle_number"
        label="车牌号"
        align="center"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="is_online"
        label="状态"
        width="80"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <span>{{ getCarStatus(scope.row.is_online) }}</span>
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
import {getCarList} from '@/api/drive'
export default {
  name: 'car-table',
  // props定义的数据无法在computed访问返回undefined，可以在mounted时期通过this访问
  props: {
    showSelection: { // 表格是否增加单选框
      type: Boolean,
      default: false
    },
    tableScene: { // 1表示地图场景，2表示窗口打开场景
      type: Number,
      default: 1
    } 
  },
  data() {
    return{
      tableData: [],
      currentPage: 1, // 当前页索引
      pageSize: 15, // 每页大小 固定
      total: 0, // 总数
      searchText: '',
      emptyText: ' ',
      loading: false,
      tableHeight: null
    }
  },
  mounted() {
    setTimeout(() => {
      this._getCarList()
      this.setTableHeight(this.tableScene)
    },20)
  },
  // computed:{
  //   tableHeight: ()=>{
  //     let tableHeight = 0
  //     console.log(this.tableScene)
  //     if(this.tableScene === 1){
  //       tableHeight = window.innerHeight - (60+20+40+34+32)
  //     }else if(this.tableScene === 2){
  //       tableHeight = 500
  //     }
  //     return tableHeight
  //   }
  // },
  methods: {
    setTableHeight(sence){ // sence：1表示地图场景，2表示窗口打开场景
      if(sence === 1){
        this.tableHeight = window.innerHeight - (85+20+40+34+32)
        this.pageSize = 15
      }else if(sence === 2){
        this.tableHeight = null
        this.pageSize = 10
      }else{

      }
    },
    _getCarList() {
      this.loading = true
      this.tableData = []
      let params = {
        page: this.currentPage, // 当前页索引
        page_size: this.pageSize // 每页大小
      }
      getCarList(params).then(res => {
        // console.log(res)
        if(res.data.ret == 0){
          this.tableData = [...res.data.datas.list]
          this.currentPage = res.data.datas.cur_page
          this.pageSize = res.data.datas.page_size
          this.total = res.data.datas.item_counts
          this.emptyText = this.tableData.length ? ' ' : '暂无数据'
        }else{
          this.$message({
            message: res.data.message,
            type: 'error'
          })
          this.emptyText = res.data.message
        }
        this.loading = false
      })
    },
    // getCarStatusIcon(status) {
    //   return `car-status-icon car-status-icon${status}`
    // },
    getCarStatus(status){
      return status == 1 ? '在线' : '离线'
    },
    // 表格单元格选中事件
    onCellClick(row, column, cell, event){
      this.$emit("onCarTableCellClick", row, column, cell, event)
    },
    // 表格单选框选中事件
    onSelectionChange(val){
      this.$emit("onCarTableSelection", val)
    },
    onSearch(){
      if(this.currentPage === 1){
        this._getCarList()
      }else{
        this.currentPage = 1 // 通过改变页数来触发事件加载数据
      }
    },
    onCurrentChange(page){
      // console.log(`当前页: ${page}`)
      this.currentPage = page
      this._getCarList()
    },
    // 设置表格头部样式
    // setHeaderClass({row, rowIndex}){
    //   return {'color':'red','font-size':'14px','background':'red'}
    // }
  }
}
</script>

<style scoped lang="less">
  .car-table{
    height: 100%;
    .search-box{
      // padding: 1px 0;
    }
    .dialogSence{
      width: 40%;
      padding-bottom: 5px;
    }
    .el-table{
      .car-status-icon{
        display: inline-block;
        width: 18px;
        height: 18px;
        position: absolute;
        top: 10px;
        left: 20px;
      }
      .car-status-icon1{
        background: url('../common/images/status/run.png') no-repeat;
      }
      .car-status-icon2{
        background: url('../common/images/status/stop.png') no-repeat;
      }
      .car-status-icon3{
        background: url('../common/images/status/online.png') no-repeat;
      }
      .car-status-icon4{
        background: url('../common/images/status/offline.png') no-repeat;
      }
      .car-status-icon5{
        background: url('../common/images/status/alarm.png') no-repeat;
      }
      .car-status-icon6{
        background: url('../common/images/status/unuse.png') no-repeat;
      }
    }
    .el-pagination{
      text-align: right;
    }
  }
</style>