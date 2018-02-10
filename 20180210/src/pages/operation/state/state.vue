<style scoped lang="less">
  @import "./state.less";
</style>

<template>
	<section class="state" v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 0.6)">
		<el-row type="flex" class="top-btns">
      <el-col :span="4" :offset="10">
        <el-input placeholder="请输入车牌号" v-model="searchText" class="input-with-select">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="onSendMsg">确定</el-button>
        </el-input>
      </el-col>
    </el-row>
    <ul>
      <li><span>电瓶电压：</span><el-input v-model="voltage" placeholder="电瓶电压" readonly></el-input></li>
      <li><span>发动机转速：</span><el-input v-model="speed" placeholder="发动机转速" readonly></el-input></li>
      <li><span>水温：</span><el-input v-model="temp" placeholder="水温" readonly></el-input></li>
    </ul>
	</section>
</template>

<script>
export default {
  name: 'state',
  data () {
    return {
    	searchText: '',
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
      if(!this.searchText){
        this.$message({
          message: '请输入车牌号...',
          type: 'error'
        })
        return 
      }
      if(!this.stompClient || !this.stompClient.connected){
        // 建立socket连接并且订阅消息
        let socket = new SockJS('//10.0.0.211:9999/my-websocket')
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
            'vihicle_number' : this.searchText,
            'user_id': 100
          }))
        })
      }
      
      this.loading = true
    }
  },
  components:{
  }
}
</script>

