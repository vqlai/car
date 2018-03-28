<template>
  <div id="map-panel"></div>
</template>

<script>
import {initBdMap} from '@/common/js/bdmap'
export default {
  name: 'map-panel',
  props: {
    isNeedMapObj: Boolean,
    isNeedControl:{
      type: Boolean,
      default: true
    },
    defaultZoom: {
      type: Number,
      default: 12
    },
    defaultCity: {
      type: String,
      default: '深圳'
    }
  },
  mounted(){
    setTimeout(() => {
      // 地图配置
      let config={
        domId: 'map-panel',
        city: this.defaultCity,
        maxzoom: 18,
        minzoom: 5,
        zoom: this.defaultZoom,
        isNavigationControl: this.isNeedControl
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

<style lang="less">
  #map-panel{
    height: 100%;
    width: 100%;
    .BMap_cpyCtrl{  
      display:none  
    }  
    .anchorBL{  
      display:none 
    }   
  }
</style>