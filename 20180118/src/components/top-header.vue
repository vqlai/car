<template>
	<!-- 注意el-header/el-footer默认高度是60px而且是动态设置绑定的 -->
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
          </el-submenu>
          <el-submenu index="/operation">
            <template slot="title">运营管理</template>
            <!-- <el-menu-item index="/demo1">远程控制</el-menu-item>
            <el-menu-item index="/demo2">驾驶行为</el-menu-item>
            <el-menu-item index="/demo2">车况监控</el-menu-item>-->
            <el-menu-item index="/fence">围栏设置</el-menu-item> 
          </el-submenu>
          <el-submenu index="/traffic">
            <template slot="title">车务管理</template>
            <el-menu-item index="/loan">车辆绑定</el-menu-item>
            <!-- <el-menu-item index="/demo2">网点维护</el-menu-item>
            <el-menu-item index="/demo2">消息管理</el-menu-item> -->
            <el-menu-item index="/count">数据统计</el-menu-item>
            <!-- <el-menu-item index="/fence">租还车</el-menu-item> -->
          </el-submenu>
	    	  <!-- <el-menu-item index="/monitor">监控中心</el-menu-item> -->
	    	  <!-- <el-menu-item index="/track">轨迹管理</el-menu-item> -->
          <!-- <el-menu-item index="/fence">电子围栏</el-menu-item> -->
          <!-- <el-menu-item index="/count">统计分析</el-menu-item> -->
	    	  <!-- <el-menu-item index="/loan">车贷管理</el-menu-item> -->
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
        </div>
      </el-col>
	  </el-row>
  </el-header>
</template>

<script>
export default {
  name: 'top-header',
  data () {
    return {
    	currentPath: this.$route.path,
      username: 'admin'
    }
  },
  mounted() {
  },
  methods:{
  	onMenuSelect(key, keyPath) {
      // console.log(key, keyPath);
      // this.activePath = key
      // localStorage.setItem('currentPath',key)
      // this.$router.push({
      //   path: redirect
      // },()=>{})
    },
    onMenuCommand(item){
      console.log(item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
          /*border-bottom-color: #409EFF!important;*/
          /*background: #e6eff9;*/
        }
        .el-menu-item:focus{
          color: #909399;
        }
        .el-submenu{
          .el-menu-item{
            height: 36px;
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
  
</style>
