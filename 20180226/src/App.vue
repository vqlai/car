<template>
  <div id="app">
    <div v-if="!hidden">
      <top-header></top-header>
      <router-view :key="key"/>
      <btm-footer></btm-footer>
    </div>
    <div v-else>
      <router-view :key="key"/>
    </div>
  </div>
</template>

<script>
import topHeader from '@/components/top-header.vue'
import btmFooter from '@/components/btm-footer.vue'
export default {
  name: 'app',
  data(){
    return{
      hidden: false
    }
  },
  computed: {
    key() {
      // 确保路由切换时都会重新渲染触发created或者mounted钩子
      return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
  },
  mounted(){
    console.log(this.$route)
    setTimeout(()=>{
      if(this.$route.name === "Login"){
        this.hidden = true
      }else{
        this.hidden = false
      }
    },20)
  },
  watch: {
    $route(to){
      if(to.name === "Login"){
        this.hidden = true
      }else{
        this.hidden = false
      }
    }
  },
  components:{
    topHeader,
    btmFooter
  }
}
</script>

<style>
#app{
  width: 100%;
  height: 100%;
  min-width: 1200px;
  overflow: hidden;
  padding-top: 60px;
  padding-bottom: 20px;
  position: relative;
  box-sizing: border-box;
  background: #f2f2f2;
}
</style>
