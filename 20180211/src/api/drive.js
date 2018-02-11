import ax from './interceptors'
let qs = require('qs')
// 从webpack配置自动获取到当前环境
let baseUrl = process.env.BASE_API

// 获取车辆列表
// 传参方式: post方式传参用 data: {...data} ，get方式传参用 params: {...params}，一般是Form Data方式请求
// 修改post请求参数类型如下：
// data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
export async function getCarList(data) {
	return await ax({
		url: `${baseUrl}/car/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取指定车辆的详细信息
export async function getCarInfo(data) {
	return await ax({
		url: `${baseUrl}/car/find_by_vehicle`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取行程数据
export async function getDriveData(data) {
	return await ax({
		url: `${baseUrl}/travel_data/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取行程数据
export async function getDriveRecord(data) {
	return await ax({
		url: `${baseUrl}/travel_record/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取轨迹
export async function getTrack(params) {
	return await ax({
		url: '/track/gettrack',
		method: 'get',
		params: {...params} 
	})
}