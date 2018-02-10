import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const ax = axios.create({
  baseURL: process.env.BASE_API,
  // baseURL: '/api', // 使用代理,注意后台有没有基础路径
	timeout: 10000 // 请求超时时间
})

// 请求拦截
// 注意axios默认的post请求的Content-Type类型是application/json
ax.interceptors.request.use(config => {
	// 处理请求前逻辑
	// if (window.sessionStorage.getItem('token')) {
 	//    config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('token')}`
 	//  }
	return config
}, error => {
	console.log('request error:' + error) // for debug
	return Promise.reject(error)
}) 

ax.interceptors.response.use(response => {
  return response
}, error => {
	console.log('response error:' + error)// for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
	return Promise.reject(error)
})

export default ax