webpackJsonp([7],{"3cXf":function(e,t,a){e.exports={default:a("4rP4"),__esModule:!0}},"4rP4":function(e,t,a){var n=a("UusJ"),o=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(e){return o.stringify.apply(o,arguments)}},OUYt:function(e,t){},YQs5:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("3cXf"),o=a.n(n),l={name:"state",data:function(){return{carText:"请在表格选择需要监测的车牌号",carNumber:"",voltage:"",speed:"",temp:"",lnglat:"",location:"",doorState:"",winState:"",monitorTime:"",stompClient:null,loading:!1,loadingText:"正在获取最新数据，请稍后..."}},mounted:function(){setTimeout(function(){},20)},methods:{onReload:function(){this.carNumber?this.onSendMsg():this.$message({message:"请选择在线的设备进行远程控制",type:"error"})},onSendMsg:function(){var e=this;if(!this.stompClient||!this.stompClient.connected){var t=new SockJS("//iotsvr.he-live.com:8002/my-websocket"),a=window.sessionStorage.getItem("userid");this.stompClient=Stomp.over(t),this.stompClient.connect({},function(t){e.stompClient.subscribe("/topic/web/"+a+"/vehicle_manager_info",function(t){console.log(t),e.stompClient.disconnect();var a=JSON.parse(t.body);0==a.ret?(e.voltage=a.datas.battery_voltage,e.speed=a.datas.engine_speed,e.temp=a.datas.water_tem,e.lnglat=a.datas.lng+"，"+a.datas.lat,e.location=a.datas.location,e.monitorTime=a.datas.pos_update_time,e.doorState=1==a.datas.door_state?"车门已打开":"车门已关闭",e.winState=1==a.datas.wind_state?"车窗已打开":"车窗已关闭",e.loading=!1):(e.$confirm("获取最新车况失败，再试一次?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.onSendMsg()}),e.loading=!1)}),e.stompClient.send("/web/vehicle_state",{},o()({vehicle_number:e.carNumber,user_id:a}))})}this.loading=!0},onCarTableCellClick:function(e,t,a,n){console.log(e),e.is_online?(this.carNumber=e.vehicle_number,this.carText="当前车牌号："+e.vehicle_number,this.onSendMsg()):this.$message({message:"请选择在线的设备进行远程控制",type:"error"})}},components:{carTable:a("egIO").a}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",{staticClass:"state"},[a("el-container",[a("el-main",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{"element-loading-text":e.loadingText,"element-loading-background":"rgba(255, 255, 255, 0.4)"}},[a("div",{staticClass:"info-box"},[a("p",{staticClass:"car-text"},[e._v(e._s(e.carText))]),e._v(" "),a("ul",[a("li",[a("span",[e._v("电瓶电压：")]),a("el-input",{attrs:{placeholder:"电瓶电压",readonly:""},model:{value:e.voltage,callback:function(t){e.voltage=t},expression:"voltage"}})],1),e._v(" "),a("li",[a("span",[e._v("发动机转速：")]),a("el-input",{attrs:{placeholder:"发动机转速",readonly:""},model:{value:e.speed,callback:function(t){e.speed=t},expression:"speed"}})],1),e._v(" "),a("li",[a("span",[e._v("冷却液温度：")]),a("el-input",{attrs:{placeholder:"水温",readonly:""},model:{value:e.temp,callback:function(t){e.temp=t},expression:"temp"}})],1),e._v(" "),a("li",[a("span",[e._v("经纬度：")]),a("el-input",{attrs:{placeholder:"经纬度",readonly:""},model:{value:e.lnglat,callback:function(t){e.lnglat=t},expression:"lnglat"}})],1),e._v(" "),a("li",[a("span",[e._v("实时位置：")]),a("el-input",{attrs:{placeholder:"实时位置",readonly:""},model:{value:e.location,callback:function(t){e.location=t},expression:"location"}})],1),e._v(" "),a("li",[a("span",[e._v("车门状态：")]),a("el-input",{attrs:{placeholder:"车门状态",readonly:""},model:{value:e.doorState,callback:function(t){e.doorState=t},expression:"doorState"}})],1),e._v(" "),a("li",[a("span",[e._v("车窗状态：")]),a("el-input",{attrs:{placeholder:"车窗状态",readonly:""},model:{value:e.winState,callback:function(t){e.winState=t},expression:"winState"}})],1),e._v(" "),a("li",[a("span",[e._v("监测时间：")]),a("el-input",{attrs:{placeholder:"监测时间",readonly:""},model:{value:e.monitorTime,callback:function(t){e.monitorTime=t},expression:"monitorTime"}})],1)]),e._v(" "),a("div",{staticClass:"btn-box"},[a("el-button",{attrs:{type:"primary"},on:{click:e.onReload}},[e._v("刷新")])],1)])]),e._v(" "),a("el-aside",{attrs:{width:"320px"}},[a("el-tabs",{attrs:{type:"border-card"}},[a("el-tab-pane",{attrs:{label:"车辆列表"}},[a("carTable",{on:{onCarTableCellClick:e.onCarTableCellClick}})],1)],1)],1)],1)],1)},staticRenderFns:[]};var s=a("Z0/y")(l,i,!1,function(e){a("OUYt")},"data-v-165b042e",null);t.default=s.exports}});
//# sourceMappingURL=7.301a535bdc3bf068ded8.js.map