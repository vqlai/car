import ax from './interceptors'
let qs = require('qs')

// 传参方式: post方式传参用 data: {...data} ，get方式传参用 params: {...params}，一般是Form Data方式请求
// 修改post请求参数类型如下：
// data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
// 创建围栏
export async function createCircleFence (data) {
	return await ax({
		url: '/fence/createcirclefence',
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取围栏列表
export async function getFence (params) {
	return await ax({
		url: '/fence/list',
		method: 'get',
		params: {...params}
	})
}
