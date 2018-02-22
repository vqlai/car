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
          <el-tab-pane label="车辆列表">
          <carTable @onCarTableCellClick="onCarTableCellClick"></carTable>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script>
// getDevice,
import {getTrack} from '@/api/drive'
import mapPanel from '@/components/map-panel.vue'
import carTable from '@/components/car-table'
import mapTrack from '@/common/js/map-track.js'
export default {
  name: 'v-track', // 如命名track，vue报错
  data () {
    return {
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
    }
  },
  mounted() {
    setTimeout(() => {
    },20)
  },
  methods:{
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
        if(res.data.status == 0){
          this.trackData = res.data.points
        }else{
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).then(()=>{
        // 根据轨迹点经纬度画出小车运行轨迹
        if(this.trackData.length){
          mapTrack.drawMapLine(this.mapObj, this.trackData)
        }
      })
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
    },
    // 表格单元格点击事件
    onCarTableCellClick(row, column, cell, event){
      console.log(row)
      if(column.property == 'vehicle_number'){
        this.isPlay = false
        this.isContinue = false
        this.currentEntityName = row.vehicle_number
        // row.vehicle_number
        this._getTrack('vqlai')
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
    // 播放轨迹
    onPlay() {
      if(this.currentEntityName != '请选择一个终端设备！'){
        this.isPlay = true
        if (this.trackData.length >= 2){
          this.travelIsPlay = true
          this.travelIsPause = false
          // this._playTravel()
          mapTrack.playTravel(this)
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
        })
      }
    },
    // 停止播放轨迹
    onStop() {
      this.isPlay = false
      this.isContinue = false
      this.travelIsPlay = false
      this.travelIsPause = false
      // clearInterval(this.trackPlayTimer) // 清除定时器
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
    carTable
  }
}
</script>
