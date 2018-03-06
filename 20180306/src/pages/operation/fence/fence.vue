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
            :visible.sync="addFenceDialog"
            width="25%"
            left>
            <el-form :model="addFenceDialogForm">
              <el-form-item label="围栏名称：" label-width="100px">
                <el-input v-model="addFenceDialogForm.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型：" label-width="100px">
                {{addFenceDialogForm.type ===1 ? '圆形':'多边形'}}
              </el-form-item>
              <el-form-item label="备注：" label-width="100px">
                <el-input v-model="addFenceDialogForm.remark" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addFenceDialog = false">取 消</el-button>
              <el-button type="primary" @click="onFenceDialogComfirm">确 定</el-button>
            </div>
          </el-dialog>
        </el-main>
        <el-aside width="320px">
          <el-tabs type="border-card" @tab-click="onTabClick" value="fence">
            <el-tab-pane label="围栏列表" name="fence">
              <fenceTable @onFenceTableCellClick="onFenceTableCellClick" ref="fenceList"></fenceTable>
            </el-tab-pane>
            <!-- <el-tab-pane label="行政区域" name="area">
              <areaTree v-if="areaTreeObj" @onTreeNodeClick="onTreeNodeClick"></areaTree>
            </el-tab-pane> -->
            <el-tab-pane label="车辆列表" name="car">
              <carTable v-if="carTableObj" @onCarTableCellClick="onCarTableCellClick"></carTable>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
	</section>
</template>

<script>
import {addCarMapOverlay,getCircle, getPolygon, getBound} from '@/common/js/bdmap'
import mapPanel from '@/components/map-panel'
import carTable from '@/components/car-table'
import areaTree from '@/components/area-tree'
import fenceTable from '@/components/fence-table'
import {createFence,getFenceByCarNumber} from '@/api/operation'
import BMapLib from 'BMapLib' 
export default {
  name: 'fence',
  data () {
    return {
      mapObj: null, // 地图对象
      overlay: null, // 存储绘制工具新建的覆盖物
      carTableObj: false,
      areaTreeObj: false,
      drawingManager: null, // 百度绘图对象
      drawingManagerBtns:[  // 绘图按钮组
        {iconClass: 'move',isActive: true,value:1},
        {iconClass: 'circle',isActive: false,value:2},
        {iconClass: 'square',isActive: false,value:3},
        {iconClass: 'clear',isActive: false,value:4}
      ],
      addFenceDialog: false,
      addFenceDialogForm: {
        name: '',
        remark: '',
        type: ''
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{})
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
        // fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.8,      //填充的透明度，取值范围0 - 1。
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
      this.overlay = overlay // 存储绘制数据
      let radius = this.overlay.getRadius()
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
      this.onOverlayComplete(1)
    },
    // 画多边形完成
    onPolygonComplete(overlay) {
      this.overlay = overlay // 存储绘制数据
      let paths = this.overlay.getPath()
      if (paths.length < 3) return false
      this.onOverlayComplete(2)
    },
    // 覆盖物绘制完成，1为圆，2为多边形
    onOverlayComplete(type){
      this.addFenceDialogForm.type = type
      this.addFenceDialogForm.name = '' // 重置表单
      this.addFenceDialogForm.remark = ''
      this.addFenceDialog = true
      // 覆盖物绑定事件
      this.overlay.addEventListener('click',()=>{
        this.addFenceDialog = true
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
    // 新增围栏确认事件 1为圆，2为多边形,3 为行政区域
    onFenceDialogComfirm() {
      let params = null
      if(this.addFenceDialogForm.type === 1){
        params = {
          fence_name: this.addFenceDialogForm.name,
          type: this.addFenceDialogForm.type,
          longitude: this.overlay.getCenter().lng,
          latitude: this.overlay.getCenter().lat,
          radius: this.overlay.getRadius(),
          remark: this.addFenceDialogForm.remark
        }
      }else if(this.addFenceDialogForm.type === 2){
        let path = this.overlay.getPath()
        let region = ''
        for (let i = 0; i < path.length; i++) {
          region += `${path[i].lat},${path[i].lng};`
        }
        params = {
          fence_name: this.addFenceDialogForm.name,
          type: this.addFenceDialogForm.type,
          vertexes: region,
          remark: this.addFenceDialogForm.remark
        }
      }else if(this.addFenceDialogForm.type === 3){

      }else{
        return false
      }
      // 添加围栏
      createFence(params).then((res)=>{
        this.createFenceRes(res)
      })
    },
    // 创建围栏api响应函数
    createFenceRes(res){
      // console.log(res)
      if(res.data.ret == 0){
        this.addFenceDialog = false
        // 通过refs获取到子组件实例来调用子组件方法进行刷新
        this.$refs.fenceList.reloadTable() 
        this.$message({
          showClose: true,
          message: '新增围栏成功',
          type: 'success'
        })
        // this.overlay.disableEditing() // 关闭覆盖物可编辑
        this.onClearOverlay() // 清除覆盖物并关闭编辑
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
        // 'fence': this._getFence(),
        'area': this.areaTreeObj = true,
        'car': this.carTableObj = true
      }
      tabFn[tab.name]
      this.onClearOverlay() // 清除地图覆盖物
    },
    // 围栏列表行点击事件
    onFenceTableCellClick(row, column, cell, event){
      // console.log(row)
      this.onClearOverlay()
      if(row.type == 1){
        getCircle(new BMap.Point(row.longitude, row.latitude), row.radius)
      }else if(row.type ==2){
        getPolygon(row.vertexes)
      }else{

      }
      // if(row.latitude && row.longitude){

      // }
    },
    // 车辆列表行点击事件
    onCarTableCellClick(row, column, cell, event){
      console.log(row)
      getFenceByCarNumber({vehicle_number: row.vehicle_number}).then((res)=>{
        // console.log(res)
        this.onClearOverlay()
        if(res.data.ret == 0){
          let list = res.data.datas.fences
          for(let item of list){
            if(item.shape=="circle"){
              getCircle(new BMap.Point(item.longitude, item.latitude), item.radius)
            }else if(item.shape=="polygon"){
              getPolygon(item.vertexes)
            }
          }
          addCarMapOverlay(row.longitude, row.latitude) // 把汽车位置添加到围栏地图
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 区域树节点点击事件
    onTreeNodeClick(cNode, pNode){
      let area = ''
      if(pNode.isLeaf){
        area = pNode.level === 3 ? pNode.parent.parent.label + pNode.parent.label + pNode.label : pNode.parent.label + pNode.label
      }else{
        area = pNode.level === 1 ? pNode.label : pNode.parent.label + pNode.label
      }
      getBound(area) // 根据树节点选中的区域在地图画出行政区域
    }
  },
  components:{
    mapPanel,
    carTable,
    fenceTable,
    areaTree
  }
}
</script>

