<style scoped lang="less">
  @import "./monitor.less";
</style>

<template>
	<section class="monitor">                 
		<el-container>
      <el-main>
        <!-- <div class="map-menu"></div> -->
        <!-- sync组件双向绑定 -->
        <!-- <bdmap :mapObj.sync="baiduMap"></bdmap> -->
        <!-- on emit 组件绑定 -->
        <map-panel :isNeedMapObj="true" @sendMapObj="getMapObj"></map-panel>
        <el-dialog title="跟踪" :visible.sync="trackDialog">
          <el-table :data="trackDialogData">
            <el-table-column property="entity_name" label="名称"></el-table-column>
            <el-table-column property="entity_desc" label="描述" width="200"></el-table-column>
            <el-table-column property="create_time" label="创建时间" width="150"></el-table-column>
          </el-table>
        </el-dialog>
      </el-main>
      <el-aside width="320px">
        <el-tabs type="border-card">
          <el-tab-pane label="设备列表">
            <deviceTable :tableData="tableData" :showSelection="true" @onCellClick="onTableCellClick" @onSelectionChange="onTableSelectionChange"></deviceTable>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script> 
import {addMapOverlay, openMapDialog} from '@/common/js/bdmap'
import {getDevice} from '@/api/drive'
import mapPanel from '@/components/map-panel'
import deviceTable from '@/components/device-table'
export default {
  name: 'monitor',
  data () {
    return {
      originData: [],
      tableData: [],
      mapObj: null, // 对图对象
      trackDialogData: [{
        create_time: '',
        entity_name: '',
        entity_desc: ''
      }],
      trackDialog: false,
      multipleSelection: null // 多选按钮值
    }
  },
  computed:{},
  mounted() {
    setTimeout(() => {
      this._getDevice()
    },20)
  },
  methods:{
    // 获取设备列表
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
        // console.log(this.tableData)
      })
    },
    // 表格单选框选中事件
    onTableSelectionChange(val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection)
    },
    // 表格entity_name单元格点击事件
    onTableCellClick(row, column, cell, event){
      if(column.property == 'entity_name'){
        let marker = addMapOverlay(row)
        marker.addEventListener("click",(e) => {
          // openMapDialog返回百度地图的infoWindow对象
          this.onMapInfoWin(openMapDialog(row), row)
        })
        // 默认点击单元格弹窗
        this.onMapInfoWin(openMapDialog(row), row)
      }
    },
    // 处理弹窗点击数据
    onMapInfoWin(infoWindow, row) {
      console.log(row)
      // 通过infoWindow的open事件来给弹窗按钮绑定事件
      infoWindow.addEventListener("open",(e) => {
        document.getElementById("trackBtn").onclick = () => {
          this.$router.push({ path: 'monitor', query: { name: row.entity_name }})
        }
        document.getElementById("dataBtn").onclick = () => {
          this.trackDialog = true
          this.trackDialogData = []
          this.trackDialogData.push(row)
        }
      })
      let point = new BMap.Point(row.latest_location.longitude, row.latest_location.latitude)
      this.mapObj.openInfoWindow(infoWindow, point) //开启信息窗口
      // this.mapObj.panTo(point) // 将窗口移动到视野中心 (不能与enableAutoPan配置一起使用，会屏闪)
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
    },
  },
  components:{
    mapPanel,
    deviceTable
  }
}
</script>