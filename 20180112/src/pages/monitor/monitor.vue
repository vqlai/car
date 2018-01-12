<style scoped lang="less">
  @import "./monitor.less";
</style>

<template>
	<section class="monitor">                 
    <top-header></top-header>
		<el-container>
      <el-main>
        <!-- <div class="map-menu"></div> -->
        <!-- sync组件双向绑定 -->
        <!-- <bdmap :mapObj.sync="baiduMap"></bdmap> -->
        <!-- on emit 组件绑定 -->
        <map-panel></map-panel>
      </el-main>
      <el-aside width="300px">
        <el-tabs type="border-card">
          <el-tab-pane label="设备列表">
            <!-- :header-row-style="setHeaderClass" -->
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="800"
              border
              highlight-current-row
              @cell-click="handleCellClick"
              empty-text="暂无数据"
              @selection-change="handleSelectionChange"
              style="width: 100%">
              <!-- <el-table-column
                type="selection"
                width="40">
              </el-table-column> -->
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
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script> 
import {addMapOverlay, openMapDialog} from '@/common/js/bdmap'
import {getDevice} from '@/api/monitor'
import mapPanel from '@/components/map-panel'
export default {
  name: 'car-monitor',
  data () {
    return {
      originData: [],
      tableData: [],
      // tableData: [{
      //   type: '3',
      //   name: '鲁BQ86L7',
      //   status: '在线'
      // },{
      //   type: '4',
      //   name: '鲁BQ81L7',
      //   status: '离线'
      // }],
      currentPage: 1,
      // multipleSelection: []
    }
  },
  computed:{
    
  },
  mounted() {
    setTimeout(() => {
      this._getDevice()
    },20)
  },
  methods:{
    _getDevice() {
      let params = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644'
      }
      getDevice(params).then(res => {
        this.originData = res.data.entities
        for(let item of this.originData){
          item.status = item.latest_location.loc_time + 5*60 > new Date().getTime()/1000 ? 3 : 4
          this.tableData.push(item)
        }
        console.log(this.tableData)
      })
    },
    getCarStatusIcon(status) {
      return `car-status-icon car-status-icon${status}`
    },
    getCarStatus(status){
      let text = status == 3 ? '在线' : '离线'
      return text
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCellClick(row, column, cell, event){
      if(column.property == 'entity_name'){
        addMapOverlay(row)
        openMapDialog(row)
      }
    }
    // 设置表格头部样式
    // setHeaderClass({row, rowIndex}){
    //   return {'color':'red','font-size':'14px','background':'red'}
    // }
  },
  components:{
    mapPanel
  }
}
</script>