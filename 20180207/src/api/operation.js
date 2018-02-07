import ax from './interceptors'
let qs = require('qs')

let baseParam = {
	ak: 'ZXNpDG0ONOKWw9EGpVUBPmmkvzUWG5Y0',
	service_id: '159532'
	// ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
	// service_id: '157644'
}
// 传参方式: post方式传参用 data: {...data} ，get方式传参用 params: {...params}，一般是Form Data方式请求
// 修改post请求参数类型如下：
// data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
// 创建圆形围栏
export async function createCircleFence (data) {
	return await ax({
		url: '/fence/createcirclefence',
		method: 'post',
		data: qs.stringify(Object.assign({}, baseParam, data))
	})
}

// 创建多边形围栏
export async function createPolygonFence (data) {
	return await ax({
		url: '/fence/createpolygonfence',
		method: 'post',
		data: qs.stringify(Object.assign({}, baseParam, data))
	})
}


// 获取围栏列表
export async function getFence (params) {
	return await ax({
		url: '/fence/list',
		method: 'get',
		params: Object.assign({}, baseParam, params)
	})
}
