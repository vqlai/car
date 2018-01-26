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
          <el-form-item label="品牌logo" prop="logo">
            <el-upload
              ref="upload"
              :multiple="false"
              :action="uploadPath"
              :limit="1"
              :data="formData"
              name="logo_file"
              :file-list="fileList"
              list-type="picture-card"
              accept=".jpg, .png"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-change="uploadChange"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">每次只能上传一张jpg/png格式的图片，且不超过500kb</div>
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
      },
      formRules:{
        vechile_number: [{ required: true, message: '请输入车牌号', trigger: 'blur' }, { validator: validator.checkCarNumber, trigger: 'blur' }],
        tbox_id: [{ required: true, message: '请输入车载盒子序列号', trigger: 'blur' }],
        vehicle_brand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }]
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
      this.uploadForm.append('logo_file', file)
      this.uploadForm.append('vechile_number', this.formData.number)
      this.uploadForm.append('tbox_id', this.formData.id)
      this.uploadForm.append('vehicle_brand', this.formData.brand)
      // console.log(this.uploadForm)
      addBindCar(this.uploadForm).then((res)=>{
        console.log(res)
      })
      return true
    },
    uploadChange(file, fileList){
      // this.fileList = []
      console.log(fileList)
      // this.disabledUpload = fileList.length ?  true : false
      // this.uploadForm.append('logo_file', file)
      // console.log(this.uploadForm)
    },
    uploadSuccess(response, file, fileList){
      console.log(response)
    },
    uploadError(err, file, fileList){
      console.log(err)
    },
    onSubmitForm(){
      // console.log(this.formData)
      // this.$refs.upload.submit()
      this.$refs['carBindForm'].validate((valid) => {
        if (valid) {
          addBindCar({vechile_number: this.formData.vechile_number,tbox_id: this.formData.tbox_id,vehicle_brand: this.formData.vehicle_brand}).then((res)=>{
            if(res.data.ret == 0){
              this.carBindDialog = false
              this._getBindCar({ page: this.currentPage, page_size: this.pageSize })
              this.$message({
                message: '添加成功！',
                type: 'success'
              })
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
            this.closeCarBindDialog()
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    closeCarBindDialog(){
      this.$refs.carBindForm.resetFields()
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
          if(res.data.ret == 0){
            this._getBindCar({ page: this.currentPage, page_size: this.pageSize })
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

