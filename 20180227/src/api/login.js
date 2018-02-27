import ax from './interceptors'
let qs = require('qs')
// 从webpack配置自动获取到当前环境
let baseUrl = process.env.BASE_API

export async function login(data) {
	return await ax({
		url: `${baseUrl}/mng/login`,
		method: 'post',
		data: qs.stringify({...data})
	})
}

export async function logout(data) {

}
