<style scoped lang="less">
  @import "./rail.less";
</style>

<template>
	<section class="rail">
    <top-header></top-header>
	    <el-container>
        <el-main>
          <!-- sync组件双向绑定 -->
          <!-- <bdmap :mapObj.sync="baiduMap"></bdmap> -->
          <!-- on emit 组件绑定 -->
          <map-panel :isNeedMapObj="true" @sendMapObj="getMapObj"></map-panel>
        </el-main>
        <el-aside width="300px">
          <el-tabs type="border-card">
            <el-tab-pane label="围栏列表">
              <el-table
                :data="tableData"
                height="800"
                border
                highlight-current-row
                @cell-click="handleCellClick"
                empty-text="暂无数据"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="围栏名称"
                  width="80"
                  align="center"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="类型"
                  align="center"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop="count"
                  label="数量"
                  width="60"
                  align="center"
                  header-align="center">
                </el-table-column>
                <el-table-column
                  prop="opt"
                  label="操作"
                  width="60"
                  align="center"
                  header-align="center">
                </el-table-column>
              </el-table>
              <el-pagination
                :page-size="20"
                small
                layout=" prev, pager, next"
                :total="100">
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
	</section>
</template>

<script>
import {addMapOverlay, openMapDialog} from '@/common/js/bdmap'
import mapPanel from '@/components/map-panel'
import BMapLib from 'BMapLib' 
export default {
  name: 'car-rail',
  data () {
    return {
      mapObj: null,
      overlays: [],
    	originData: [],
      tableData: [{
        name: 'test',
        type: '圆',
        count: '10',
        opt: '添加'
      }],
      currentPage: 1,
    }
  },
  mounted() {
    this.$nextTick(()=>{
      
    })
  },
  methods:{
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
      this.initDrawingManager()
    },
    // 初始化地图绘制工具
    initDrawingManager(){
      let styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      }
      //实例化鼠标绘制工具
      let drawingManager = new BMapLib.DrawingManager(this.mapObj, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes : [
              // BMAP_DRAWING_MARKER,
              BMAP_DRAWING_CIRCLE,
              // BMAP_DRAWING_POLYLINE,
              BMAP_DRAWING_POLYGON,
              // BMAP_DRAWING_RECTANGLE 
            ]
        },
        circleOptions: styleOptions, //圆的样式
        // polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        // rectangleOptions: styleOptions //矩形的样式
      });  
      // debugger
      //添加鼠标绘制工具监听事件，用于获取绘制结果
      this.overlays = [];
      drawingManager.addEventListener('overlaycomplete', e =>{
        this.overlays.push(e.overlay);
        console.log(this.overlays.length)
      });
    },
    clearAll() {
      for(var i = 0; i < this.overlays.length; i++){
        this.mapObj.removeOverlay(this.overlays[i]);
      }
      this.overlays.length = 0   
    },
    showOverlay() {
      alert(this.overlays.length)
    },
    handleCellClick(row, column, cell, event){
      console.log(row)
    }
  },
  components:{
    mapPanel
  }
}
</script>

