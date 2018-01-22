<style scoped lang="less">
  @import "./website.less";
</style>

<template>
	<section class="website">
		<el-row type="flex" class="top-btns">
      <el-col :span="2" :offset="22"><el-button type="primary" icon="el-icon-plus" @click="onAddWebsiteClick">添加</el-button></el-col>
      <el-dialog title="新增网点" :visible.sync="addWebsiteDialog" model="right" width="40%">
        <el-form :model="formData" label-width="100px" :rules="formRules"  ref="websiteForm">
          <el-form-item label="网点名称" prop="name">
            <el-input v-model="formData.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="网点地址" prop="address">
            <el-input v-model="formData.address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formData.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="地理坐标" prop="desc">
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
      height="600"
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
        width="150"
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
import {getWebsite,addWebsite,deleteWebsite} from '@/api/traffic'
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
      loading: false,
      emptyText: '',
      addWebsiteDialog: false,
      formData:{
        name: '',
        address: '',
        phone: '',
        lng: 0,
        lat: 0
      },
      formRules:{
        name: [
          { required: true, message: '请输入网点名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入网点地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
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
    onSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.formData)
          if(this.formData.lng && this.formData.lat){
            let params =　{
              branch_name: this.formData.name,
              branch_address: this.formData.address,
              contact_number: this.formData.phone,
              longitude: this.formData.lng,
              latitude: this.formData.lat
            }
            addWebsite(params).then((res)=>{
              // console.log(res)
              if(res.data.ret == 0){
                this.addWebsiteDialog = false
                this._getWebsite({ page: this.currentPage, page_size: this.pageSize })
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
              
            })
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
    onResetForm(formName) {
      this.addWebsiteDialog = false
      this.$refs[formName].resetFields()
    },
    onAddWebsiteClick(){
      this.addWebsiteDialog = true
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
    // 格式化时间
    formatTime(row, column, cellValue){
      return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    },
    onEditClick(row){
      console.log(row)
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
    // 获取地图组件传递来的地图对象
    getMapObj(map){
      map.addEventListener("click", (e) =>{
        map.clearOverlays()
        let marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        this.formData.lng = e.point.lng
        this.formData.lat = e.point.lat
        map.addOverlay(marker)
      })
    }
  },
  components:{
    mapPanel
  }
}
</script>

