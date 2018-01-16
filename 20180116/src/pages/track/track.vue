<style scoped lang="less">
  @import "./track.less";
</style>

<template>
	<section class="track">
    <top-header></top-header>
    <el-container>
      <el-main>
        <div class="track-manager-panel">
          <div class="title">标题</div>
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
      <el-aside width="300px">
        <el-tabs type="border-card">
          <el-tab-pane label="设备列表">
          <deviceTable :tableData="tableData" :showSelection="false" @onCellClick="onTableCellClick"></deviceTable>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script>
import {getDevice} from '@/api/monitor'
import {getTrack} from '@/api/track'
import mapPanel from '@/components/map-panel.vue'
import deviceTable from '@/components/device-table'
import mapTrack from '@/common/js/mapTrack.js'
export default {
  name: 'car-track',
  data () {
    return {
      originData: [],
      tableData: [],
      currentPage: 1,
      trackData: [], // 轨迹数据
      travelIsPlay: true, // 轨迹小车是否播放中
      travelIsPause: false, // 轨迹小车是否暂停
      isPlay: false, // 控制按钮状态
      isContinue: false, // 控制按钮状态
      trackSpeed: 500,  // 轨迹速度
      mapObj: null, // 存储子组件传来的map对象
      currentEntityName: null, // 当前选中的设备名
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
    }
  },
  mounted() {
    setTimeout(() => {
      this.currentEntityName = null
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
      }).then(()=>{
        // 根据轨迹点经纬度画出小车运行轨迹
        mapTrack.drawMapLine(this.mapObj, this.trackData)
      })
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
    },
    // 表格单元格点击事件
    onTableCellClick(row, column, cell, event){
      if(column.property == 'entity_name'){
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
        });
      }
    },
    // 播放轨迹
    onPlay() {
      if(this.currentEntityName){
        this.isPlay = true
        if (this.trackData.length >= 2){
          this.travelIsPlay = true
          this.travelIsPause = false
          mapTrack.playTravel(this.mapObj, this.trackData, this.trackSpeed, this.travelIsPlay, this.travelIsPause)
          // 播放完毕按钮重置 未实现
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
      mapTrack.stopOrEndPlay(this.mapObj, 0, this.travelIsPlay, this.travelIsPause)
    },
    // 暂停播放轨迹
    onPause() {
      this.isContinue = true
      this.travelIsPlay = false
      this.travelIsPause = true
      mapTrack.pausePlay(this.travelIsPlay, this.travelIsPause)
    },
    // 暂停后继续播放
    onContinue(){
      this.isContinue = false
      this.travelIsPlay = true
      this.travelIsPause = false
      mapTrack.pausePlay(this.travelIsPlay, this.travelIsPause)
    }
  },
  components:{
    mapPanel,
    deviceTable
  }
}
</script>
