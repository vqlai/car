<template>
  <div id="bdmap"></div>
</template>

<script>
import {initBdMap,addMapOverlay,openMapDialog} from '@/common/js/bdmap'
export default {
  name: 'bdmap',
  props: {
    bmap: Object
  },
  computed: {
  },
  mounted(){
    setTimeout(() => {
      // 地图配置
      let config={
        domId: 'bdmap',
        city: '深圳',
        maxzoom: 16,
        minzoom: 5,
        isNavigationControl: true
      }
      initBdMap(config).then(map => {
        // 将地图对象传到父页面
        this.$emit("update:bmap",map)
      })
      
    },20)
  }
}
</script>

<style scoped lang="less">
  #bdmap{
    height: 100%;
    width: 100%;
  }
</style>