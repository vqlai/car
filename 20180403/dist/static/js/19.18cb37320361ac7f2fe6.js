webpackJsonp([19],{EcCJ:function(e,t){},LuDd:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("aA9S"),o=a.n(n),i=a("IHPB"),r=a.n(i),s=a("8RsO"),l=a("UW1m"),c=a("Rv3D"),d=a("3Ri9"),m={name:"website",data:function(){return{queryText:"",tableData:[],currentPage:1,pageSize:10,total:0,pageFlag:!1,loading:!1,emptyText:" ",mapObj:null,dialogType:1,websiteDialog:!1,formData:{id:"",name:"",address:"",phone:"",lng:0,lat:0},formRules:{name:[{required:!0,message:"请输入网点名称",trigger:"blur"}],address:[{required:!0,message:"请输入网点地址",trigger:"blur"}],phone:[{required:!0,message:"请输入联系电话",trigger:"blur"},{validator:d.a.checkPhone,trigger:"blur"}]}}},mounted:function(){var e=this;this.$nextTick(function(){e._getWebsite()})},methods:{_getWebsite:function(){var e=this,t={page:this.currentPage,page_size:this.pageSize,branch_name:this.queryText};this.loading=!0,Object(s.q)(t).then(function(t){0==t.data.ret?(e.currentPage=t.data.datas.cur_page,e.pageSize=t.data.datas.page_size,e.total=t.data.datas.item_counts,e.tableData=[].concat(r()(t.data.datas.list))):e.$message({message:t.data.msg,type:"error"}),e.pageFlag=!1,e.loading=!1,e.tableData.length||(e.emptyText="暂无数据")})},onSubmitForm:function(){var e=this;this.$refs.websiteForm.validate(function(t){if(!t)return console.log("error submit!!"),!1;if(e.formData.lng&&e.formData.lat){var a={branch_name:e.formData.name,branch_address:e.formData.address,contact_number:e.formData.phone,longitude:e.formData.lng,latitude:e.formData.lat};1===e.dialogType?Object(s.d)(a).then(function(t){e.loadTableData(t,1)}):Object(s.u)(o()({branch_id:e.formData.id},a)).then(function(t){e.loadTableData(t,2)})}else e.$message({message:"请在地图上定位网点位置！",type:"error"})})},loadTableData:function(e,t){if(0==e.data.ret){this.websiteDialog=!1,this._getWebsite();var a=1===t?"添加成功！":2===t?"修改成功！":"删除成功！";this.$message({message:a,type:"success"})}else this.$message({message:e.data.msg,type:"error"})},onCloseWebsiteDialog:function(){this.$refs.websiteForm.resetFields(),this.formData.id="",this.formData.name="",this.formData.address="",this.formData.phone="",this.formData.lng="",this.formData.lat="",this.mapObj.clearOverlays()},onAddWebsiteClick:function(){this.dialogType=1,this.websiteDialog=!0},onEditClick:function(e){var t=this;this.websiteDialog=!0,this.dialogType=2,this.formData.id=e.branch_id,this.formData.name=e.branch_name,this.formData.address=e.branch_address,this.formData.phone=e.contact_number,this.formData.lng=e.longitude,this.formData.lat=e.latitude,setTimeout(function(){var e=new BMap.Point(t.formData.lng,t.formData.lat),a=new BMap.Marker(e);t.mapObj.addOverlay(a),t.mapObj.panTo(e)},200)},onDeleteClick:function(e){var t=this;this.$confirm("此操作将永久删除该行, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){Object(s.j)({branch_id:e.branch_id}).then(function(e){t.loadTableData(e,3)})})},onSearchClick:function(e){this.queryText=e,1==this.currentPage?this._getWebsite():this.currentPage=1},onSizeChange:function(e){this.pageSize=e,this._getWebsite()},onCurrentChange:function(e){this.pageFlag||(this.pageFlag=!0,this.currentPage=e,this._getWebsite())},getMapObj:function(e){var t=this;this.mapObj=e,e.addEventListener("click",function(a){e.clearOverlays();var n=new BMap.Marker(new BMap.Point(a.point.lng,a.point.lat));t.formData.lng=a.point.lng,t.formData.lat=a.point.lat,e.addOverlay(n)})}},components:{mapPanel:l.a,searchBox:c.a}},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",{staticClass:"website main-panel"},[a("searchBox",{attrs:{queryTip:"请输入网点名称或地址",addBtn:!0},on:{onSearch:e.onSearchClick,onAdd:e.onAddWebsiteClick}}),e._v(" "),a("el-dialog",{attrs:{title:1===e.dialogType?"新增网点":"编辑网点",visible:e.websiteDialog,model:"right",width:"40%"},on:{"update:visible":function(t){e.websiteDialog=t},close:e.onCloseWebsiteDialog}},[a("el-form",{ref:"websiteForm",attrs:{model:e.formData,"label-width":"100px",rules:e.formRules}},[a("el-form-item",{attrs:{label:"网点名称",prop:"name"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.formData.name,callback:function(t){e.$set(e.formData,"name",t)},expression:"formData.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"网点地址",prop:"address"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.formData.address,callback:function(t){e.$set(e.formData,"address",t)},expression:"formData.address"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"联系电话",prop:"phone"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.formData.phone,callback:function(t){e.$set(e.formData,"phone",t)},expression:"formData.phone"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"地理坐标"}},[a("div",{staticClass:"bdmap"},[a("map-panel",{attrs:{isNeedMapObj:!0,isNeedControl:!1},on:{sendMapObj:e.getMapObj}})],1)])],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.websiteDialog=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.onSubmitForm}},[e._v("保 存")])],1)],1),e._v(" "),a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{"element-loading-text":"数据加载中..."}},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"empty-text":e.emptyText,border:"",height:"531"}},[a("el-table-column",{attrs:{prop:"branch_name",label:"网点名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"branch_address",label:"详细地址"}}),e._v(" "),a("el-table-column",{attrs:{prop:"contact_number",width:"150",label:"联系电话"}}),e._v(" "),a("el-table-column",{attrs:{width:"180",label:"地理坐标"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{domProps:{innerHTML:e._s(t.row.latitude+","+t.row.longitude)}})]}}])}),e._v(" "),a("el-table-column",{attrs:{width:"100",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.onEditClick(t.row)}}},[e._v("编辑")]),e._v(" "),a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){e.onDeleteClick(t.row)}}},[e._v("删除")])]}}])})],1)],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.currentPage,"page-sizes":[10,20,30,40],"page-size":e.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.onSizeChange,"current-change":e.onCurrentChange}})],1)},staticRenderFns:[]};var g=a("Z0/y")(m,u,!1,function(e){a("EcCJ")},"data-v-474245c1",null);t.default=g.exports}});
//# sourceMappingURL=19.18cb37320361ac7f2fe6.js.map