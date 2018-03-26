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
        <map-panel :isNeedMapObj="true" @sendMapObj="getMapObj" :defaultZoom="5" defaultCity="北京"></map-panel>
        <!-- <el-dialog title="跟踪" :visible.sync="trackDialog">
          <el-table :data="trackDialogData">
            <el-table-column property="entity_name" label="名称"></el-table-column>
            <el-table-column property="entity_desc" label="描述" width="200"></el-table-column>
            <el-table-column property="create_time" label="创建时间" width="150"></el-table-column>
          </el-table>
        </el-dialog> -->
      </el-main>
      <el-aside width="320px">
        <el-tabs type="border-card">
          <el-tab-pane label="车辆列表">
            <carTable :showSelection="true" @onCarTableCellClick="onCarTableCellClick" @onCarTableSelection="onCarTableSelection"></carTable>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script> 
import {addCarMapOverlay, getInfoWindow, formatLngLat,getInfoWindowHtml} from '@/common/js/bdmap'
import mapPanel from '@/components/map-panel'
import carTable from '@/components/car-table'
import {getAllCar, getMonitorCarInfo} from '@/api/drive'
export default {
  name: 'monitor',
  data () {
    return {
      mapObj: null, // 地图对象
      // trackDialogData: [{
      // }],
      // trackDialog: false,
      multipleSelection: null, // 多选按钮值
      timer: null,
      carMarker: null,
      infoWindow: null,
      winStatus: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._getAllCar()
      if(this.timer){
        clearInterval(this.timer)
      }
    },20)
  },
  methods:{
    // 获取所有车辆
    _getAllCar(){
      getAllCar().then(res=>{
        if(res.data.ret == 0){
          for(let item of res.data.datas){
            let marker = addCarMapOverlay(item.longitude,item.latitude)
          }
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 表格单选框选中事件
    onCarTableSelection(val) {
      this.multipleSelection = val
    },
    // 表格单元格点击事件
    onCarTableCellClick(row, column, cell, event){
      if(column.property == 'vehicle_number'){
        if(this.timer){
          clearInterval(this.timer)
        }
        this.carMarker = null
        this.winStatus = false
        this.mapObj.clearOverlays() // 清除地图覆盖物
        this._getMonitorCarInfo(row)
        this.timer = setInterval(()=>{
          this.winStatus = false
          this._getMonitorCarInfo(row)
        }, 10000)
      }
    },
    _getMonitorCarInfo(row){
      if(this.$route.name !== 'monitor'){
        clearInterval(this.timer)
        return false
      }
      getMonitorCarInfo({vehicle_number: row.vehicle_number}).then(res=>{
        if(res.data.ret == 0){
          let point = new BMap.Point(res.data.datas.longitude,res.data.datas.latitude)
          if(!this.carMarker){
            this.winStatus = true
            this.carMarker = addCarMapOverlay(res.data.datas.longitude,res.data.datas.latitude)
          }else{
            this.carMarker.setPosition(point)
          }
          this.carMarker.addEventListener("click",(e) => {
            this.loadMapDialog(res.data.datas)
          })
          this.loadMapDialog(res.data.datas)
          this.mapObj.setViewport([point])
        }else{
          clearInterval(this.timer)
          this.$message({
            message: '车辆实时数据获取失败，请重新获取！',
            type: 'error'
          })
        }
      })
    },
    // 组合地图窗口html
    loadMapDialog(row){
      // formatLngLat异步格式化经纬度
      formatLngLat(row.longitude, row.latitude).then(res => {
        row.address = res
        if(this.winStatus){
          this.infoWindow = getInfoWindow(row)
          this.carMarker.openInfoWindow(this.infoWindow) //开启信息窗口
        }else{
          this.infoWindow.setContent(getInfoWindowHtml(row))
        }
      })
    },
    created() {
      if(this.timer){
        clearInterval(this.timer)
      }
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
    },
  },
  components:{
    mapPanel,
    carTable
  }
}
</script>