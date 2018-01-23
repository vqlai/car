<style scoped lang="less">
  @import "./website.less";
</style>

<template>
	<section class="website">
		<el-row type="flex" class="top-btns">
      <el-col :span="2" :offset="22"><el-button type="primary" icon="el-icon-plus" @click="onAddWebsiteClick">添加</el-button></el-col>
      <el-dialog :title="dialogType === 1 ? '新增网点':'编辑网点'" :visible.sync="websiteDialog" model="right" width="40%" @close="onCloseWebsiteDialog">
        <el-form :model="formData" label-width="100px" :rules="formRules" ref="websiteForm">
          <el-form-item label="网点名称" prop="name">
            <el-input v-model="formData.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="网点地址" prop="address">
            <el-input v-model="formData.address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formData.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="地理坐标">
            <div class="bdmap"> 
              <map-panel :isNeedMapObj="true" :isNeedControl="false" @sendMapObj="getMapObj"></map-panel>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onResetForm('websiteForm')">取 消</el-button>
          <el-button type="primary" @click="onSubmitForm('websiteForm')">保 存</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :empty-text="emptyText"
      border
      height="531"
      style="width: 100%">
      <el-table-column
        prop="branch_name"
        label="网点名称">
      </el-table-column>
      <el-table-column
        prop="branch_address"
        label="详细地址">
      </el-table-column>
      <el-table-column
        prop="contact_number"
        width="150"
        label="联系电话">
      </el-table-column>
      <el-table-column
        width="180"
        label="地理坐标">
        <template slot-scope="scope">
          <span v-html="scope.row.latitude+','+scope.row.longitude"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="onDeleteClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
	</section>
</template>

<script>
import {getWebsite,addWebsite,deleteWebsite,updateWebsite} from '@/api/traffic'
import mapPanel from '@/components/map-panel'
export default {
  name: 'website',
  data () {
    return {
      tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: true,
      emptyText: ' ',
      mapObj: null,
      dialogType: 1, // 1为新增，2为修改
      websiteDialog: false,
      formData:{
        id: '',
        name: '',
        address: '',
        phone: '',
        lng: 0,
        lat: 0
      },
      formRules:{
        name: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入网点地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      let params = {
        page: this.currentPage,
        page_size: this.pageSize
      }
      this._getWebsite(params)
    })
  },
  methods:{
    _getWebsite(params){
      getWebsite(params).then((res)=>{
        console.log(res)
        this.pageFlag = false
        if(res.data.ret == 0){
          this.currentPage = res.data.datas.cur_page
          this.pageSize = res.data.datas.page_size
          this.total = res.data.datas.item_counts
          this.tableData = [...res.data.datas.list]
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
        this.loading = false // 关闭加载动画
        if(!this.tableData.length) this.emptyText = '暂无数据'
      })
    },
    // 添加网点提交
    onSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.formData.lng && this.formData.lat){
            let params =　{
              branch_name: this.formData.name,
              branch_address: this.formData.address,
              contact_number: this.formData.phone,
              longitude: this.formData.lng,
              latitude: this.formData.lat
            }
            if(this.dialogType === 1){
              addWebsite(params).then((res)=>{
                this.reloadTableData(res)
              })
            }else{
              updateWebsite(Object.assign({branch_id:this.formData.id}, params)).then((res)=>{
                this.reloadTableData(res)
              })
            }
            this.onCloseWebsiteDialog()
          }else{
            this.$message({
            message: '请在地图上定位网点位置！',
            type: 'error'
          })
          }
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    // 重新加载数据
    reloadTableData(res){
      if(res.data.ret == 0){
        this.websiteDialog = false
        this._getWebsite({ page: this.currentPage, page_size: this.pageSize })
      }else{
        this.$message({
          message: res.data.msg,
          type: 'error'
        })
      }
    },
    // 添加网点取消
    onResetForm(formName) {
      this.websiteDialog = false
      this.$refs[formName].resetFields()
    },
    // 弹窗关闭事件
    onCloseWebsiteDialog(){
      this.$refs['websiteForm'].resetFields()
      this.formData.id = ''
      this.formData.lng = ''
      this.formData.lat = ''
      this.mapObj.clearOverlays()
    },
    // 打开新增网点弹窗
    onAddWebsiteClick(){
      this.dialogType = 1
      this.websiteDialog = true
    },
    // 打开编辑网点弹窗
    onEditClick(row){
      // console.log(row)
      this.websiteDialog = true
      this.dialogType = 2
      this.formData.id = row.branch_id
      this.formData.name = row.branch_name
      this.formData.address = row.branch_address
      this.formData.phone = row.contact_number
      this.formData.lng = row.longitude
      this.formData.lat = row.latitude
      setTimeout(()=>{
        let point = new BMap.Point(this.formData.lng, this.formData.lat)
        let marker = new BMap.Marker(point)
        this.mapObj.addOverlay(marker)
        this.mapObj.panTo(point)
      },200)
    },
    onDeleteClick(row){
      console.log(row)
      deleteWebsite({branch_id: row.branch_id}).then((res)=>{
        if(res.data.ret == 0){
          this._getWebsite({ page: this.currentPage, page_size: this.pageSize })
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 分页每页显示大小变化事件
    onSizeChange(page){
      this.pageSize = page 
      this._getWebsite({page: this.currentPage, page_size: this.pageSize})
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this._getWebsite({page: page, page_size: this.pageSize})
      }
    },
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      this.mapObj = map
      map.addEventListener("click", (e) =>{
        map.clearOverlays()
        let marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        this.formData.lng = e.point.lng
        this.formData.lat = e.point.lat
        map.addOverlay(marker)
      })
    },
    // 格式化时间
    formatTime(row, column, cellValue){
      return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components:{
    mapPanel
  }
}
</script>

