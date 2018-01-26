<style scoped lang="less">
  @import "./track.less";
</style>

<template>
	<section class="track">
    <el-container>
      <el-main>
        <div class="track-manager-panel">
          <div class="title" v-html="currentEntityName"></div>
          <div class="content">
            <el-row type="flex">
              <el-col :span="12">
                <el-select v-model="trackPeroidValue" placeholder="请选择">
                  <el-option
                    v-for="item in trackPeroidOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12" class="track-btns">
                <div v-show="!isPlay">
                  <el-button type="primary" size="mini" @click="onSearch">搜索</el-button>
                  <el-button type="primary" size="mini" @click="onPlay">播放</el-button>
                </div>
                <div v-show="isPlay">
                <el-button type="primary" size="mini" @click="onPause" v-show="!isContinue">暂停</el-button>
                <el-button type="primary" size="mini" @click="onContinue" v-show="isContinue">继续</el-button>
                <el-button type="primary" size="mini" @click="onStop">停止</el-button>
                </div>
              </el-col>
          </el-row>
          <el-row type="flex">
              <el-col :span="12">
                <el-select v-model="trackSpeed" placeholder="请选择">
                  <el-option
                    v-for="item in trackSpeedOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
              </el-col>
          </el-row>
          </div>
        </div>
        <!-- sync组件双向绑定 -->
        <!-- <bdmap :mapObj.sync="mapObj"></bdmap> -->
        <!-- on emit 组件绑定 -->
        <map-panel :isNeedMapObj="true" @sendMapObj="getMapObj"></map-panel>
      </el-main>
      <el-aside width="320px">
        <el-tabs type="border-card">
          <el-tab-pane label="设备列表">
          <deviceTable :tableData="deviceData" @onCellClick="onTableCellClick"></deviceTable>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script>
