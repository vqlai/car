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

}
