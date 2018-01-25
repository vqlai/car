<template>
  <div class="fence-table">
  	<el-table
      :data="tableData"
      :height="tableHeight"
      border
      highlight-current-row
      @cell-click="onCellClick"
      empty-text="暂无数据"
      style="width: 100%">
      <el-table-column
        prop="fence_name"
        label="围栏名称"
        width="80"
        align="center"
        header-align="center">
      </el-table-column>
      <el-table-column
        prop="shape"
        label="类型"
        align="center"
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
        width="60"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onAddClick(scope.row)">添加</el-button>
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
    <el-dialog title="绑定设备" :visible.sync="bindDeviceDialog">
      <p>test</p>
      <!-- <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'fence-table',
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      bindDeviceDialog: false,
      currentPage: 1,
    }
  },
  computed:{
    // 计算表格高度
    tableHeight: ()=>{
      return window.innerHeight - (60+20+40+34)
    }
  },
  mounted() {
  },
  methods:{
    onAddClick(row) {
      console.log(row)
      this.bindDeviceDialog = true
    },
    // 表格单元格选中事件
    onCellClick(row, column, cell, event){
      this.$emit("onCellClick", row, column, cell, event)
    },
  	// 分页点击事件
    onCurrentChange(val){
      console.log(`当前页: ${val}`);
    },
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
