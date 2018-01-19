<style scoped lang="less">
  @import "./fence.less";
</style>

<template>
	<section class="fence">
	    <el-container>
        <el-main>
          <!-- sync组件双向绑定 -->
          <!-- <bdmap :mapObj.sync="baiduMap"></bdmap> -->
          <!-- on emit 组件绑定 -->
          <map-panel :isNeedMapObj="true" @sendMapObj="getMapObj"></map-panel>
          <ul class="map-fence-btns">
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
                {{dialogForm.type ===1 ? '圆形':'多边形'}}
              </el-form-item>
              <el-form-item label="备注：" label-width="100px">
                <el-input v-model="dialogForm.remark" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onDialogComfirm">确 定</el-button>
            </div>
          </el-dialog>
        </el-main>
        <el-aside width="300px">
          <el-tabs type="border-card" @tab-click="onTabClick" value="fence">
            <el-tab-pane label="围栏列表" name="fence">
              <fenceTable :tableData="fenceData"></fenceTable>
            </el-tab-pane>
            <el-tab-pane label="设备列表" name="device">
              <deviceTable :tableData="deviceData"></deviceTable>
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
import fenceTable from '@/components/fence-table'
import {getDevice} from '@/api/drive'
import {createCircleFence,getFence,createPolygonFence} from '@/api/operation'
import BMapLib from 'BMapLib' 
export default {
  name: 'fence',
  data () {
    return {
      mapObj: null, // 地图对象
      overlay: null, // 存储绘制工具新建的覆盖物
      fenceData: [], // 围栏列表
      deviceData: [], // 设备列表
      drawingManager: null, // 百度绘图对象
      drawingManagerBtns:[  // 绘图按钮组
        {iconClass: 'move',isActive: true,value:1},
        {iconClass: 'circle',isActive: false,value:2},
        {iconClass: 'square',isActive: false,value:3},
        {iconClass: 'clear',isActive: false,value:4}
      ],
      dialogVisible: false,
      dialogForm: {
        name: '',
        remark: '',
        type: ''
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getFence()
      // this.onTabClick('fence')
    })
  },
  methods:{
    // 获取围栏列表
    _getFence() {
      let params = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644',
        monitored_person: 'vqlai'
      }
      this.fenceData = []
      getFence(params).then((res)=>{
        if(res.data.status == 0){
          this.fenceData = [...res.data.fences]
        }
      })
    },
    // 获取设备列表
    _getDevice() {
      let params = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644'
      }
      this.deviceData = []
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
          offset: new BMap.Size(5, 5) //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polygonOptions: styleOptions //多边形的样式
      })
      //添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('circlecomplete', this.onCircleComplete)
      this.drawingManager.addEventListener('polygoncomplete', this.onPolygonComplete)
    },
    // 画圆完成
    onCircleComplete(overlay) {
      this.overlay = overlay
      let radius = this.overlay.getRadius()
      console.log(radius)
      if(radius===0) return false
      // if(radius > 5000) {
      //   this.$message({
      //     showClose: true,
      //     message: '圆半径超出，请重新绘制',
      //     type: 'error'
      //   })
      //   this.onClearOverlay()
      //   return false
      // }
      // let centerPoint = overlay.getCenter()
      // this.dialogForm.lng = centerPoint.lng
      // this.dialogForm.lat = centerPoint.lat
      // this.dialogForm.radius = radius
      // let region = centerPoint.lng + ',' + centerPoint.lat + ';' + radius
      this.onOverlayComplete(1)
    },
    // 画多边形完成
    onPolygonComplete(overlay) {
      this.overlay = overlay
      let paths = this.overlay.getPath()
      if (paths.length < 3) return false
      // let region = '';
      // for (let i = 0; i < paths.length; i++) {
      //   region += paths[i].lng + ',' + paths[i].lat + ';';
      // }
      // if (region.length > 0) {
      //   region = region.substring(0, region.length - 2);
      // }
      // this.dialogForm.vertexes = region
      this.onOverlayComplete(2)
    },
    // 覆盖物绘制完成，1为圆，2为多边形
    onOverlayComplete(type){
      this.dialogForm.type = type
      this.dialogForm.name = ''
      this.dialogForm.remark = ''
      this.dialogVisible = true
      this.overlay.addEventListener('click',()=>{
        this.dialogVisible = true
      })
      this.overlay.enableEditing() // 开启覆盖物编辑功能
      let flag = false // 防止事件多次快速执行
      this.overlay.addEventListener("lineupdate",(e)=>{
        if(!flag){
          flag = true
          // 间隔执行函数，防止短时间多次触发事件
          setTimeout(()=>{
            this.mapObj.removeOverlay(this.overlay)
            this.mapObj.addOverlay(e.currentTarget)
            this.overlay = e.currentTarget
            flag = false
          }, 1000)
        }
      })
      this.drawingManager.close() // 关闭绘图
    },
    // 新增围栏确认事件
    onDialogComfirm() {
      // console.log(this.overlay)
      let base = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644',
        coord_type: 'wgs84'
      }
      let param = null
      if(this.dialogForm.type === 1){
        param = {
          fence_name: this.dialogForm.name,
          monitored_person: 'vqlai',
          longitude: this.overlay.getCenter().lng,
          latitude: this.overlay.getCenter().lat,
          radius: this.overlay.getRadius()
        }
        createCircleFence(Object.assign(base,param)).then((res)=>{
          this.createFenceRes(res)
        })
      }else if(this.dialogForm.type === 2){
        let paths = this.overlay.getPath()
        let region = ''
        for (let i = 0; i < paths.length; i++) {
          region += paths[i].lng + ',' + paths[i].lat + ';'
        }
        if (region.length > 0) {
          region = region.substring(0, region.length - 2)
        }
        // console.log(paths)
        // console.log(region)
        param = {
          fence_name: this.dialogForm.name,
          monitored_person: 'vqlai',
          vertexes: region
        }
        createPolygonFence(Object.assign(base,param)).then((res)=>{
          this.createFenceRes(res)
        })
      }else{
        return false
      }
    },
    // 创建围栏响应函数
    createFenceRes(res){
      // console.log(res)
      if(res.data.status == 0){
        this.dialogVisible = false
        this._getFence() // 新建围栏刷新表格无效果
        this.$message({
          showClose: true,
          message: '新增围栏成功',
          type: 'success'
        })
        this.overlay.disableEditing() // 关闭覆盖物可编辑
      }else{
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'error'
        })
      }
    },
    // 按钮面板切换事件处理
    onDrawingManagerBtn(item) {
      // console.log(item)
      for(let btn of this.drawingManagerBtns){
        btn.isActive = false
      }
      item.isActive = true
      switch(item.value){
        case 1:
          this.onDrawMove()
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
    // 移动按钮
    onDrawMove() {
      this.overlay.disableEditing()
      this.drawingManager.close()
    },
    // 画圆按钮
    onDrawCircle() {
      this.onClearOverlay()
      this.drawingManager.open()
      this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    },
    // 画多边形按钮
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
    // tab切换事件
    onTabClick(tab) {
      let tabFn ={
        'fence': this._getFence(),
        'device': this._getDevice()
      }
      tabFn[tab.name]
    },
    // 对话框打开事件
    onDialogOpen() {
      // this.onClearOverlay()
    },
    // onCellClick(row, column, cell, event){
    //   console.log(row)
    // }
  },
  components:{
    mapPanel,
    deviceTable,
    fenceTable
  }
}
</script>

