import ax from './interceptors'
let qs = require('qs')
// let baseUrl = process.env.BASE_API

// 传参方式: post方式传参用 data: {...data} ，get方式传参用 params: {...params}，一般是Form Data方式请求
// 修改post请求参数类型如下：
// data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
// 创建围栏
export async function createFence (data) {
	return await ax({
		url: `/fence/add`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 获取围栏列表
export async function getFence (data) {
	return await ax({
		url: `/fence/get_info`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 加载某个车辆所有绑定的围栏
export async function getFenceByCarNumber (data) {
	return await ax({
		url: `/fence/find_by_vehicle_number_or_fence_ids`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 加载某个围栏所有绑定的车辆
export async function getCarNumberByFence (data) {
	return await ax({
		url: `/fence/get_vehicles_by_fenceid`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 删除围栏
export async function deleteFence (data) {
	return await ax({
		url: `/fence/delete`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 围栏绑定车辆
export async function bindCar (data) {
	return await ax({
		url: `/fence/add_vehicle_number`,
		method: 'post',
		data: qs.stringify(data)
	})
}

// 获取报警信息 
export async function getWarning(data){
	return await ax({
		url: `/fault_alarm/list`,
		method: 'post',
		data: qs.stringify(data)
	})
}