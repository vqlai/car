<style scoped lang="less">
  @import "./control.less";
</style>
<template>
	<section class="control">
    <el-container>
      <el-main v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(255, 255, 255, 0.4)">
        <ul>
          <li v-for="item in btns"><el-button type="primary" @click="onSendMsg(item.type)">{{item.label}}</el-button></li>
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
      btns: [
        {label: '开门',type: 1},
        {label: '关门',type: 2},
        {label: '开窗',type: 3},
        {label: '关窗',type: 4},
        {label: '开灯',type: 5},
        {label: '关灯',type: 6},
        {label: '鸣笛',type: 7}
      ],
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
              this.$alert(`${this.btns[this.currentType-1].label}失败`, '提示', {
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
      this.carNumber = row.vehicle_number
    },
  },
  components:{
    carTable
  }
}
</script>

