// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import {router} from './router/index'
import '@/common/css/index.less'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局注册svg图标组件
require('@/common/lib/iconfont.js')
import svgIcon from '@/components/svg-icon.vue' 
Vue.component('svg-icon', svgIcon) 

Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false // 生产环境请用true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
