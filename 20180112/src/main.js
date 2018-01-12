// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router/index'
import '@/common/css/index.less'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局注册组件
import topHeader from '@/components/top-header.vue'
Vue.component('top-header', topHeader)
// svg组件
require('@/common/js/iconfont.js')
import svgIcon from '@/components/svg-icon.vue' 
Vue.component('svg-icon', svgIcon) 

// require('@/common/js/LuShu_min.js')
// require('@/common/js/LuShu.js')

Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
