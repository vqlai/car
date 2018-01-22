<style scoped lang="less">
  @import "./bind.less";
</style>
<template>
	<section class="bind">
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
        prop="vehicle_brand"
        label="车辆品牌">
      </el-table-column>
      <el-table-column
        prop="brand_logo"
        label="品牌logo">
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
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
import {getBindCar, addBindCar, deleteBindCar} from '@/api/traffic'
export default {
  name: 'bind',
  data () {
    return {
	    tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: false,
      emptyText: ''
    }
  },
  mounted() {
    this.$nextTick(()=>{
      let params = {
        page: this.currentPage,
        page_size: this.pageSize
      }
      this._getBindCar(params)
    })
  },
  methods:{
    _getBindCar(params){
      getBindCar(params).then((res) => {
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
      this.pageSize = page 
      this._getBindCar({page: this.currentPage, page_size: this.pageSize})
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this._getBindCar({page: page, page_size: this.pageSize})
      }
    },
    // 格式化时间
    formatTime(row, column, cellValue){
      return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    },
    onEditClick(row){
      console.log(row)
    },
    onDeleteClick(row){
      console.log(row)
    }
  },
  components:{
  }
}
</script>

