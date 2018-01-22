import ax from './interceptors'
let qs = require('qs')
let baseUrl = '//10.0.0.211:9999'

// 获取车辆绑定
export async function getBindCar(data) {
	return await ax({
		url: `${baseUrl}/car/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 新增绑定车辆
export async function addBindCar(data) {
	return await ax({
		url: `${baseUrl}/car/add`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 删除绑定车辆
export async function deleteBindCar(data) {
	return await ax({
		url: `${baseUrl}/car/delete`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取网点
export async function getWebsite(data) {
	return await ax({
		url: `${baseUrl}/branch/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 添加网点
export async function addWebsite(data) {
	return await ax({
		url: `${baseUrl}/branch/add`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 删除网点
export async function deleteWebsite(data) {
	return await ax({
		url: `${baseUrl}/branch/delete`,
		method: 'post',
		data: qs.stringify({...data})
	})
}