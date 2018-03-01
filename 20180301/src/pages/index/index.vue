<style scoped lang="less">
  @import "./index.less";
</style>
<template>
  <section class="index">    
	  <el-container>
	    <el-main>
        <el-row :gutter="20">

          <el-col :span="6" v-for="item in dashboardData" :key="item.index">
            <div :class="['info-box','info-box-bg'+item.index]">
              <!-- <div class="info-box-icon info-box-bg1">
                <svg-icon icon-class="home"></svg-icon>
              </div> -->
              <div class="info-box-content">
                <p class="info-box-text">{{item.title}}</p>
                <p class="info-box-number">{{item.value}}<span>辆</span></p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
	  </el-container>
  </section> 
</template>

<script>
import { getDashboard } from'@/api/index'
export default {
  name: 'index',
  data () {
    return {
      dashboardData: [
        {title: '车辆总数', value: 0,index: 1, type: 'total'},
        {title: '运行中车辆', value: 0,index: 2, type: 'running'},
        {title: '停止车辆', value: 0,index: 3, type: 'stoped'},
        {title: '离线车辆', value: 0,index: 4, type: 'offline'},
      ]
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getDashboard()
    })
  },
  methods:{
    _getDashboard(){
      getDashboard().then(res => {
        if(res.data.ret == 0){
          for(let item in res.data.datas){
            for(let row of this.dashboardData){
              if(row.type === item) row.value = res.data.datas[item]
            }
          }
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    }
  },
  components:{
  }
}
</script>
