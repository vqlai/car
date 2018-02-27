<template>
	<section class="main">
		<top-header></top-header>
		<router-view :key="key"/>
		<btm-footer></btm-footer>
	</section>
</template>

<script>
import topHeader from '@/components/top-header.vue'
import btmFooter from '@/components/btm-footer.vue'
export default {
  name: 'v-main',
  data () {
    return {
    }
  },
  computed: {
    key() {
      // 确保路由切换时都会重新渲染触发created或者mounted钩子
      return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
  },
  mounted() {
  },
  methods:{
  },
  components:{
  	topHeader,
  	btmFooter
  }
}
</script>

<style scoped lang="less">
	.main{
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