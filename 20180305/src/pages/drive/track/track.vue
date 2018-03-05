<style scoped lang="less">
  @import "./track.less";
</style>

<template>
	<section class="track">
    <el-container>
      <el-main>
        <div class="track-manager-panel">
          <div class="title" v-text="currentCar.title"></div>
          <div class="content">
            <el-row type="flex">
              <el-col :span="12">
                <el-select v-model="trackPeroidValue" placeholder="请选择" @change="onSelectChange">
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
                  <el-button type="primary" @click="onSearch">搜索</el-button>
                  <el-button type="primary" @click="onPlay">播放</el-button>
                </div>
                <div v-show="isPlay">
                <el-button type="primary" @click="onPause" v-show="!isContinue">暂停</el-button>
                <el-button type="primary" @click="onContinue" v-show="isContinue">继续</el-button>
                <el-button type="primary" @click="onStop">停止</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row type="flex" v-if="showPicker">
              <el-col :span="20">
                <el-date-picker
                  style="width:350px;"
                  v-model="pickerValue"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="timestamp"
                  align="center">
                </el-date-picker>
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
                <!-- <el-switch
                  style="margin: 6px 0 0 15px"
                  v-model="switchValue"
                  active-text="轨迹点"
                  inactive-text="居中">
                </el-switch> -->
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
import {getTrack} from '@/api/drive'
import mapPanel from '@/components/map-panel.vue'
import carTable from '@/components/car-table'
import mapTrack from '@/common/js/map-track.js'
import {addCarMapOverlay} from '@/common/js/bdmap.js'
export default {
  name: 'v-track', // 如命名track，vue报错
  data () {
    return {
      currentPage: 1,
      trackData: [], // 轨迹数据
      mapObj: null, // 存储子组件传来的map对象
      currentCar: {carNumber:'',title:'请选择一个终端设备！'}, // 当前选中的设备名
      trackPeroidOptions: [
        // {value: '1',label: '当前行驶行程'},
        // {value: '2',label: '最近1次行程'}, 
        // {value: '3',label: '最近3次行程'}, 
        // {value: '4',label: '最近5次行程'}, 
        {value: '1',label: '1小时内'},
        {value: '2',label: '3小时内'}, 
        {value: '3',label: '24小时内'}, 
        {value: '4',label: '3天内'}, 
        {value: '5',label: '5天内'}, 
        {value: '6',label: '自定义时段'}
      ],
      trackPeroidValue: '1',
      trackSpeedOptions: [
        {value: 10,label: '非常快(10ms)'}, 
        {value: 50,label: '很快(50ms)'}, 
        {value: 100,label: '比较快(100ms)'}, 
        {value: 200,label: '一般(200ms)'}, 
        {value: 500,label: '慢速(500ms)'}
      ],
      travelIsPlay: true, // 轨迹小车是否播放中
      travelIsPause: false, // 轨迹小车是否暂停
      isPlay: false, // 控制按钮状态
      isContinue: false, // 控制按钮状态
      trackSpeed: 500,  // 轨迹速度
      showPicker: false,
      pickerValue: '', // 时间选择器
      pickerOptions: null,
      switchValue: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.pickerOptions = mapTrack.getpickerOptions()
    },20)
  },
  methods:{
    _getTrack(){
      let params = {
        vehicle_number: this.currentCar.carNumber,
        type: parseInt(this.trackPeroidValue)
        // type: 3
      }
      // console.log(this.pickerValue)
      if(params.type == 6){
        if(!this.pickerValue){
          this.$notify.info({
            title: '提示',
            message: '请选择播放时间段',
            type: 'warning'
          })
          return false
        }
        params.start_time = this.pickerValue[0]/1000
        params.end_time = this.pickerValue[1]/1000
      }
      console.log(params)
      getTrack(params).then(res => {
        // 构建轨迹点
        if(res.data.ret == 0){
          this.trackData = res.data.datas.points
          console.log(res.data.datas)
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      }).then(()=>{
        // 根据轨迹点经纬度画出小车运行轨迹
        if(this.trackData.length){
          // this.mapObj.clearOverlays()
          mapTrack.drawMapLine(this.mapObj, this.trackData)
        }else{
          this.$message({
            message: '当前时段无车辆轨迹信息',
            type: 'error'
          })
        }
      })
    },
    // 表格单元格点击事件
    onCarTableCellClick(row, column, cell, event){
      console.log(row)
      if(column.property == 'vehicle_number'){
        this.isPlay = false
        this.isContinue = false
        this.currentCar.carNumber = row.vehicle_number
        this.currentCar.title = row.vehicle_number
        this.mapObj.clearOverlays()
        let marker = addCarMapOverlay(row.longitude,row.latitude)
      }
    },
    // 搜索轨迹
    onSearch(){
      console.log(this.currentCar)
      this.mapObj.clearOverlays()
      if(this.currentCar.carNumber){
        this._getTrack()
      }else{
        this.showTip('请选择车牌号')
      }
    },
    // 下拉框值变化
    onSelectChange(value){
      this.showPicker = (value == 6) ? true : false
    },
    // 播放轨迹
    onPlay() {
      if(this.currentCar.carNumber){
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
        this.showTip('请选择车牌号')
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
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
    },
    showTip(msg){
      this.$notify({
        title: '提示',
        message: msg,
        type: 'warning'
      })
    }
  },
  components:{
    mapPanel,
    carTable
  }
}
</script>
