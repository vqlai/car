<style scoped lang="less">
  @import "./index.less";
</style>
<template>
  <section class="index">    
	  <el-container>
	    <el-main>
        <el-row :gutter="20" class="top-box">
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
        <el-row class="echart-box" :gutter="40">
          <el-col :span="12" ref="line">
            <div id="line1" class="line" v-loading="loading" element-loading-text="数据加载中..."></div>
          </el-col>
          <el-col :span="12" ref="line">
            <div id="line2" class="line" v-loading="loading" element-loading-text="数据加载中..."></div>
          </el-col>
        </el-row>
      </el-main>
	  </el-container>
  </section> 
</template>

<script>
import echarts from 'echarts'
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
      ],
      loading: true
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
          let xData1 = []
          let yData1 = []
          for(let item of res.data.datas.charges){
            xData1.push(item.date_time)
            yData1.push(item.count)
          }
          let xData2 = []
          let yData2 = []
          for(let item of res.data.datas.orders_number){
            xData2.push(item.date_time)
            yData2.push(item.count)
          }
          this._initLine(document.getElementById('line1'),xData1,yData1,'成交金额')
          this._initLine(document.getElementById('line2'),xData2,yData2,'成交量')
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 初始化折线图
    _initLine(element,xData,yData,title){ 
      let line = echarts.init(element)
      let option = {
        title: {
          text: `最近7天${title}`,
          left: '50%',
          textAlign: 'center'
        },
        tooltip : {
          trigger: 'axis',
          // axisPointer: {
          //     type: 'cross',
          //     label: {
          //         backgroundColor: '#6a7985'
          //     }
          // }
        },
        grid: {
          left: '2%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : xData
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name: title,
            type:'line',
            stack: '总量',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#017cc2'
                }, {
                  offset: 1,
                  color: 'rgba(216, 244, 247,1)'
               }], false)
              }
            },
            itemStyle: {
                normal: {
                    // color: '#58c8da'
                    color: '#017cc2'
                }
            },
            lineStyle: {
                normal: {
                    width: 2
                }
            },
            data: yData
          }
        ]
      }
      line.setOption(option)
      this.loading = false
    }
  },
  components:{
  }
}
</script>
