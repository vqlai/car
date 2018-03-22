import ax from './interceptors'
let qs = require('qs')

export async function login(data) {
	return await ax({
		url: `/mng/login`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

export async function logout(data) {
	return await ax({
		url: `/mng/logout`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

// 获取报警提醒显示小红点
export async function getWarningDot(data) {
	return await ax({
		url: `/fault_alarm/get_read_status`,
		method: 'post',
		data: qs.stringify({...data})
	})
}
	
// 设置报警提醒小红点
// export async function setWarningDot(data) {
// 	return await ax({
// 		url: `/fault_alarm/set_read_status`,
// 		method: 'post',
// 		data: qs.stringify({...data})
// 	})
// }
// 箭头函数如果只有一句且是return返回，可以直接省略return语句和外层括号
export const setWarningDot = async (data)=> await ax({
		url: `/fault_alarm/set_read_status`,
		method: 'post',
		data: qs.stringify({...data})
	})