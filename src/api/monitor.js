import ax from './interceptors'
let qs = require('qs')

// 获取设备
// 传参方式: post方式传参用 data: {...data} ，get方式传参用 params: {...params}，一般是Form Data方式请求
// 修改post请求参数类型如下：
// data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
export async function getDevice(params) {
	return await ax({
		url: '/entity/list',
		method: 'get',
		params: {...params} 
	})
}