<style scoped lang="less">
  @import "./record.less";
</style>
<template>
	<section class="record">
  	<el-table
	    :data="tableData"
	    border
	    style="width: 100%">
	    <el-table-column
	      prop="date"
	      label="日期"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="姓名"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="address"
	      label="地址">
	    </el-table-column>
	  </el-table>
	</section>
</template>

<script>
export default {
  name: 'record',
  data () {
    return {
  		tableData: [{
  	    date: '2017-05-02',
  	    name: '王小虎',
  	    address: '上海市普陀区'
  	  }, {
  	    date: '2017-05-04',
  	    name: '王小虎',
  	    address: '上海市普陀区'
  	  }, {
  	    date: '2017-05-01',
  	    name: '王小虎',
  	    address: '上海市普陀区'
  	  }, {
  	    date: '2017-05-03',
  	    name: '王小虎',
  	    address: '上海市普陀区'
  	  }]
    }
  },
  mounted() {
  },
  methods:{
  },
  components:{
  }
}
</script>

