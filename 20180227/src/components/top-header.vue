<template>
  <div class="top-header">
  	<!-- 注意el-header/el-footer默认高度是60px而且是动态设置绑定的，可通过element的header属性设置-->
    <el-header>
  	  <el-row type="flex">
  	    <el-col :span="5">
          <div class="logo">
            <!-- <img src="../common/images/logo.png" alt=""> -->
            <img src="../common/images/logo2.png" alt="">
          </div>
        </el-col>
  	    <el-col :span="16">
  	    	<el-menu :default-active="currentPath" active-text-color="#409EFF" menu-trigger="hover" mode="horizontal" @select="onMenuSelect" router>
  	    	  <el-menu-item index="/index">首页</el-menu-item>
            <el-submenu :index="father.path" v-for="father in menuArray" :key="father.name">
              <template slot="title">{{father.title}}</template>
                <el-menu-item :index="`${father.path}/${child.path}`" v-for="child in father.children" :key="child.name">{{child.title}}</el-menu-item>
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
      <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="item.name">
        <span v-if="index > 0" class="no-redirect">{{item.title}}</span>
        <router-link v-else :to="{ path: item.path }">{{item.title}}</router-link>
      </el-breadcrumb-item> 
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
      username: sessionStorage.getItem('username'),
      breadcrumb: [], // 存储面包屑路径
      logoutDialog: false, // 退出弹窗
      showBreadcrumb: false,
      menuArray: appRouter
    }
  },
  mounted() {
    setTimeout(()=>{
      // this.currentPath = this.$route.path
      // console.log(this.$route)
      this.getBreadcrumb()
    },20)
  },
  watch: {
    $route (to) {
      // this.currentPath = this.$route.path
      // console.log(this.$route)
      // console.log(to.name)
      // console.log(appRouter)
      this.getBreadcrumb()
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
    getBreadcrumb(){
      this.currentPath = this.$route.path
      let father = this.$route.matched[0].name
      let children = this.$route.matched[1].name
      this.breadcrumb = []
      this.breadcrumb.push({path: '/',name: 'index',title: '首页',})
      this.showBreadcrumb = true // 显示面包屑
      if(father === "drive"){
        for (let item of appRouter[0].children){
          if(children == item.name){
            this.breadcrumb.push({path: '',name: 'drive',title: '行车管理',})
            this.breadcrumb.push(item)
          }
        }
      }else if(father === "operation"){
        for (let item of appRouter[1].children){
          if(children == item.name){
            this.breadcrumb.push({path: '',name: 'operation',title: '运营管理',})
            this.breadcrumb.push(item)
          }
        }
      }else if(father === "traffic"){
        for (let item of appRouter[2].children){
          if(children == item.name){
            this.breadcrumb.push({path: '',name: 'operation',title: '车务管理',})
            this.breadcrumb.push(item)
          }
        }
      }else{
        this.showBreadcrumb = false
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
      .no-redirect{
        cursor: text;
        color: #606266;
      }
      a{
        text-decoration: none;
      }
    }
  }  
</style>
