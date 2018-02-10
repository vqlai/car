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
import {addMapOverlay, getInfoWindow, formatLngLat} from '@/common/js/bdmap'
import mapPanel from '@/components/map-panel'
import carTable from '@/components/car-table'
import {getCarInfo} from '@/api/drive'
export default {
  name: 'monitor',
  data () {
    return {
      mapObj: null, // 地图对象
      // trackDialogData: [{
      //   create_time: '',
      //   entity_name: '',
      //   entity_desc: ''
      // }],
      // trackDialog: false,
      multipleSelection: null // 多选按钮值
    }
  },
  computed:{},
  mounted() {
    setTimeout(() => {
    },20)
  },
  methods:{
    // 表格单选框选中事件
    onCarTableSelection(val) {
      this.multipleSelection = val
    },
    // 表格entity_name单元格点击事件
    onCarTableCellClick(row, column, cell, event){
      // console.log(row)
      if(column.property == 'vehicle_number'){
        getCarInfo({vehicle_number: row.vehicle_number}).then((res)=>{
          // console.log(res)
          if(res.data.ret==0){
            let cache = res.data.datas.entities[0].latest_location
            let marker = addMapOverlay(cache.longitude,cache.latitude)
            marker.addEventListener("click",(e) => {
              this.loadMapDialog(res.data.datas)
            })
            this.loadMapDialog(res.data.datas)
          }
        })
        
      }
    },
    // 组合地图窗口html
    loadMapDialog(data){
      let obj = data.entities[0]
      // formatLngLat异步格式化经纬度
      formatLngLat(obj.latest_location.longitude,obj.latest_location.latitude).then(res => {
        // console.log(res)
        obj.address = res
        // 默认点击单元格弹窗
        this.openMapDialog(getInfoWindow(obj), obj)
      })
    },
    // 打开窗口/绑定按钮事件
    openMapDialog(infoWindow, row) {
      // console.log(row)
      // 通过infoWindow的open事件来给弹窗按钮绑定事件
      // infoWindow.addEventListener("open",(e) => {
      //   document.getElementById("trackBtn").onclick = () => {
      //     this.$router.push({ path: 'monitor', query: { name: row.entity_name }})
      //   }
      //   document.getElementById("dataBtn").onclick = () => {
      //     this.trackDialog = true
      //     this.trackDialogData = []
      //     this.trackDialogData.push(row)
      //   }
      // })
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
    carTable
  }
}
</script>