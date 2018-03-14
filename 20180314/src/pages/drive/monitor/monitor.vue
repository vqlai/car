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
import {addCarMapOverlay, getInfoWindow, formatLngLat} from '@/common/js/bdmap'
import mapPanel from '@/components/map-panel'
import carTable from '@/components/car-table'
import {getAllCar,getCarInfo} from '@/api/drive'
export default {
  name: 'monitor',
  data () {
    return {
      mapObj: null, // 地图对象
      // trackDialogData: [{
      // }],
      // trackDialog: false,
      multipleSelection: null, // 多选按钮值
      stompClient: null, // 存储websoket对象
    }
  },
  mounted() {
    setTimeout(() => {
      if(this.stompClient){
        this.stompClient.disconnect() // 关闭连接
      }
      this._getAllCar()
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
      if(this.stompClient){
        this.stompClient.disconnect() // 关闭连接
      }
      if(column.property == 'vehicle_number'){
        if(!this.stompClient || !this.stompClient.connected){
          // 建立socket连接并且订阅消息
          let socket = new SockJS(`${process.env.BASE_API}/my-websocket`)
          this.stompClient = Stomp.over(socket)
          this.stompClient.connect({}, (frame) => {
            // subscribe订阅消息，接收后台消息
            this.stompClient.subscribe('/topic/web/100/remote_travel_notify', (msg) => {
              let res = JSON.parse(msg.body)
              // console.log(res)
              if(res.ret == 0){
                this.mapObj.clearOverlays() // 清除地图覆盖物
                let marker = addCarMapOverlay(res.datas.longitude,res.datas.latitude)
                // this.mapObj.panTo(new BMap.Point(res.datas.longitude,res.datas.latitude))
                let point = new BMap.Point(res.datas.longitude,res.datas.latitude)
                this.mapObj.setViewport([point])
                marker.addEventListener("click",(e) => {
                  this.loadMapDialog(res.datas)
                })
                this.loadMapDialog(res.datas)
              }else{
                this.$alert(res.msg, '提示', {
                  confirmButtonText: '确定'
                })
              }
            })
            // send发送消息，发送前端消息
            this.stompClient.send("/web/vehicle_info", {}, JSON.stringify({
              'vehicle_number': row.vehicle_number,
              'user_id': 100
            }))
          })
        }
      }
    },
    // 组合地图窗口html
    loadMapDialog(row){
      // formatLngLat异步格式化经纬度
      formatLngLat(row.longitude, row.latitude).then(res => {
        row.address = res
        // 默认点击单元格弹窗
        this.openMapDialog(getInfoWindow(row), row)
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
      let point = new BMap.Point(row.longitude, row.latitude)
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