<style scoped lang="less">
  @import "./monitor.less";
</style>

<template>
	<section class="monitor">                 
    <top-header></top-header>
		<el-container>
      <el-main>
        <!-- <div class="map-menu"></div> -->
        <!-- <div id="bdmap"></div> -->
        <bdmap></bdmap>
      </el-main>
      <el-aside width="300px">
        <el-tag>设备列表</el-tag>
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
      </el-aside>
    </el-container>
	</section>
</template>

<script> 
import {addMapOverlay,openMapDialog} from '@/common/js/bdmap'
import {getDevice} from '@/api/monitor'
import bdmap from '@/components/bdmap.vue'
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
      // let obj={
      //   domId: 'bdmap',
      //   city: '深圳',
      //   maxzoom: 16,
      //   minzoom: 5
      // }
      // initBdMap(obj).then(map => {
      //   // 添加带有定位的导航控件
      //   var navigationControl = new BMap.NavigationControl({ 
      //     enableGeolocation: false, // 启用显示定位
      //     anchor:BMAP_ANCHOR_TOP_LEFT // 定位固定位置
      //   })
      //   map.addControl(navigationControl)
      // }).then(()=>{
      //   this._getDevice()
      // })
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
        console.log(row)
        console.log(column)
        console.log(cell)
        console.log(event)
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
    bdmap
  }
}
</script>