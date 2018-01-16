<template>
  <div class="device-table">
    <!-- :header-row-style="setHeaderClass" 修改头部样式 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      height="800"
      border
      highlight-current-row
      @cell-click="onCellClick"
      empty-text="暂无数据"
      @selection-change="onSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="40" v-if="showSelection">
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
      layout=" prev, pager, next"
      :total="100">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'device-table',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    showSelection: { // 表格是否增加单选框
      type: Boolean,
      default: false
    }
  },
  methods: {
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