<style scoped lang="less">
  @import "./login.less";
</style>

<template>
	<section class="login">
		<div class="card">
		  <div class="header">
		    <span>道能达车联网后台系统</span>
		  </div>
		  <el-form ref="form" :model="form">
		    <el-form-item>
		      <el-input v-model="form.username" type="text" placeholder="请输入用户名" clearable></el-input>
		    </el-form-item>
		    <el-form-item>
		      <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable></el-input>
		    </el-form-item>
		    <el-form-item>
		       <el-button type="primary" size="small" @click="doLogin">登录</el-button>
		    </el-form-item>
		  </el-form>
		</div>
		
	</section>
</template>

<script>
import {login} from '@/api/login'
import md5 from 'md5'
export default {
  name: 'login',
  data () {
    return {
    	form:{
    		username: '',
    		password: ''
    	}
    }
  },
  mounted() {
  },
  methods:{
  	doLogin(){
  		login({username: this.form.username, password: md5(this.form.password)}).then(res=>{
  			console.log(res)
  			if(res.data.ret == 0){
  				this.$router.push({
            name: 'Index'
          },()=>{
  	        this.$message({
  					  message: '登录成功！',
  					  type: 'success'
  					})
          })
          sessionStorage.setItem('username', this.form.username)
  			}else{
  				this.$message({
  				  message: res.data.msg,
  				  type: 'error'
  				})
  			}
  		})
  	}
  },
  components:{
  }
}
</script>