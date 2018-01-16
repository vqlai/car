<template>
  <div id="map-panel"></div>
</template>

<script>
import {initBdMap,addMapOverlay,openMapDialog} from '@/common/js/bdmap'
export default {
  name: 'map-panel',
  props: {
    isNeedMapObj: Boolean
  },
  computed: {
  },
  mounted(){
    setTimeout(() => {
      // 地图配置
      let config={
        domId: 'map-panel',
        city: '深圳',
        maxzoom: 16,
        minzoom: 5,
        isNavigationControl: true
      }
      initBdMap(config).then(mapObj => {
        if(this.isNeedMapObj){
          // 将地图对象传到父页面
          // this.$emit("update:mapObj",mapObj) // 通过.sync 修饰符进行双向绑定
          this.$emit("sendMapObj", mapObj) // 单向绑定，子传父
        }
      })
    },20)
  }
}
</script>

<style scoped lang="less">
  #map-panel{
    height: 100%;
    width: 100%;
  }
</style>