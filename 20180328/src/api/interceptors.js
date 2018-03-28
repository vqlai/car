import axios from 'axios'
import { Message } from 'element-ui'
import {router} from '@/router/index.js';

// 创建axios实例
const ax = axios.create({
  // baseURL: process.env.PROXY_API, // 使用代理,注意后台有没有基础路径
  baseURL: process.env.BASE_API, 
	timeout: 10000 // 请求超时时间
})

// 请求拦截
// 注意axios默认的post请求的Content-Type类型是application/json
ax.interceptors.request.use(config => {
	// 处理请求前逻辑
	if (window.sessionStorage.getItem('token')) {
 	  config.headers.Authorization = window.sessionStorage.getItem('token')
 	}
	return config
}, error => {
	console.log('request error:' + error) // for debug
	return Promise.reject(error)
}) 

ax.interceptors.response.use(response => {
	if(response.status !== 200){
		Message({
	    message: '登录认证失败，请重新登录！',
	    type: 'error',
	    duration: 5 * 1000
	  })
		// router.replace({
	 //    path: '/login',
	 //    query: {redirect: router.currentRoute.fullPath}
	 //  })
	  router.replace({name: 'login'})
	}
  return response
}, error => {
	console.log('response error:' + error) // for debug
  Message({
    message: '登录认证失败，请重新登录！',
    type: 'error',
    duration: 5 * 1000
  })
  // router.replace({
  //   path: '/login',
  //   query: {redirect: router.currentRoute.fullPath}
  // })
  router.replace({name: 'login'})
	return Promise.reject(error)
})

export default ax