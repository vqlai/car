import ax from './interceptors'
let qs = require('qs')

// 获取行程数据
export async function getDashboard(params) {
	return await ax({
		url: `/dashboard/statistics`,
		method: 'get',
		params: {...params}
	})
}