import {getDevice, getTrack} from '@/api/drive'
import mapPanel from '@/components/map-panel.vue'
import deviceTable from '@/components/device-table'
import mapTrack from '@/common/js/mapTrack.js'
export default {
  name: 'v-track', // 如命名track，vue报错
  data () {
    return {
      originData: [],
      deviceData: [],
      currentPage: 1,
      trackData: [], // 轨迹数据
      mapObj: null, // 存储子组件传来的map对象
      currentEntityName: '请选择一个终端设备！', // 当前选中的设备名
      trackPeroidOptions: [{
        value: '1',
        label: '当前行驶行程'
      }, {
        value: '2',
        label: '最近1次行程'
      }, {
        value: '3',
        label: '最近3次行程'
      }, {
        value: '4',
        label: '最近5次行程'
      }, {
        value: '5',
        label: '3小时内'
      }],
      trackPeroidValue: '5',
      trackSpeedOptions: [{
        value: 10,
        label: '非常快(10ms)'
      }, {
        value: 50,
        label: '很快(50ms)'
      }, {
        value: 100,
        label: '比较快(100ms)'
      }, {
        value: 200,
        label: '一般(200ms)'
      }, {
        value: 500,
        label: '慢速(500ms)'
      }],
      travelIsPlay: true, // 轨迹小车是否播放中
      travelIsPause: false, // 轨迹小车是否暂停
      isPlay: false, // 控制按钮状态
      isContinue: false, // 控制按钮状态
      trackSpeed: 500,  // 轨迹速度
      carMarker: null, // 小车覆盖物
      carIcon: null, // 小车图标
      trackPlayTimer: null, // 小车定时器
      movingPointIndex: 0, // 小车移动的步数
      pointDirection: 0, // 方向点
      trackMarkers: [] // 轨迹点覆盖物数组
    }
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
          // 根据时间计算状态
          item.status = item.latest_location.loc_time + 5*60 > new Date().getTime()/1000 ? 3 : 4
          this.deviceData.push(item)
        }
      })
    },
    _getTrack(name){
      let params = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644',
        entity_name: name,
        start_time: 1515380000,
        end_time: 1515380800
      }
      getTrack(params).then(res => {
        // 构建轨迹点
        this.trackData = res.data.points
      }).then(()=>{
        // 根据轨迹点经纬度画出小车运行轨迹
        this.trackMarkers = mapTrack.drawMapLine(this.mapObj, this.trackData)
      })
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
    },
    // 表格单元格点击事件
    onTableCellClick(row, column, cell, event){
      if(column.property == 'entity_name'){
        this.isPlay = false
        this.isContinue = false
        this.currentEntityName = row.entity_name
        this._getTrack(row.entity_name)
      }
    },
    // 搜索轨迹
    onSearch(){
      if(this.currentEntityName){
        // 暂未实现
      }else{
        this.$notify.error({
          title: '错误',
          message: '请选择设备'
        })
      }
    },
    // 轨迹播放  
    _playTravel(){ 
      let trackCount = this.trackData.length // trackCount 轨迹点数量
      if (trackCount > 1) { 
        if (this.trackPlayTimer != null){ // trackPlayTimer定时器
          clearInterval(this.trackPlayTimer)
        }

        let point = this._getCarIcon(0)

        //this.mapObj.centerAndZoom(point, 15)
        this.movingPointIndex = 0
        if (this.carMarker != null){
          this.carMarker.setPosition(point)
          //隐藏轨迹点
          for (var i = 1; i < trackCount - 1; i++){
            if (this.trackData[i].StayTime <300 || this.trackData[i].LocateType == 2)
              this.trackMarkers[i].hide()
          }
        }else{
          this.carMarker = new BMap.Marker(point, { icon: this.carIcon })
          this.carMarker.addEventListener("click", function(){
            let opts = {
              width : 200,     // 信息窗口宽度
              height: 100,     // 信息窗口高度
              title : "test" , // 信息窗口标题
              enableMessage:true //设置允许信息窗发送短息
            }
            let infoWindow = new BMap.InfoWindow('title', opts)  // 创建信息窗口对象
            // var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
            this.openInfoWindow(infoWindow)
          })
          this.mapObj.addOverlay(this.carMarker)
        }

        let that = this
        // console.table(this.trackMarkers)
        function resetMkPoint(pIndex){
          if (that.travelIsPlay){
            point = that._getCarIcon(pIndex)
            that.carMarker.setZIndex(100)
            that.carMarker.setIcon(that.carIcon)
            that.carMarker.setPosition(that.trackMarkers[pIndex].getPosition())
            //that.carMarker.show()
            //当前点是否居中
            // if (document.getElementById("chkTerCenter").checked){
                // that.mapObj.setCenter(point)
            // }else{ // 判断是否超出地图范围，超出则设定当前点为中心点
                var bs = that.mapObj.getBounds()   //获取可视区域
                var bssw = bs.getSouthWest()   //可视区域左下角，西南
                var bsne = bs.getNorthEast()   //可视区域右上角，东北

                if (point.lng <= bssw.lng || point.lat <= bssw.lat || point.lng >= bsne.lng || point.lat >= bsne.lat)
                  that.mapObj.setCenter(point)
            // }
            //是否显示轨迹点
            // if (document.getElementById("chkShowPoint").checked){ //&& pIndex > 1 && pIndex < trackCount - 1
                that.trackMarkers[pIndex - 1].show()
            // }

            that.movingPointIndex++
          }else if (that.travelIsPause == false){//非暂停则重置
            that.movingPointIndex = 0
          }

          if (that.movingPointIndex < trackCount){
            that.trackPlayTimer = setTimeout(() => { resetMkPoint(that.movingPointIndex); }, that.trackSpeed)
          }else{
            mapTrack.stopOrEndPlay(that.mapObj, 1, that.trackPlayTimer, that.carMarker, that.carIcon, that.pointDirection)
            that.isPlay = false
            that.isContinue = false
          }
        }

        this.trackPlayTimer = setTimeout(() => { resetMkPoint(1) }, this.trackSpeed)
      }else{
        clearInterval(this.trackPlayTimer)
      }
    },
    // 根据方向获取小车图标
    _getCarIcon(index){
      let point = this.trackMarkers[index].getPosition() //起点
      this.pointDirection = mapTrack.getDirection(this.trackData[index].direction) //方向指针号0~11
      this.carIcon = new BMap.Icon(require(`@/common/images/car/car_p_${this.pointDirection}.png`), new BMap.Size(36, 36), {//小车图片
          //offset: new BMap.Size(0, -5),    // 相当于CSS精灵
          imageOffset: new BMap.Size(0, 0)   // 图片的偏移量。为了是图片底部中心对准坐标点。
      })
      return point
    },
    // 播放轨迹
    onPlay() {
      if(this.currentEntityName != '请选择一个终端设备！'){
        this.isPlay = true
        if (this.trackData.length >= 2){
          this.travelIsPlay = true
          this.travelIsPause = false
          this._playTravel()
        }else{
          this.trackData.length = 0
          // mapClearOverlays(-1)
          this.mapObj.clearOverlays()
          // TrackQuery()
          this._getTrack()
        }
      }else{
        this.$notify.error({
          title: '错误',
          message: '请选择播放的设备'
        });
      }
    },
    // 停止播放轨迹
    onStop() {
      this.isPlay = false
      this.isContinue = false
      this.travelIsPlay = false
      this.travelIsPause = false
      clearInterval(this.trackPlayTimer) // 清除定时器
      // mapTrack.stopOrEndPlay(this.mapObj, 0, this.carMarker, this.carIcon, this.pointDirection)
      mapTrack.stopOrEndPlay(this, 0)
    },
    // 暂停播放轨迹
    onPause() {
      this.isContinue = true
      this.travelIsPlay = false
      this.travelIsPause = true
    },
    // 暂停后继续播放
    onContinue(){
      this.isContinue = false
      this.travelIsPlay = true
      this.travelIsPause = false
    }
  },
  components:{
    mapPanel,
    deviceTable
  }
}
</script>
