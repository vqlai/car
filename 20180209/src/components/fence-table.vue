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
        width="80"
        align="center"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        :formatter="formatType"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="fence_id"
        label="数量"
        width="60"
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
    <el-dialog :title="bindDeviceDialogTitle" :visible.sync="bindDeviceDialog" width="30%">
      <deviceTable :showSelection="true" :tableScene="2"></deviceTable>
    </el-dialog>
  </div>
</template>

<script>
import {getFence, deleteFence} from '@/api/operation'
import deviceTable from '@/components/device-table'
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
      emptyText:' '
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
        }
      })
    },
    onAddClick(row) {
      console.log(row)
      this.bindDeviceDialogTitle = `绑定围栏-${row.fence_name}`
      this.bindDeviceDialog = true
    },
    onDeleteClick(row){
      console.log(row)
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
    onSearch(){
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
    deviceTable
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
