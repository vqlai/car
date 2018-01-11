<style scoped lang="less">
  @import "./track.less";
</style>

<template>
	<section class="track">
    <top-header></top-header>
    <el-container>
      <el-main>
        <div id="bdmap"></div>
      </el-main>
      <el-aside width="300px">轨迹管理</el-aside>
    </el-container>
	</section>
</template>

<script>
import {initBdMap} from '@/common/js/bdmap'
export default {
  name: 'car-track',
  data () {
    return {
    }
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
    },20)
  },
  methods:{
  },
  components:{
  }
}
</script>
