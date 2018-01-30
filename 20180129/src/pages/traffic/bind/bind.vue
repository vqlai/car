<style scoped lang="less">
  @import "./bind.less";
</style>
<template>
	<section class="bind">
	  <el-row type="flex" class="top-btns">
      <el-col :span="2" :offset="22"><el-button type="primary" icon="el-icon-plus" @click="onAddClick">添加</el-button></el-col>
      <el-dialog :title="dialogType === 1 ? '新增车辆绑定':'编辑车辆绑定'" :visible.sync="carBindDialog" model="right" width="40%" @close="closeCarBindDialog">
        <el-form :model="formData" label-width="100px" :rules="formRules" ref="carBindForm">
          <el-form-item label="车牌号" prop="vechile_number">
            <el-input v-model="formData.vechile_number" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="序列号" prop="tbox_id">
            <el-input v-model="formData.tbox_id" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="车辆品牌" prop="vehicle_brand">
            <el-input v-model="formData.vehicle_brand" auto-complete="off"></el-input>
          </el-form-item>
          <!--  -->
          <el-form-item label="品牌logo" prop="logoFile">
            <el-upload
              ref="upload"
              :multiple="false"
              :action="uploadPath"
              :data="formData"
              name="logo_file"
              :limit="1"
              :file-list="formData.logoFile"
              list-type="picture-card"
              accept=".jpg, .png"
              :before-upload="beforeUpload"
              :on-change="uploadChange"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
              <div slot="tip">每次只能上传一张jpg/png格式的图片，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="carBindDialog=false">取 消</el-button>
          <el-button type="primary" @click="onSubmitForm">保 存</el-button>
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
        prop="vechile_number"
        label="车牌"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tbox_id"
        label="设备序列号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="vehicle_brand"
        label="车辆品牌">
      </el-table-column>
      <el-table-column
        prop="brand_logo"
        label="品牌logo">
        <template slot-scope="scope">
          <img :src="scope.row.brand_logo" alt="汽车品牌" class="brand-img" v-if="scope.row.brand_logo">
          <span v-else>暂无图片</span>
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
import {getBindCar, addBindCar, deleteBindCar} from '@/api/traffic'
import validator from '@/common/js/validator'
export default {
  name: 'bind',
  data () {
    return {
	    tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: true,
      emptyText: ' ',
      carBindDialog: false,
      dialogType: 1,
      formData: {
        vechile_number: '',
        tbox_id: '',
        vehicle_brand: '',
        logoFile: []
      },
      formRules:{
        vechile_number: [{ required: true, message: '请输入车牌号', trigger: 'blur' }, { validator: validator.checkCarNumber, trigger: 'blur' }],
        tbox_id: [{ required: true, message: '请输入车载盒子序列号', trigger: 'blur' }],
        vehicle_brand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }],
        // logoFile: [{ required: true, message: '请选择图片', trigger: 'change' }]
      },
      fileList: [], // {name:'',url:''}
      uploadPath: '//10.0.0.211:9999/car/add', // '//10.0.0.211:9999/car/add'
      uploadForm: new FormData()
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getBindCar({page: this.currentPage, page_size: this.pageSize})
    })
  },
  methods:{
    _getBindCar(params){
      getBindCar(params).then((res) => {
        // console.log(res)
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
    beforeUpload(file){
      // this.uploadForm.append('logo_file', file)
      // this.uploadForm.append('vechile_number', this.formData.vechile_number)
      // this.uploadForm.append('tbox_id', this.formData.tbox_id)
      // this.uploadForm.append('vehicle_brand', this.formData.vehicle_brand)
      // addBindCar(this.uploadForm).then((res)=>{
      //   console.log(res)
      // })
      return true
    },
    uploadChange(file, fileList){
      console.log(file)
      this.fileList = fileList
    },
    uploadSuccess(response, file, fileList){
      this.loadTableData(response, 1, true)
      this.closeCarBindDialog()
    },
    uploadError(err, file, fileList){
      console.log(err)
      this.$message({
        message: err.data.msg,
        type: 'error'
      })
    },
    onSubmitForm(){
      console.log(this.fileList)
      this.$refs['carBindForm'].validate((valid) => {
        if (valid) {
          // this.$refs.upload.submit()
          if(this.fileList.length === 0){
            // this.uploadForm.append('vechile_number', this.formData.vechile_number)
            // this.uploadForm.append('tbox_id', this.formData.tbox_id)
            // this.uploadForm.append('vehicle_brand', this.formData.vehicle_brand)
            // // this.uploadForm.append('logo_file', '')
            // addBindCar(this.uploadForm).then((res)=>{
            //   this.loadTableData(res, 1)
            //   this.closeCarBindDialog()
            // })
            addBindCar({
              'vechile_number':this.formData.vechile_number,
              'tbox_id': this.formData.tbox_id,
              'vehicle_brand': this.formData.vehicle_brand
            }).then((res)=>{
              this.loadTableData(res, 1, false)
              this.closeCarBindDialog()
            })
          }else{
            this.$refs.upload.submit() // 有图片则上传图片与参数
          }
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    // 重新加载数据 type为1则是新增状态，2为编辑状态，3为删除状态
    // 因element上传数据无法
    loadTableData(res, status, isUpload){
      console.log(res)
      let code = isUpload ? res.ret : res.data.ret
      if(code == 0){
        this.carBindDialog = false
        this._getBindCar({ page: this.currentPage, page_size: this.pageSize })
        let msg = status === 1 ? '新增成功！' : status === 2 ? '修改成功！' : '删除成功！'
        this.$message({
          message: msg,
          type: 'success'
        })
      }else{
        this.$message({
          message: res.data.msg,
          type: 'error'
        })
      }
    },
    closeCarBindDialog(){
      this.$refs.carBindForm.resetFields() // 重置表单
      this.fileList = [] // 重置上传文件列表
    },
    onAddClick(){
      this.carBindDialog = true
    },
    onEditClick(row){
      console.log(row)
    },
    onDeleteClick(row){
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBindCar({vechile_id: row.car_id}).then((res)=>{
          this.loadTableData(res, 3, false)
          // if(res.data.ret == 0){
          //   this._getBindCar({ page: this.currentPage, page_size: this.pageSize })
          //   this.$message({
          //     message: '删除成功！',
          //     type: 'success'
          //   })
          // }else{
          //   this.$message({
          //     message: res.data.msg,
          //     type: 'error'
          //   })
          // }
        })
      })
    },
    // 分页每页显示大小变化事件
    onSizeChange(page){ 
      this.pageSize = page 
      this._getBindCar({page: this.currentPage, page_size: this.pageSize})
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this._getBindCar({page: page, page_size: this.pageSize})
      }
    },
    // 格式化时间
    formatTime(row, column, cellValue){
      return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components:{
  }
}
</script>

