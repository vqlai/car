<template>
  <div class="top-header">
  	<!-- 注意el-header/el-footer默认高度是60px而且是动态设置绑定的，可通过element的header属性设置-->
    <el-header>
  	  <el-row type="flex">
  	    <el-col :span="5"><div class="logo"><img src="../common/images/logo.png" alt=""></div></el-col>
  	    <el-col :span="16">
  	    	<el-menu :default-active="currentPath" active-text-color="#409EFF" menu-trigger="hover"	:unique-opened="true" mode="horizontal" @select="onMenuSelect" router>
  	    	  <el-menu-item index="/index">首页</el-menu-item>
            <el-submenu index="/drive">
              <template slot="title">行车管理</template>
                <el-menu-item index="/monitor">实时追踪</el-menu-item>
                <el-menu-item index="/track">历史轨迹</el-menu-item>
                <el-menu-item index="/data">行程数据</el-menu-item>
                <el-menu-item index="/record">行程记录</el-menu-item>
                <el-menu-item index="/alarm">报警管理</el-menu-item>
            </el-submenu>
            <el-submenu index="/operation">
              <template slot="title">运营管理</template>
                <el-menu-item index="/fence">围栏设置</el-menu-item> 
                <el-menu-item index="/control">远程控制</el-menu-item>
                <el-menu-item index="/behavior">驾驶行为</el-menu-item>
                <el-menu-item index="/state">车况监控</el-menu-item>
            </el-submenu>
            <el-submenu index="/traffic">
              <template slot="title">车务管理</template>
                <el-menu-item index="/bind">车辆绑定</el-menu-item>
                <el-menu-item index="/charge">收费方案</el-menu-item>
                <el-menu-item index="/rental">租还车</el-menu-item>
                <el-menu-item index="/website">网点维护</el-menu-item>
                <el-menu-item index="/message">消息管理</el-menu-item>
                <el-menu-item index="/count">数据统计</el-menu-item>
            </el-submenu>
  	    	</el-menu>
  	    </el-col>
  	    <el-col :span="3">
          <div class="btns">
            <el-dropdown trigger="click" placement="bottom" @command="onMenuCommand">
              <span class="el-dropdown-link">
                您好，{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="modify">密码修改</el-dropdown-item>
                <el-dropdown-item command="logout">安全退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dialog
              title="安全退出"
              :visible.sync="logoutDialog"
              width="30%">
              <span>您确定要退出？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="logoutDialog = false">取 消</el-button>
                <el-button type="primary" @click="logoutDialog = false">确 定</el-button>
              </span>
            </el-dialog>

          </div>  
        </el-col>
  	  </el-row>
    </el-header>
    <el-breadcrumb separator-class="el-icon-arrow-right" v-show="showBreadcrumb">
      <el-breadcrumb-item v-for="item in breadcrumb" :to="{ path: item.path }" :key="item.name">{{item.title}}</el-breadcrumb-item> 
    </el-breadcrumb>
  </div>
</template>

<script>
import {appRouter} from '@/router/router'
export default {
  name: 'top-header',
  data () {
    return {
    	currentPath: null,
      username: 'admin',
      breadcrumb: [], // 存储面包屑路径
      logoutDialog: false, // 退出弹窗
      showBreadcrumb: false
    }
  },
  mounted() {
    setTimeout(()=>{
      this.currentPath = this.$route.path
      if(this.$route.name === 'Index'){
        this.showBreadcrumb = false
      }else{
        this.showBreadcrumb = true
        this.getBreadcrumb(this.$route.name) // 组合面包屑内容
      }
    },20)
  },
  watch: {
    $route (to) {
      this.currentPath = this.$route.path
      // console.log(this.$route)
      // console.log(to.name)
      // console.log(appRouter)
      if(to.name === 'Index'){
        this.showBreadcrumb = false
      }else{
        this.showBreadcrumb = true
        this.getBreadcrumb(to.name) // 组合面包屑内容
      }
    }
  },
  methods:{
  	onMenuSelect(key, keyPath) {
      // console.log(key, keyPath)
      // console.log(this.$route)
      // this.activePath = key
      // localStorage.setItem('currentPath',key)
      // this.$router.push({
      //   path: redirect
      // },()=>{})
    },
    getBreadcrumb(name){
      this.breadcrumb = []
      for (let item of appRouter){
        if(name == item.name){
          if(item.sign === 1){
            this.breadcrumb.push(item)
          }else if(item.sign === 2){
            this.breadcrumb.push(appRouter[1]) // appRouter[1]即首页
            this.breadcrumb.push({path: '',name: 'Drive',title: '行车管理',})
            this.breadcrumb.push(item)
          }else if(item.sign === 3){
            this.breadcrumb.push(appRouter[1])
            this.breadcrumb.push({path: '',name: 'Operation',title: '运营管理',})
            this.breadcrumb.push(item)
          }else if(item.sign === 4){
            this.breadcrumb.push(appRouter[1])
            this.breadcrumb.push({path: '',name: 'Traffic',title: '车务管理',})
            this.breadcrumb.push(item)
          }
        }
      }
    },
    onMenuCommand(item){ // 处理dropdown事件
      console.log(item)
      if(item==="modify"){

      }else if(item === "logout"){
        // this.logoutDialog = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .top-header{
  	.el-header {
  		position: absolute;
  		top: 0;
  		left: 0;
      display: flex;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      background-color: #fff;
      color: #333;
      .el-row{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #e6e6e6;
        .logo{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .el-menu{
          height: 60px;
          /*注意box-sizing只在设置了宽高的元素中生效*/
          box-sizing: border-box;
          .el-menu-item{
            height: 59px;
            box-sizing: border-box;
          }
          .el-menu-item:hover{
            color: #409EFF;
            // border-bottom-color: #409EFF!important;
            // background: #e6eff9;
          }
          .el-menu-item:focus{
            color: #909399;
          }
          .el-submenu{
            .el-menu-item{
              height: 36px;
            }
            i{
              font-size: 14px!important;
            }
          }
          .el-submenu.is-active i{
            color: #409EFF!important;
          }
          .el-submenu:hover,.el-submenu:active{
            color: #409EFF!important;
            i{
              color: #409EFF!important;
            }
          }
        }
        .btns{
          font-size: 14px;
          padding-left: 15%;
          .el-dropdown-link {
            cursor: pointer;
            color: #409EFF;
          }
        }
      }
    }
    .el-breadcrumb{
      padding: 5px 0 5px 8%;
      background: #fff;
      box-sizing: border-box;
      border-bottom: 1px solid #e6e6e6;
    }
  }  
</style>
