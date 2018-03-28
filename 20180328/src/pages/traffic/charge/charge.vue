<style scoped lang="less">
  @import "./charge.less";
</style>

<template>
	<section class="charge main-panel">
    <searchBox queryTip="请输入收费方案名称" :addBtn="true" @onSearch="onSearchClick" @onAdd="onAddChargeClick"></searchBox>
    <el-dialog :title="dialogType === 1 ? '新增收费方案':'编辑收费方案'" :visible.sync="chargeDialog" model="right" width="30%" @close="onCloseChargeDialog">
      <el-form :model="formData" label-width="100px" :rules="formRule" ref="chargeForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择收费类型">
            <el-option
              v-for="item in formOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input v-model="formData.price" auto-complete="off"></el-input>
          <span v-html="formData.type==1?'元/公里':formData.type==2?'元/升':'元/日'"></span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chargeDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitForm">保 存</el-button>
      </div>
    </el-dialog>
    <div v-loading="loading" element-loading-text="数据加载中...">
  		<el-table
        :data="tableData"
        :empty-text="emptyText"
        border
        height="531"
        style="width: 100%">
        <el-table-column
          prop="scheme_name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="type"
          width="140"
          :formatter="formatType"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="per_unit"
          width="140"
          :formatter="formatPrice"
          label="金额">
        </el-table-column>
        <el-table-column
          prop="mark"
          label="备注">
        </el-table-column> 
        <el-table-column
          prop="recent_time"
          width="160"
          label="更新时间">
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
import {getCharge,addCharge,deleteCharge,updateCharge} from '@/api/traffic'
import validator from '@/common/js/validator'
import searchBox from '@/components/search-box'
export default {
  name: 'charge',
  data () {
    return {
    	tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: false,
      emptyText: ' ',
      dialogType: 1,
      chargeDialog: false,
      queryText: '',
      formData: {
        id: '', // 存储修改用的id
        name: '',
        type: 1,
        price: '',
        remark: ''
      },
      formRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }, { validator: validator.checkPrice, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      formOption: [{value:1,label:'按每公里里程收费'},{value:2,label:'按每升油耗收费'},{value:3,label:'按每日天数收费'}]
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getCharge()
    })
  },
  methods:{
    // 获取收费列表
    _getCharge(){
      let params = {
        page: this.currentPage,
        page_size: this.pageSize,
        scheme_name: this.queryText
      }
      this.loading = true
      getCharge(params).then((res)=>{
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
    // 表格修改按钮
    onEditClick(row){
      this.chargeDialog = true
      this.dialogType = 2
      this.formData.id = row.charge_scheme_id
      this.formData.name = row.scheme_name
      this.formData.type = row.type
      this.formData.price = row.per_unit
      this.formData.remark = row.mark
    },
    // 表格删除按钮
    onDeleteClick(row){
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCharge({charge_scheme_id: row.charge_scheme_id}).then((res)=>{
          this.loadTableData(res,3)
        })
      })
    },
    // 搜索按钮
    onSearchClick(value){
      this.queryText = value
      if(this.currentPage === 1 ){
        this._getCharge()
      }else{
        // 通过改变页数来触发事件从而进行搜索
        this.currentPage = 1
      }
    },
    // 新增收费弹窗
    onAddChargeClick() {
      this.dialogType = 1
      this.chargeDialog = true
    },
    // 关闭收费弹窗
    onCloseChargeDialog(){
      this.$refs.chargeForm.resetFields()
      this.formData.id = ''
      this.formData.name = ''
      this.formData.type = 1
      this.formData.price = ''
      this.formData.remark = ''
    },
    // 弹窗保存按钮
    onSubmitForm() {
      this.$refs['chargeForm'].validate((valid) => {
        if (valid) {
          let params =　{
            scheme_name: this.formData.name,
            type: this.formData.type,
            per_unit: this.formData.price,
            mark: this.formData.remark
          }
          if(this.dialogType === 1){
            // 新增收费类型
            addCharge(params).then((res)=>{
              this.loadTableData(res, 1)
            })
          }else{
            // 修改收费类型
            updateCharge(Object.assign({charge_scheme_id: this.formData.id}, params)).then((res)=>{
              this.loadTableData(res, 2)
            })
          }
          this.onCloseChargeDialog()
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    // 重新加载数据 type为1则是新增状态，2为编辑状态，3为删除状态
    loadTableData(res, status){
      if(res.data.ret == 0){
        this.chargeDialog = false
        this._getCharge()
        let msg = status === 1 ? '添加成功！' : status === 2 ? '修改成功！' : '删除成功！'
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
    // 分页每页显示大小变化事件
    onSizeChange(size){
      this.pageSize = size 
      this._getCharge()
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this.currentPage = page
        this._getCharge()
      }
    },
    formatType(row, column, cellValue){
      switch(cellValue){
        case 1:
          return '按里程'
          break
        case 2:
          return '按油耗'
          break
        case 3:
          return '按天数'
          break
        default:
          return '-'
      }
    },
    formatPrice(row, column, cellValue){
      switch(row.type){
        case 1:
          return `${cellValue}元/公里`
          break
        case 2:
          return `${cellValue}元/升`
          break
        case 3:
          return `${cellValue}元/日`
          break
        default:
          return '-'
      }
    }
  },
  components:{
    searchBox
  }
}
</script>

