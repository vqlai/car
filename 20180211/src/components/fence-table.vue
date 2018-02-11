<template>
  <div class="fence-table">
    <el-input placeholder="请输入围栏名称" v-model="searchText" class="search-box">
      <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
    </el-input>
  	<el-table
      :data="tableData"
      :height="tableHeight"
      border
      highlight-current-row
      @cell-click="onCellClick"
      :empty-text="emptyText"
      style="width: 100%">
      <el-table-column
        prop="fence_name"
        label="围栏名称"
        align="center"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="70"
        align="center"
        :formatter="formatType"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="vehicle_count"
        label="数量"
        width="40"
        align="center"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="opt"
        label="操作"
        width="80"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onAddClick(scope.row)">添加</el-button>
          <el-button type="text" size="small" @click="onDeleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      layout="total, prev, next, jumper"
      @current-change="onCurrentChange"
      small>
    </el-pagination>
    <el-dialog :title="bindDeviceDialogTitle" :visible.sync="bindDeviceDialog" width="30%" top="8vh">
      <!-- value为tab默认选中页 -->
      <el-tabs :value="currentTab" @tab-click="onTabClick" type="card">
        <el-tab-pane label="绑定新车辆" name="binding">
          <carTable :showSelection="true" :tableScene="2" @onCarTableSelection="onCarTableSelection"></carTable>
        </el-tab-pane>
        <el-tab-pane label="已绑定车辆" name="binded">
          <carBindedTable :fenceId="bindCarData.fenceId" v-if="isCarBindedTable"></carBindedTable>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindDeviceDialog = false">取 消</el-button>
        <el-button type="primary" @click="onOkBindCar">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getFence, deleteFence, bindCar} from '@/api/operation'
import carTable from '@/components/car-table'
import carBindedTable from '@/components/car-binded-table'
export default {
  name: 'fence-table',
  props: {},
  data () {
    return {
      tableData: [],
      bindDeviceDialogTitle: '',
      bindDeviceDialog: false,
      currentPage: 1, // 当前页索引
      pageSize: 15, // 每页大小 固定
      total: 0, // 总数
      searchText: '',
      emptyText:' ',
      bindCarData:{
        fenceId: '',
        carNumber: ''
      },
      isCarBindedTable: false,
      currentTab: 'binding'
    }
  },
  computed:{
    // 计算表格高度
    tableHeight: ()=>{
      return window.innerHeight - (60+20+40+34+32)
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.reloadTable()
    })
  },
  methods:{
    // 获取围栏列表
    _getFence(params) {
      this.tableData = []
      getFence(params).then((res)=>{
        if(res.data.ret == 0){
          this.tableData = [...res.data.datas.list]
          this.currentPage = res.data.datas.cur_page
          this.total = res.data.datas.item_counts
          this.emptyText = this.tableData.length ? ' ' : '暂无数据'
        }else{
          this.$message({
            message: res.data.message,
            type: 'error'
          })
          this.emptyText = res.data.message
        }
      })
    },
    // 获取围栏所有绑定的车辆
    // 新增围栏按钮
    onAddClick(row) {
      // console.log(row)
      this.currentTab = 'binding'
      this.bindDeviceDialogTitle = `绑定围栏-${row.fence_name}`
      this.bindDeviceDialog = true
      this.bindCarData.fenceId = row.fence_id
      this.isCarBindedTable = false 
      console.log(this.currentTab)
    },
    // 删除围栏按钮
    onDeleteClick(row){
      // console.log(row)
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFence({fence_ids: row.fence_id}).then((res)=>{
          if(res.data.ret == 0){
            this.reloadTable()
          }
        })
      })
    },
    // 表格单元格选中事件
    onCellClick(row, column, cell, event){
      // console.log(column)
      if(column.property!="opt"){
        this.$emit("onFenceTableCellClick", row, column, cell, event)
      }
    },
    // 搜索围栏按钮
    onSearch(){
    },
    // 新增围栏绑定车辆多选框
    onCarTableSelection(arr){
      console.log(arr)
      let cacheStr = ''
      for(let item of arr){
        cacheStr += `${item.vehicle_number},`
      }
      this.bindCarData.carNumber = cacheStr.substring(0, cacheStr.lastIndexOf(','))
    },
    // 绑定车辆确定按钮
    onOkBindCar(){
      if(!this.bindCarData.carNumber){
        this.$message({
          message: '请选择需要绑定的车辆',
          type: 'error'
        })
        return false
      }
      // console.log(this.bindCarData)
      bindCar({fence_id: this.bindCarData.fenceId,vehicle_number: this.bindCarData.carNumber}).then((res)=>{
        // console.log(res)
        if(res.data.ret==0){
          this.$message({
            message: '绑定车辆成功',
            type: 'success'
          })
          this.bindDeviceDialog = false
          this.reloadTable()
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 绑定围栏弹窗tab切换事件
    onTabClick(tab){
      console.log(tab.name)
      if(tab.name == "binded") this.isCarBindedTable = true
    },
  	// 分页点击事件
    onCurrentChange(page){
      // console.log(`当前页: ${page}`)
      this._getFence({page: page,page_size: this.pageSize})
    },
    reloadTable(){
      this._getFence({page: 1,page_size: this.pageSize})
    },
    formatType(row, column, cellValue){
      return cellValue===1? '圆形':cellValue===2?'多边形':''
    }
  },
  components:{
    carTable,
    carBindedTable
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.fence-table{
    .el-pagination{
      text-align: right;
    }
  }
</style>
