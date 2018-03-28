<style scoped lang="less">
  @import "./control.less";
</style>
<template>
	<section class="control">
    <el-container>
      <el-main v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 0.7)">
        <div class="car-box">
          <div class="car">
            <div :class="['door clearfix',{on: carData.doorState}]"  v-if="showDoorState">
              <div class="left"></div>
              <div class="right"></div>
            </div>
            <!-- <div :class="['win',{on: carData.winState}]">
              <div class="left"></div>
              <div class="right"></div>
            </div> -->
            <div :class="['center','on']"  v-if="showVoiceState"></div>
          </div>  
        </div>
        <ul>
          <li v-for="item in btns" @click="onBtnClick(item)">{{item.label}}</li>
        </ul>
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
import carTable from '@/components/car-table'
import {getCarStatus} from '@/api/operation'
export default {
  name: 'control',
  data () {
    return {
      carData: {
        carNumber: null,
        doorState: false, //false 门关着，true门打开
        winState: false, //false 窗关着，true窗打开
        voiceState: false
      },
      btns: [
        {label: '解锁',type: 1},
        {label: '落锁',type: 2},
        {label: '降窗',type: 3},
        {label: '升窗',type: 4},
        // {label: '开灯',type: 5},
        // {label: '关灯',type: 6},
        {label: '寻车',type: 7}
      ],
      loadingText: '',
      stompClient: null,
      // currentType: null,
      loading: false,
      showDoorState: false,
      showVoiceState: false
    }
  },
  mounted() {
    setTimeout(() => {
    },20)
  },
  methods:{
    onBtnClick(item){
      if(!this.carData.carNumber){
        this.$message({
          message: '请选择在线车辆进行远程控制',
          type: 'error'
        })
        return false
      }
      if(this.carData.doorState){
        if(item.type===2){
          this.$alert('请关好车门！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      this.onSendMsg(item)
    },
    // type为控制类型
    onSendMsg(item){
      let userid = window.sessionStorage.getItem('userid')
      this.loadingText = `${item.label}中...`
      this.loading = true
      if(item.type>4){
        this.showVoiceState = true
      }
      if(!this.stompClient || !this.stompClient.connected){
        // 建立socket连接并且订阅消息
        let socket = new SockJS(`${process.env.BASE_API}/my-websocket`)
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({}, (frame) => {
          // subscribe订阅消息，接收后台消息
          this.stompClient.subscribe(`/topic/web/${userid}/remote_ctl_notify`, (msg) => {
            let res = JSON.parse(msg.body)
            this.stompClient.disconnect() // 关闭socket连接
            if(res.ret == 0){
              // if(item.type==1||item.type==2){
              //   this.carData.doorState = !this.carData.doorState
              // }else if(item.type==3||item.type==4){
              //   this.carData.winState = !this.carData.winState
              // }else{
              //   this.carData.voiceState = false
              // }
              this.$alert(`${item.label}成功`, '提示', {
                confirmButtonText: '确定'
              })
              this.loading = false
            }else{
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定'
              })
              this.loading = false
            }
            if(item.type>4){
              this.showVoiceState = false
            }
          })
          // send发送消息，发送前端消息
          this.stompClient.send("/web/remote_control", {}, JSON.stringify({
            'vehicle_number' : this.carData.carNumber,
            'cmd_type': item.type,
            'user_id': userid
          }))
        })
      }
    },
    // 表格车牌号单元格点击事件
    onCarTableCellClick(row, column, cell, event){
      // this.carData = null
      if(row.is_online){
        this.showDoorState = false
        getCarStatus({vehicle_number: row.vehicle_number}).then(res=>{
          let {ret,msg,datas} = res.data
          if(ret == 0){
            console.log(datas)
            this.carData.carNumber = datas.vehicle_number
            this.carData.doorState = datas.door_state==1?true:false
            this.carData.winState = datas.windows_state==1?true:false
            this.carData.voiceState = false
            this.showDoorState = true
            console.log(this.carData)
          }
        })
      }else{
        this.$message({
          message: '请选择在线的车辆进行远程控制',
          type: 'error'
        })
      }
    },
  },
  components:{
    carTable
  }
}
</script>

