<style scoped lang="less">
  @import "./control.less";
</style>
<template>
	<section class="control">
    <el-container>
      <el-main>
        <ul>
          <li>
            <el-input v-model="carNumber" placeholder="请输入车牌号..." style="width:200px;"></el-input><el-button type="primary" @click="onSendMsg">搜索</el-button>
          </li>
          <li>
            <!-- <el-button type="primary">开门</el-button>
            <el-button type="primary">关门</el-button> -->
            <el-switch
              v-model="carDoor"
              active-text="开门"
              inactive-text="关门"
              @change="onDoorChange">
            </el-switch>
          </li>
          <li>
            <!-- <el-button type="primary">开窗</el-button>
            <el-button type="primary">关窗</el-button> -->
            <el-switch
              v-model="carWindow"
              active-text="开窗"
              inactive-text="关窗">
            </el-switch>
          </li>
          <li>
            <!-- <el-button type="primary">开灯</el-button>
            <el-button type="primary">关灯</el-button> -->
            <el-switch
              v-model="carLight"
              active-text="开灯"
              inactive-text="关灯">
            </el-switch>
          </li>
          <li>
            <el-button type="primary">鸣笛</el-button>
          </li>
        </ul>
      </el-main>
      <el-aside width="320px">
        <el-tabs type="border-card">
          <el-tab-pane label="设备列表">
            <deviceTable :tableData="tableData" @onCellClick="onTableCellClick"></deviceTable>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
	</section>
</template>

<script>
import {getDevice} from '@/api/drive'
import deviceTable from '@/components/device-table'
export default {
  name: 'control',
  data () {
    return {
      originData: [],
    	tableData: [],
      carNumber: '',
      carDoor: true,
      carWindow: true,
      carLight: true,
      stompClient: null
    }
  },
  mounted() {
    setTimeout(() => {
      this._getDevice()
      let socket = new SockJS('//10.0.0.211:9999/my-websocket')
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect({}, (frame) => {
        console.log(frame)
        // subscribe订阅消息，接收后台消息
        this.stompClient.subscribe('/topic/web/100/remote_ctl_notify', (msg) => {
          console.log(msg)
        })
      })
    },20)
  },
  methods:{
    // 获取设备列表
    _getDevice() {
      let params = {
        ak: 'ZXNpDG0ONOKWw9EGpVUBPmmkvzUWG5Y0',
        service_id: '159532'
      }
      getDevice(params).then(res => {
        this.originData = res.data.entities
        for(let item of this.originData){
          item.status = item.latest_location.loc_time + 5*60 > new Date().getTime()/1000 ? 3 : 4
          this.tableData.push(item)
        }
        // console.log(this.tableData)
      })
    },
    onDoorChange(val){
      console.log(val)
      let model = val ? 1 : 2
      this.stompClient.send("/web/remote_control", {}, JSON.stringify({
        'vihicle_number' : this.carNumber,
        'cmd_type': model
      }))
    },
    onSendMsg(){
      // send发送消息，发送前端消息
      this.stompClient.send("/web/remote_control", {}, JSON.stringify({
        'vihicle_number' : this.carNumber,
        'cmd_type': 1
      }))
    },
    // 表格entity_name单元格点击事件
    onTableCellClick(row, column, cell, event){
      console.log(row)
    },
  },
  components:{
    deviceTable
  }
}
</script>

