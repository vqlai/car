<style scoped lang="less">
  @import "./website.less";
</style>

<template>
	<section class="website">
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
        prop="name"
        label="网点名称">
      </el-table-column>
      <el-table-column
        prop="address"
        label="详细地址">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        width="150"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="lnglat"
        width="150"
        label="地理坐标">
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
  name: 'website',
  data () {
    return {
      tableData: [{
        name: 'xxx',
        address: 'yyy',
        phoneNumber: '177xxxxxxx',
        lnglat:'(120,33)'
      }], 
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

