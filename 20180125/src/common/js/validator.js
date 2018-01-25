class validator{
	checkPhone(rule, value, callback){
		let reg = /^1[0-9]{10}$/
		if (!reg.test(value)) {
		  callback(new Error('请正确输入手机号码'))
		} else {
		  callback()
		}
	}
	checkPrice(rule, value, callback){
		let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
		if (!reg.test(value)) {
		  callback(new Error('请正确输入金额'))
		} else {
		  callback()
		}
	}
	checkIdentity(rule, value, callback){
		let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
		if (!reg.test(value)) {
		  callback(new Error('请正确输入身份证'))
		} else {
		  callback()
		}
	}
	checkLicence(rule, value, callback){
		let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
		if (!reg.test(value)) {
		  callback(new Error('请正确输入驾驶证'))
		} else {
		  callback()
		}
	}
}

export default new validator()