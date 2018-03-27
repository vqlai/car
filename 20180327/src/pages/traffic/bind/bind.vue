<style scoped lang="less">
  @import "./bind.less";
</style>
<template>
	<section class="bind">
    <searchBox :addBtn="true" @onSearch="onSearchClick" @onAdd="onAddClick"></searchBox>
    <el-dialog :title="dialogType === 1 ? '新增车辆绑定':'编辑车辆绑定'" :visible.sync="carBindDialog" model="right" width="40%" @close="closeCarBindDialog">
      <el-form :model="formData" label-width="100px" :rules="formRules" ref="carBindForm">
        <el-form-item label="车牌号" prop="vehicle_number">
          <el-input v-model="formData.vehicle_number" auto-complete="off" :readonly="dialogType===1? false:true"></el-input>
        </el-form-item>
        <el-form-item label="序列号" prop="tbox_id">
          <el-input v-model="formData.tbox_id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="vehicle_brand">
          <el-input v-model="formData.vehicle_brand" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始公里数" prop="initial_mile">
          <el-input v-model="formData.initial_mile" auto-complete="off" :maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoFile">
          <el-upload
            ref="upload"
            :multiple="false"
            :action="uploadPath"
            :data="formData"
            name="logo_file"
            :headers="headers"
            :limit="1"
            :class="{hiddenUploadBtn: hiddenUploadBtn}"
            :file-list="formData.logoFile"
            list-type="picture-card"
            accept=".jpg, .png"
            :before-upload="beforeUpload"
            :on-change="uploadChange"
            :on-remove="uploadRemove"
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
    <div v-loading="loading" element-loading-text="数据加载中...">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        border
        height="532"
        style="width: 100%">
        <el-table-column
          prop="vehicle_number"
          label="车牌"
          width="200">
        </el-table-column>
        <el-table-column
          prop="tbox_id"
          label="设备序列号"
          width="300">
        </el-table-column>
        <el-table-column
          prop="vehicle_brand"
          label="车辆品牌">
        </el-table-column>
        <el-table-column
          prop="brand_logo"
          label="品牌logo">
          <template slot-scope="scope">
            <img :src="baseApiPath+scope.row.brand_logo" alt="汽车品牌" class="brand-img" v-if="scope.row.brand_logo">
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="onEditClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onDeleteClick(scope.row)" v-if="scope.row.state === 1" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import {getCarList} from '@/api/drive'
import {addBindCar, updateBindCar, deleteBindCar} from '@/api/traffic'
import validator from '@/common/js/validator'
import searchBox from '@/components/search-box'
export default {
  name: 'bind',
  data () {
    return {
	    tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: false,
      emptyText: ' ',
      carBindDialog: false,
      dialogType: 1,
      queryText: '', // 搜索车牌号
      formData: {
        vehicle_id: '',
        vehicle_number: '',
        tbox_id: '',
        vehicle_brand: '',
        initial_mile: '',
        logoFile: [] // {name:'',url:''}
      },
      formRules:{
        vehicle_number: [{ required: true, message: '请输入车牌号', trigger: 'blur' }, { validator: validator.checkCarNumber, trigger: 'blur' }],
        tbox_id: [{ required: true, message: '请输入车载盒子序列号', trigger: 'blur' }],
        vehicle_brand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }],
        initial_mile: [{ required: true, message: '请输入初始公里数', trigger: 'blur' }, { validator: validator.checkOriginMile, trigger: 'blur' }]
        // logoFile: [{ required: true, message: '请选择图片', trigger: 'change' }]
      },
      headers: {Authorization: window.sessionStorage.getItem('token')},
      hasFile: false, // 判断是否有文件 
      // 从webpack配置自动获取到当前环境
      // let baseUrl = process.env.BASE_API
      baseApiPath: `${process.env.BASE_API}/`,
      uploadPath: `${process.env.BASE_API}/car/add`, // 图片上传路径
      // uploadForm: new FormData(),
      hiddenUploadBtn: false // 是否隐藏上传按钮
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getCarList()
    })
  },
  methods:{
    _getCarList(){
      let params = {
        page: this.currentPage, 
        page_size: this.pageSize,
        vehicle_number: this.queryText
      }
      this.loading = true
      getCarList(params).then((res) => {
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
      // this.uploadForm.append('vehicle_number', this.formData.vehicle_number)
      // this.uploadForm.append('tbox_id', this.formData.tbox_id)
      // this.uploadForm.append('vehicle_brand', this.formData.vehicle_brand)
      // addBindCar(this.uploadForm).then((res)=>{
      //   console.log(res)
      // })
      return true
    },
    uploadChange(file, fileList){
      // console.log(fileList)
      if(fileList.length){
        this.hasFile = true
        this.hiddenUploadBtn = true
      }
    },
    uploadRemove(file, fileList){
      // console.log(file)
      if(file.name){
        this.hiddenUploadBtn = false
      }
    },
    uploadSuccess(response, file, fileList){
      this.dialogType === 1 ? this.loadTableData(response, 1, true) : this.loadTableData(response, 2, true) 
      this.closeCarBindDialog()
    },
    uploadError(err, file, fileList){
      this.$message({
        message: err.data.msg,
        type: 'error'
      })
    },
    onSubmitForm(){
      // console.log(this.formData.logoFile)
      this.$refs['carBindForm'].validate((valid) => {
        if (valid) {
          if(!this.hasFile){
            if(this.dialogType === 1){
              addBindCar({
                'vehicle_number': this.formData.vehicle_number,
                'tbox_id': this.formData.tbox_id,
                'vehicle_brand': this.formData.vehicle_brand,
                'initial_mile': this.formData.initial_mile
              }).then((res)=>{
                this.loadTableData(res, 1, false)
                this.closeCarBindDialog()
              })
            }else{
              updateBindCar({
                'vehicle_id': this.formData.vehicle_id,
                'vehicle_number': this.formData.vehicle_number,
                'tbox_id': this.formData.tbox_id,
                'vehicle_brand': this.formData.vehicle_brand,
                'initial_mile': this.formData.initial_mile
              }).then((res)=>{
                this.loadTableData(res, 2, false)
                this.closeCarBindDialog()
              })
            }
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
    // 因element图片上传无法使用axios，而axios是对响应多封装了一层data，故处理结果不同 
    loadTableData(res, status, isUpload){
      // console.log(res)
      let code = isUpload ? res.ret : res.data.ret
      if(code == 0){
        this.carBindDialog = false
        this._getCarList({ page: this.currentPage, page_size: this.pageSize, vehicle_number: this.queryText})
        let msg = status === 1 ? '新增成功！' : status === 2 ? '修改成功！' : '删除成功！'
        this.$message({
          message: msg,
          type: 'success'
        })
      }else{
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 添加
    onAddClick(){
      this.dialogType = 1
      this.carBindDialog = true
      this.hiddenUploadBtn = false // 打开图片添加按钮
      this.uploadPath= `${this.baseApiPath}car/add` // 新增图片路径
    },
    // 搜索
    onSearchClick(value){
      this.queryText = value
      if(this.currentPage === 1 ){
        this._getCarList()
      }else{
        // 通过改变页数来触发事件从而进行搜索
        this.currentPage = 1
      }
    },
    // 编辑
    onEditClick(row){
      // console.log(row)
      this.formData.vehicle_id = row.car_id
      this.formData.vehicle_number = row.vehicle_number
      this.formData.tbox_id = row.tbox_id
      this.formData.vehicle_brand = row.vehicle_brand
      this.formData.initial_mile = parseInt(row.initial_mile/1000)
      if(row.brand_logo){
        this.formData.logoFile = [{name:'edit', url:`${this.baseApiPath}${row.brand_logo}`}]
        this.hiddenUploadBtn = true // 关闭图片添加按钮
      }else{
        this.formData.logoFile = []
        this.hiddenUploadBtn = false // 打开图片添加按钮
      }
      this.dialogType = 2
      this.carBindDialog = true
      this.uploadPath= `${this.baseApiPath}car/update` // 更新图片路径
    },
    // 窗口关闭重置窗口
    closeCarBindDialog(){
      this.$refs['carBindForm'].resetFields() // 重置表单移除校验结果
      this.$refs.upload.clearFiles()
      this.hasFile = false // 重置有无图片状态
      this.formData.vehicle_id = null
      this.formData.vehicle_number = ''
      this.formData.tbox_id = ''
      this.formData.vehicle_brand = ''
      this.formData.initial_mile = ''
      this.formData.logoFile = []
    },
    onDeleteClick(row){
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBindCar({vehicle_id: row.car_id}).then((res)=>{
          this.loadTableData(res, 3, false)
        })
      })
    },
    // 分页每页显示大小变化事件
    onSizeChange(size){ 
      this.pageSize = size 
      this._getCarList()
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this.currentPage = page
        this._getCarList()
      }
    },
    // 格式化时间
    // formatTime(row, column, cellValue){
    //   return moment.unix(cellValue/1000).format('YYYY-MM-DD HH:mm:ss')
    // }
  },
  components:{
    searchBox
  }
}
</script>

