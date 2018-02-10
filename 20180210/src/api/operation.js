import ax from './interceptors'
let qs = require('qs')
let baseUrl = '//iotsvr.he-live.com:8002'

// let baseParam = {
// 	ak: 'ZXNpDG0ONOKWw9EGpVUBPmmkvzUWG5Y0',
// 	service_id: '159532'
// }

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

// 加载某个车辆所有绑定的围栏
export async function getFenceByCarNumber (data) {
	return await ax({
		url: `${baseUrl}/fence/find_by_vihicle_number_or_fence_ids`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 加载某个围栏所有绑定的车辆
export async function getCarNumberByFence (data) {
	return await ax({
		url: `${baseUrl}/fence/get_vehicles_by_fenceid`,
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

// 围栏绑定车辆
export async function bindCar (data) {
	return await ax({
		url: `${baseUrl}/fence/add_vihicle_number`,
		method: 'post',
		data: qs.stringify(data)
	})
}