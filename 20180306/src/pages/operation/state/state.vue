<style scoped lang="less">
  @import "./state.less";
</style>

<template>
  <section class="state">
    <el-container>
      <el-main v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 0.4)">
        <p class="car-text">{{carText}}</p>
        <ul>
          <li><span>电瓶电压：</span><el-input v-model="voltage" placeholder="电瓶电压" readonly></el-input></li>
          <li><span>发动机转速：</span><el-input v-model="speed" placeholder="发动机转速" readonly></el-input></li>
          <li><span>水温：</span><el-input v-model="temp" placeholder="水温" readonly></el-input></li>
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
  name: 'state',
  data () {
    return {
    	carText: '请在表格选择需要监测的车牌号',
      carNumber: '',
      voltage: '',
      speed: '',
      temp: '',
      stompClient: null,
      loading: false,
      loadingText: '正在获取最新数据，请稍后...'
    }
  },
  mounted() {
    setTimeout(()=>{
    },20)
  },
  methods:{
    onSendMsg(){
      if(!this.stompClient || !this.stompClient.connected){
        // 建立socket连接并且订阅消息
        let socket = new SockJS(`${process.env.BASE_API}/my-websocket`)
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({}, (frame) => {
          // console.log(frame)
          // subscribe订阅消息，接收后台消息
          this.stompClient.subscribe('/topic/web/100/vehicle_manager_info', (msg) => {
            // console.log(msg)
            this.stompClient.disconnect() // 关闭socket连接
            let res = JSON.parse(msg.body)
            if(res.ret == 0){
              this.voltage = res.datas.battery_voltage
              this.speed = res.datas.engine_speed
              this.temp = res.datas.water_tem
              this.loading = false
            }else{
              this.$confirm('获取最新车况失败，再试一次?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.onSendMsg()
              })
              this.loading = false
            }
          })
          // send发送消息，发送前端消息
          this.stompClient.send("/web/vehicle_state", {}, JSON.stringify({
            'vehicle_number' : this.carNumber,
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
        this.carText = `当前车牌号：${row.vehicle_number}`
        this.onSendMsg()
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

