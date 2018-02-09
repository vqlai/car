import ax from './interceptors'
let qs = require('qs')
let baseUrl = '//10.0.0.211:9999'

let baseParam = {
	ak: 'ZXNpDG0ONOKWw9EGpVUBPmmkvzUWG5Y0',
	service_id: '159532'
}
// 传参方式: post方式传参用 data: {...data} ，get方式传参用 params: {...params}，一般是Form Data方式请求
// 修改post请求参数类型如下：
// data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
// 创建圆形围栏
// export async function createCircleFence (data) {
// 	return await ax({
// 		url: '/fence/createcirclefence',
// 		method: 'post',
// 		data: qs.stringify(Object.assign({}, baseParam, data))
// 	})
// }

// 创建多边形围栏
// export async function createPolygonFence (data) {
// 	return await ax({
// 		url: '/fence/createpolygonfence',
// 		method: 'post',
// 		data: qs.stringify(Object.assign({}, baseParam, data))
// 	})
// }

// 创建围栏
export async function createFence (data) {
	return await ax({
		url: `${baseUrl}/fence/add`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 获取围栏列表
export async function getFence (data) {
	return await ax({
		url: `${baseUrl}/fence/get_info`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 删除围栏
export async function deleteFence (data) {
	return await ax({
		url: `${baseUrl}/fence/delete`,
		method: 'post',
		data: qs.stringify(data)
	})
}