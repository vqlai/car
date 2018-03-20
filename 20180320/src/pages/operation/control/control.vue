<style scoped lang="less">
  @import "./control.less";
</style>
<template>
	<section class="control">
    <el-container>
      <el-main v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 0.7)">
        <!-- <ul>
          <li v-for="item in btns"><el-button type="primary" @click="onSendMsg(item.type)">{{item.label}}</el-button></li>
        </ul> -->
        <div class="car">
          <div :class="['door clearfix',{on: btns[0].isOn}]">
            <div class="left"></div>
            <div class="right"></div>
          </div>
          <div :class="['win',,{on: btns[1].isOn}]">
            <div class="left"></div>
            <div class="right"></div>
          </div>
          <div :class="['center',{on: btns[2].isOn}]"></div>
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
import {getCarStatus} from '@/api/operation'
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
        {labelOn: '开锁',labelOff:'关锁',type: 1,isOn:false},
        {labelOn: '降窗',labelOff:'升窗',type: 2,isOn:false},
        {labelOn: '寻车',labelOff: '寻车',type: 3,isOn:false}
      ],
      loadingText: '',
      stompClient: null,
      // currentType: null,
      loading: false
    }
  },
  mounted() {
    setTimeout(() => {
    },20)
  },
  methods:{
    onBtnClick(item){
      if(!this.carNumber){
        this.$message({
          message: '请选择在线设备进行远程控制',
          type: 'error'
        })
        return 
      }
      // item.isOn = item.isOn ? false:true
      let type = 0
      if(item.type===1){
        type = item.isOn ? 2:1
      }
      if(item.type===2){
        type = item.isOn ? 4:3
      }
      if(item.type===3){
        type =7
        item.isOn = !item.isOn
      }
      this.onSendMsg(type,item)
    },
    // type为控制类型
    onSendMsg(type,currentBtn){
      let types = ['开锁','关锁','降窗','升窗','寻车']
      this.loadingText = `${types[type-1]}中...`
      if(!this.stompClient || !this.stompClient.connected){
        // 建立socket连接并且订阅消息
        let socket = new SockJS(`${process.env.BASE_API}/my-websocket`)
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({}, (frame) => {
          // console.log(frame)
          // subscribe订阅消息，接收后台消息
          this.stompClient.subscribe('/topic/web/100/remote_ctl_notify', (msg) => {
            let res = JSON.parse(msg.body)
            this.stompClient.disconnect() // 关闭socket连接
            if(res.ret == 0){
              currentBtn.isOn = !currentBtn.isOn
              this.$alert(`${types[type-1]}成功`, '提示', {
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
      this.carNumber = ''
      if(row.is_online){
        this.carNumber = row.vehicle_number
        getCarStatus({vehicle_number: this.carNumber}).then(res=>{
          let {ret,msg,datas} = res.data
          if(ret == 0){
            this.btns[0].isOn = datas.door_state? true:false
            this.btns[1].isOn = datas.windows_state? true:false
            this.btns[2].isOn = false
          }
        })
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

