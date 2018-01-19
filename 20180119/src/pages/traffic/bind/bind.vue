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
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
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
  },
  methods:{
    // 分页每页显示大小变化事件
    onSizeChange(page){ 
      console.log(page)
    },
    // 当前页数变化事件
    onCurrentChange(page){
      console.log(page)
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

