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
          <ul class="map-rail-btns">
            <li v-for="item in drawingManagerBtns" @click="onDrawingManagerBtn(item)" :class="{active:item.isActive}"><svg-icon :icon-class="item.iconClass"></svg-icon></li>
          </ul>
          <el-dialog
            title="新建围栏"
            :visible.sync="dialogVisible"
            @open="onDialogOpen"
            width="25%"
            left>
            <el-form :model="dialogForm">
              <el-form-item label="围栏名称：" label-width="100px">
                <el-input v-model="dialogForm.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型：" label-width="100px">
                圆形
              </el-form-item>
              <el-form-item label="备注：" label-width="100px">
                <el-input v-model="dialogForm.remark" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
          </el-dialog>
        </el-main>
        <el-aside width="300px">
          <el-tabs type="border-card">
            <el-tab-pane label="围栏列表">
              <el-table
                :data="tableData"
                height="800"
                border
                highlight-current-row
                @cell-click="onCellClick"
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
            <el-tab-pane label="设备列表">
              <deviceTable :tableData="deviceData" :showSelection="false"></deviceTable>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
	</section>
</template>

<script>
import {addMapOverlay, openMapDialog} from '@/common/js/bdmap'
import mapPanel from '@/components/map-panel'
import deviceTable from '@/components/device-table'
import {getDevice} from '@/api/monitor'
import BMapLib from 'BMapLib' 
export default {
  name: 'car-rail',
  data () {
    return {
      mapObj: null,
      overlay: null, // 存储绘制工具新建的覆盖物
    	originData: [],
      tableData: [{
        name: 'test',
        type: '圆',
        count: '10',
        opt: '添加'
      }],
      deviceData: [],
      currentPage: 1,
      dialogVisible: false,
      drawingManager: null,
      drawingManagerBtns:[
        {iconClass: 'move',isActive: true,value:1},
        {iconClass: 'circle',isActive: false,value:2},
        {iconClass: 'square',isActive: false,value:3},
        {iconClass: 'clear',isActive: false,value:4}
      ],
      dialogForm: {
        name: '',
        remark: ''
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getDevice()
    })
  },
  methods:{
    // 获取设备列表
    _getDevice() {
      let params = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644'
      }
      getDevice(params).then(res => {
        for(let item of res.data.entities){
          item.status = item.latest_location.loc_time + 5*60 > new Date().getTime()/1000 ? 3 : 4
          this.deviceData.push(item)
        }
        console.log(this.deviceData)
      })
    },
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
      this.drawingManager = new BMapLib.DrawingManager(this.mapObj, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
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
      })
      // debugger
      //添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('circlecomplete', this.onCircleComplete)
      this.drawingManager.addEventListener('polygoncomplete', this.onPolygonComplete)
    },
    // 画圆完成
    onCircleComplete(overlay) {
      this.mapObj.removeOverlay(this.overlay)
      this.overlay = overlay
      let radius = overlay.getRadius()
      if(radius===0){
        return false
      }
      let centerPoint = overlay.getCenter()
      let region = centerPoint.lng + ',' + centerPoint.lat + ';' + radius
      console.log(region)
      this.dialogVisible = true
    },
    // 画多边形完成
    onPolygonComplete(overlay) {
      this.mapObj.removeOverlay(this.overlay)
      let paths = overlay.getPath()
      if (paths.length < 3) {
        return false;
      }
      let region = '';
      for (let i = 0; i < paths.length; i++) {
        region += paths[i].lng + ',' + paths[i].lat + ';';
      }
      if (region.length > 0) {
        region = region.substring(0, region.length - 2);
      }
      console.log(region)
      this.dialogVisible = true
    },
    onDrawingManagerBtn(item) {
      console.log(item)
      for(let btn of this.drawingManagerBtns){
        btn.isActive = false
      }
      item.isActive = true
      console.log(item.value)
      switch(item.value){
        case 1:
          break
        case 2:
          this.onDrawCircle()
          break
        case 3:
          this.onDrawPolygon()
          break
        case 4:
          this.onClearOverlay()
          break
      }
    },
    onDrawCircle() {
      this.onClearOverlay()
      this.drawingManager.open()
      this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    },
    onDrawPolygon() {
      this.onClearOverlay()
      this.drawingManager.open()
      this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    },
    // 清除所有覆盖物
    onClearOverlay() {
      this.overlay = null
      if (this.drawingManager) {
        this.drawingManager.close()
      }
      for(let obj of this.mapObj.getOverlays()){
        this.mapObj.removeOverlay(obj);
      } 
    },
    // 对话框打开事件
    onDialogOpen() {
      // this.onClearOverlay()
    },
    showOverlay() {
      alert(this.overlays.length)
    },
    onCellClick(row, column, cell, event){
      console.log(row)
    }
  },
  components:{
    mapPanel,
    deviceTable
  }
}
</script>

