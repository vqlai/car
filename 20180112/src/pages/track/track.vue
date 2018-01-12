<style scoped lang="less">
  @import "./track.less";
</style>

<template>
	<section class="track">
    <top-header></top-header>
    <el-container>
      <el-main>
        <div class="track-item-panel">
          <el-button type="primary" @click="handlePlay">播放</el-button>
          <el-button type="primary" @click="handleStop">停止</el-button>
          <el-button type="primary" @click="handlePause">暂停</el-button>
          <el-button type="primary" @click="handleContinue">继续</el-button>
        </div>
        <!-- sync组件双向绑定 -->
        <!-- <bdmap :mapObj.sync="mapObj"></bdmap> -->
        <!-- on emit 组件绑定 -->
        <map-panel :isNeedMapObj="true" @sendMapObj="getMapObj"></map-panel>
      </el-main>
      <el-aside width="300px">
        <el-tabs type="border-card">
          <el-tab-pane label="设备列表">
            <el-table
              :data="tableData"
              height="800"
              border
              highlight-current-row
              empty-text="暂无数据"
              @cell-click="handleCellClick"
              style="width: 100%">
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
import {getDevice} from '@/api/monitor'
import {getTrack} from '@/api/track'
import track from '@/common/js/track.js'
import mapPanel from '@/components/map-panel.vue'
// import {drawMapLine} from '@/common/js/bdmap.js'
import mapTrack from '@/common/js/mapTrack.js'
export default {
  name: 'car-track',
  data () {
    return {
      originData: [],
      tableData: [],
      currentPage: 1,
      trackData: [],
      trackCount: 0,
      // trackMarkers: [],
      travelIsPlay: false,
      travelIsPause: false,
      // movingPointIndex: 0,
      // trackPlayTimer: null, // 小车运行定时器
      // carIcon: null,
      // carMarker: null,
      // pointDirection: null,
      // trackSpeed: 500,
      mapObj: null // 存储子组件传来的map对象
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
          item.status = item.latest_location.loc_time + 5*60 > new Date().getTime()/1000 ? 3 : 4
          this.tableData.push(item)
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
        this.trackCount = this.trackData.length
        // console.log(this.trackData)
      }).then(()=>{
        // 根据轨迹点经纬度画出小车运行轨迹
        // this.trackMarkers = drawMapLine(this.trackData, this.trackCount)
        // this.trackMarkers = 
        mapTrack.drawMapLine(this.mapObj, this.trackData, this.trackCount)
        // console.log(this.trackMarkers)
      })
    },
    getMapObj(map){
      this.mapObj = map
    },
    getCarStatusIcon(status) {
      return `car-status-icon car-status-icon${status}`
    },
    getCarStatus(status){
      let text = status == 3 ? '在线' : '离线'
      return text
    },
    handleCellClick(row, column, cell, event){
      if(column.property == 'entity_name'){
        // console.log(row)
        this._getTrack(row.entity_name)
      }
    },
    _playTravel(){   
      console.log(this.trackMarkers)
      for(let [index,item] of this.trackMarkers.entries()){
        if(index == 0 || index == this.trackMarkers.length-1){
          item.show();
        }else{
          item.hide();
        }
      }
      if (this.trackCount > 1){ // trackCount 轨迹点数量
        if (this.trackPlayTimer != null){ // 定时器
          clearInterval(this.trackPlayTimer);
        }
        var TrackData = this.trackData;
        var mPoint = this.trackMarkers[0].getPosition(); //起点
        this.pointDirection = track.getDirection(TrackData[0].direction);//方向指针号0~11
        this.carIcon = new BMap.Icon(require(`../../common/images/car/car_p_${this.pointDirection}.png`), new BMap.Size(36, 36), {//小车图片
            //offset: new BMap.Size(0, -5),    //相当于CSS精灵
            imageOffset: new BMap.Size(0, 0)   //图片的偏移量。为了是图片底部中心对准坐标点。
        });
        this.carIcon.iconAnchor = new BMap.Point(5, 5);
        this.carIcon.shadow = "";

        //map.centerAndZoom(mPoint, 15);
        this.movingPointIndex = 0;
        if (this.carMarker != null){
          this.carMarker.setPosition(mPoint);
          //隐藏轨迹点
          for (var i = 1; i < this.trackCount - 1; i++){
            if (TrackData[i].StayTime <300 || TrackData[i].LocateType == 2)
              this.trackMarkers[i].hide();
          }
        }else{
            this.carMarker = new BMap.Marker(mPoint, { icon: this.carIcon });
            this.carMarker.addEventListener("click", function(){
              let opts = {
                width : 200,     // 信息窗口宽度
                height: 100,     // 信息窗口高度
                title : "test" , // 信息窗口标题
                enableMessage:true //设置允许信息窗发送短息
              }
              let infoWindow = new BMap.InfoWindow('title', opts);  // 创建信息窗口对象
              // var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
              this.openInfoWindow(infoWindow);
            });
            this.mapObj.addOverlay(this.carMarker);
        }

        // var container = $('div [id="divTrackLog"]');//滚动容器
        // var scrollTo;
        let that = this
        function resetMkPoint(pIndex){
          if (that.travelIsPlay){
            mPoint = that.trackMarkers[pIndex].getPosition();
            that.pointDirection = track.getDirection(TrackData[pIndex].direction);//方向指针号0~11
            console.log(that.pointDirection)
            that.carIcon = new BMap.Icon(require(`../../common/images/car/car_p_${that.pointDirection}.png`), new BMap.Size(36, 36));
            that.carMarker.setZIndex(100);
            that.carMarker.setIcon(that.carIcon);
            that.carMarker.setPosition(that.trackMarkers[pIndex].getPosition());
            //carMarker.show();
            //当前点是否居中
            // if (document.getElementById("chkTerCenter").checked){
                // that.mapObj.setCenter(mPoint);
            // }else{//判断是否超出地图范围，超出则设定当前点为中心点
                var bs = that.mapObj.getBounds();   //获取可视区域
                var bssw = bs.getSouthWest();   //可视区域左下角，西南
                var bsne = bs.getNorthEast();   //可视区域右上角，东北

                if (mPoint.lng <= bssw.lng || mPoint.lat <= bssw.lat || mPoint.lng >= bsne.lng || mPoint.lat >= bsne.lat)
                    that.mapObj.setCenter(mPoint);
            // }
            //是否显示轨迹点
            // if (document.getElementById("chkShowPoint").checked){ //&& pIndex > 1 && pIndex < trackCount - 1
                that.trackMarkers[pIndex - 1].show();
            // }

            //轨迹清单行滚动定位
            // if (document.getElementById("chkRoll").checked){
            //     if (scrollTo != null)
            //     {
            //         scrollTo.removeClass("PlayintRowBg");
            //     }

            //     scrollTo = $('#row_' + TrackData[pIndex].TracklogID.toString());
            //     scrollTo.addClass("PlayintRowBg");
            //     container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
            // }

            that.movingPointIndex++;
          }else if (that.travelIsPause == false){//非暂停则重置
            that.movingPointIndex = 0;
          }

          if (that.movingPointIndex < that.trackCount){
            that.trackPlayTimer = setTimeout(
              function () { resetMkPoint(that.movingPointIndex); }, that.trackSpeed
              // $('#selPlaySpeed').val()
            );
            // console.log(1)
          }else{
            that._stopOrEndPlay(1)
            console.log(2)
            //scrollTo.removeClass("PlayintRowBg"); 
            // var alertStr=$("#hdPlayfinished").val() + $("#hdTotalMileage").val() + ":";
            // if (this.trackCount < 1000){
            //     var licheng =parseFloat($("#hdSearchAllMileage").val());

            //     if (licheng <= 0){
            //         alert(alertStr + (Math.round(allmileage * 100) / 100) + "km");
            //     }else{
            //         alert(alertStr + (Math.round(licheng * 100) / 100) + "km");
            //     }
            // }else{
            //     alert(alertStr + (Math.round(allmileage * 100) / 100) + "km(1000" + $("#hdShowTrackPoint").val() + ")");
            // }
          }
        }

        that.trackPlayTimer = setTimeout(
          function () { resetMkPoint(1); }, that.trackSpeed
          // $('#selPlaySpeed').val()
        );
      }else{
          clearInterval(that.trackPlayTimer);
      }
    },
    _stopOrEndPlay(tag){
      clearInterval(this.trackPlayTimer);
      // this.travelIsPlay = false;
      // this.travelIsPause = false;
      // $("#btnTrackPlay").removeClass("hidden");
      // $("#btnTrackStop").addClass("hidden");
      // $("#btnTrackQuery").removeClass("hidden");
      // $("#btnTrackPause").addClass("hidden");
      // $("#btnTrackContinue").addClass("hidden");
      if (tag == 0 && this.carMarker != null){//主动停止时汽车回到到原点
        this.carIcon = new BMap.Icon(require(`../../common/images/car/car_p_${this.pointDirection}.png`), new BMap.Size(36, 36));
        this.carMarker.setIcon(this.carIcon);
        this.carMarker.setPosition(this.trackMarkers[0].getPosition());
        this.mapObj.setCenter(this.trackMarkers[0].getPosition());
      }
    },
    // 播放轨迹
    handlePlay() {
      if (this.trackCount >= 2){
        this.travelIsPlay = true;
        this.travelIsPause = false;
        // this._playTravel();
        mapTrack.playTravel(this.mapObj, this.trackData, 500, this.travelIsPlay, this.travelIsPause)
      }else{
        this.trackCount = 0;
        // mapClearOverlays(-1);
        this.mapObj.clearOverlays();
        // TrackQuery(); 
        this._getTrack();
      }
    },
    // 停止播放轨迹
    handleStop() {
      this.travelIsPlay = false;
      this.travelIsPause = false;
      mapTrack.stopOrEndPlay(this.mapObj, 0, this.travelIsPlay, this.travelIsPause)
      // this.stopOrEndPlay();
    },
    // 暂停播放轨迹
    handlePause() {
      this.travelIsPause = true;
      this.travelIsPlay = false;
      mapTrack.pausePlay(this.travelIsPlay, this.travelIsPause)
    },
    // 暂停后继续播放
    handleContinue(){
      this.travelIsPause = false;
      this.travelIsPlay = true;
      mapTrack.pausePlay(this.travelIsPlay, this.travelIsPause)
    }
  },
  components:{
    mapPanel
  }
}
</script>
