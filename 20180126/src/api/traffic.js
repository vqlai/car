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

// 新增绑定车辆 注意：使用multipart/form-data提交无需qs参数，但post要qs才能转为后台接收格式form-data，否则会发起option请求
export async function addBindCar(data) {
	return await ax({
		// headers: {'Content-Type': 'multipart/form-data'},
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

// 更新网点
export async function updateWebsite(data) {
	return await ax({
		url: `${baseUrl}/branch/update`,
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

// 获取收费方案
export async function getCharge(data) {
	return await ax({
		url: `${baseUrl}/charge_scheme/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 新增收费方案
export async function addCharge(data) {
	return await ax({
		url: `${baseUrl}/charge_scheme/add`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 新增收费方案
export async function updateCharge(data) {
	return await ax({
		url: `${baseUrl}/charge_scheme/update`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 删除收费方案
export async function deleteCharge(data) {
	return await ax({
		url: `${baseUrl}/charge_scheme/delete`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取租车列表
export async function getRental(data) {
	return await ax({
		url: `${baseUrl}/car_rental/get_info`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取可租车辆和收费方案列表
export async function getCarAndCharge(data) {
	return await ax({
		url: `${baseUrl}/car_rental/get_useable_car_and_charge_scheme`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 租车
export async function createRentCar(data) {
	return await ax({
		url: `${baseUrl}/car_rental/start`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取还车信息
export async function getReturnCarInfo(data) {
	return await ax({
		url: `${baseUrl}/car_rental/find_by_id_or_end`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 确定还车
export async function comfirmReturnCar(data) {
	return await ax({
		url: `${baseUrl}/car_rental/end_comfire`,
		method: 'post',
		data: qs.stringify({...data})
	})
}