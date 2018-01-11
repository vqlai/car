<style scoped lang="less">
  @import "./monitor.less";
</style>

<template>
	<section class="monitor">                 
    <top-header></top-header>
		<el-container>
      <el-main>
        <!-- <div class="map-menu"></div> -->
        <div id="bdmap"></div>
      </el-main>
      <el-aside width="300px">
        <el-tag>设备列表</el-tag>
        <!-- :header-row-style="setHeaderClass" -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="800"
          border
          highlight-current-row
          empty-text="暂无数据"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <!-- <el-table-column
            type="selection"
            width="40">
          </el-table-column> -->
          <el-table-column
            prop="type"
            label="类型"
            width="60"
            align="center"
            header-align="center">
            <template slot-scope="scope">
              <i :class="getCarTypeIcon(scope.row.type)"></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            align="center"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
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
      </el-aside>
    </el-container>
	</section>
</template>

<script> 
import {initBdMap} from '@/common/js/bdmap'
import {getDevice} from '@/api/monitor'
export default {
  name: 'car-monitor',
  data () {
    return {
      tableData: [{
        type: '3',
        name: '鲁BQ86L7',
        status: '在线'
      },{
        type: '4',
        name: '鲁BQ81L7',
        status: '离线'
      }],
      currentPage: 1,
      // multipleSelection: []
    }
  },
  computed:{
    
  },
  mounted() {
    setTimeout(() => {
      let obj={
        id: 'bdmap',
        city: '深圳',
        maxzoom: 16,
        minzoom: 5
      }
      initBdMap(obj).then(map => {
        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({ 
          enableGeolocation: false, // 启用显示定位
          anchor:BMAP_ANCHOR_TOP_LEFT // 定位固定位置
        })
        map.addControl(navigationControl)
      })
      this._getDevice()
    },20)
  },
  methods:{
    _getDevice() {
      let params = {
        ak: 'wsAfNKAreGDcc1b1sBkM1zzznwVWQbwk',
        service_id: '157188'
      }
      getDevice(params).then(res => {
        console.log(res)
      })
    },
    getCarTypeIcon(type) {
      return `car-type-icon car-type-icon${type}`
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 设置表格头部样式
    // setHeaderClass({row, rowIndex}){
    //   return {'color':'red','font-size':'14px','background':'red'}
    // }
  },
  components:{
  }
}
</script>