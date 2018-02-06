<template>
  <div class="device-table">
    <el-input placeholder="请输入车牌号" v-model="searchText" class="search-box">
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
        width="36" v-if="showSelection">
      </el-table-column>
      <el-table-column
        prop="status"
        label="类型"
        width="60"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <i :class="getCarStatusIcon(scope.row.status)"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="entity_name"
        label="名称"
        align="center"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="60"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ getCarStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="20"
      small
      layout="total, prev, next, jumper"
      @current-change="onCurrentChange"
      :total="100">
    </el-pagination>
  </div>
</template>

<script>
import {getDevice} from '@/api/drive'
export default {
  name: 'device-table',
  props: {
    // tableData: {
    //   type: Array,
    //   required: true
    // },
    showSelection: { // 表格是否增加单选框
      type: Boolean,
      default: false
    }
  },
  data() {
    return{
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      searchText: '',
      emptyText: ' ',
      loading: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._getDevice({
        ak: 'ZXNpDG0ONOKWw9EGpVUBPmmkvzUWG5Y0',
        service_id: '159532'
      })
    },20)
  },
  computed:{
    tableHeight: ()=>{
      return window.innerHeight - (60+20+40+34+40)
    }
  },
  methods: {
    _getDevice(params) {
      this.loading = true
      this.tableData = []
      getDevice(params).then(res => {
        if(res.data.status == 0){
          for(let item of res.data.entities){
            item.status = item.latest_location.loc_time + 5*60 > new Date().getTime()/1000 ? 3 : 4
            this.tableData.push(item)
          }
        }else{
          this.emptyText = res.data.message
        }
        this.loading = false
      })
    },
    getCarStatusIcon(status) {
      return `car-status-icon car-status-icon${status}`
    },
    getCarStatus(status){
      return status == 3 ? '在线' : '离线'
    },
    // 表格单元格选中事件
    onCellClick(row, column, cell, event){
      this.$emit("onCellClick", row, column, cell, event)
    },
    // 表格单选框选中事件
    onSelectionChange(val){
      this.$emit("onSelectionChange", val)
    },
    onSearch(){
      console.log(this.searchText)
      this._getDevice({
        ak: 'ZXNpDG0ONOKWw9EGpVUBPmmkvzUWG5Y0',
        service_id: '159532',
        filter: this.searchText ? `entity_names:${this.searchText}`:'' 
      })
    },
    onCurrentChange(val){
      console.log(`当前页: ${val}`)
    },
    // 设置表格头部样式
    // setHeaderClass({row, rowIndex}){
    //   return {'color':'red','font-size':'14px','background':'red'}
    // }
  }
}
</script>

<style scoped lang="less">
  .device-table{
    height: 100%;
    .search-box{
      padding: 4px 0;
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