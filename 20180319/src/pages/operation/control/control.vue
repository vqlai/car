<style scoped lang="less">
  @import "./control.less";
</style>
<template>
	<section class="control">
    <el-container>
      <el-main v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 0.4)">
        <!-- <ul>
          <li v-for="item in btns"><el-button type="primary" @click="onSendMsg(item.type)">{{item.label}}</el-button></li>
        </ul> -->
        <div class="car">
          <div class="door clearfix">
            <div :class="['left',{on: isDoorOn}]"></div>
            <div :class="['right',{on: isDoorOn}]"></div>
          </div>
          <div class="win">
            <div :class="['left',{on: isWinOn}]"></div>
            <div :class="['right',{on: isWinOn}]"></div>
          </div>
          <div :class="['center',{on:isVoiceOn}]"></div>
        </div>  
        <ul>
          <li v-for="item in btns" :class="{on: item.isOn}" @click="onBtnClick(item)">{{!item.isOn?item.labelOn:item.labelOff}}</li>
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
export default {
  name: 'control',
  data () {
    return {
      carNumber: '',
      // btns: [
      //   {label: '开锁',type: 1},
      //   {label: '关锁',type: 2},
      //   {label: '降窗',type: 3},
      //   {label: '升窗',type: 4},
      //   // {label: '开灯',type: 5},
      //   // {label: '关灯',type: 6},
      //   {label: '寻车',type: 7}
      // ],
      btns: [
        {labelOn: '开锁',valueOn: 1,labelOff:'关锁',valueOff: 2,type: 1,isOn:false},
        {labelOn: '降窗',valueOn: 3,labelOff:'升窗',valueOff: 4,type: 2,isOn:false},
        {labelOn: '寻车',valueOn: 7,type: 3,isOn:false}
      ],
      isDoorOn: false,
      isWinOn: false,
      isVoiceOn: false,
      loadingText: '',
      stompClient: null,
      currentType: null,
      loading: false
    }
  },
  mounted() {
    setTimeout(() => {
    },20)
  },
  methods:{
    onBtnClick(item){
      if(item.type ===3){
        this.isVoiceOn = this.isVoiceOn ? false:true
      }else{
        item.isOn = item.isOn ? false:true
        if(item.type===1) this.isDoorOn = item.isOn
        if(item.type===2) this.isWinOn = item.isOn
      }

    },
    // type为控制类型
    onSendMsg(type){
      if(!this.carNumber){
        this.$message({
          message: '请选择设备...',
          type: 'error'
        })
        return 
      }
      this.currentType = type
      this.loadingText = `${this.btns[type-1].label}中...`
      if(!this.stompClient || !this.stompClient.connected){
        // 建立socket连接并且订阅消息
        let socket = new SockJS(`${process.env.BASE_API}/my-websocket`)
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({}, (frame) => {
          // console.log(frame)
          // subscribe订阅消息，接收后台消息
          this.stompClient.subscribe('/topic/web/100/remote_ctl_notify', (msg) => {
            // console.log(msg)
            let res = JSON.parse(msg.body)
            this.stompClient.disconnect() // 关闭socket连接
            if(res.ret == 0){
              this.$alert(`${this.btns[this.currentType-1].label}成功`, '提示', {
                confirmButtonText: '确定'
              })
              this.loading = false
            }else{
              this.$alert(res.msg, '提示', {
                confirmButtonText: '确定'
              })
              this.loading = false
            }
          })
          // send发送消息，发送前端消息
          this.stompClient.send("/web/remote_control", {}, JSON.stringify({
            'vehicle_number' : this.carNumber,
            'cmd_type': type,
            'user_id': 100
          }))
        })
      }
      this.loading = true
    },
    // 表格车牌号单元格点击事件
    onCarTableCellClick(row, column, cell, event){
      console.log(row)
      if(row.is_online){
        this.carNumber = row.vehicle_number
      }else{
        this.$message({
          message: '请选择在线的设备进行远程控制',
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

