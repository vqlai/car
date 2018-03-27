<style scoped lang="less">
  @import "./rental.less";
</style>

<template>
	<section class="rental">
    <searchBox @onSearch="onSearchClick" :queryTwo="true" :addBtn="true" @onAdd="onAddRentalClick" :queryDate="true" :exportBtn="true" @onExport="onExportClick"></searchBox>
    <el-dialog title="新增租车" :visible.sync="rentalDialog" model="right" width="30%" @close="onCloseRentalDialog">
      <el-form :model="formData" label-width="100px" :rules="formRule" ref="rentalForm">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="identity">
          <el-input v-model="formData.identity" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证" prop="licence">
          <el-input v-model="formData.licence" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="carId">
          <el-select v-model="formData.carId" placeholder="请选择租用车牌号" filterable @change="onLoadOriginValByCar">
            <el-option
              v-for="item in carOption"
              :key="item.car_id"
              :label="item.vehicle_number"
              :value="item.car_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费方式" prop="chargeType">
          <el-select v-model="formData.chargeType" placeholder="请选择收费方式" filterable @change="onLoadOriginValByType">
            <el-option
              v-for="item in chargeOption"
              :key="item.charge_scheme_id"
              :label="item.scheme_name"
              :value="item.charge_scheme_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="originValType===1?'起始里程':'起始油耗'" prop="originVal" v-if="formData.chargeType && originValType !== 3">
          <el-input v-model="formData.originVal" auto-complete="off"></el-input>
          <span>{{originValType===1?'公里':'升'}}</span>
        </el-form-item>
        <el-form-item label="起始时间" v-if="formData.chargeType && originValType === 3"
        prop="originTime">
          <el-date-picker
            :clearable="false"
            v-model="formData.originTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="timestamp"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rentalDialog=false">取 消</el-button>
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
          prop="order_number"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="vehicle_number"
          width="80" 
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="vehicle_brand"
          width="120"
          label="车辆品牌">
        </el-table-column>
        <el-table-column
          prop="id_card"
          label="身份证号">
        </el-table-column>
        <el-table-column
          prop="driver_card"
          label="驾驶证号">
        </el-table-column> 
        <el-table-column
          prop="phone_number"
          width="100" 
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="charge_type"
          :formatter="formatCharge"
          label="收费方式">
        </el-table-column>
        <el-table-column
          prop="charge"
          width="100"
          label="当前费用">
          <template slot-scope="scope">
            <span>{{scope.row.charge?`${scope.row.charge}元`:`-`}}</span>
          </template>
        </el-table-column> 
        <el-table-column
          prop="state"
          width="80"
          :formatter="formatStatus"
          label="租凭状态">
        </el-table-column> 
        <el-table-column
          prop="start_time"
          width="150"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="end_time"
          width="150"
          label="结束时间">
        </el-table-column>
        <el-table-column
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state===1" @click="onReturnCarClick(scope.row)" type="text" size="small" >还车</el-button>
            <el-button type="text" size="small" v-if="scope.row.state===2" @click="onModifyCharge(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="还车"
      :visible.sync="returnCarDialog"
      width="30%">
      <div v-if="returnCarInfo">
        <p>开始租车时间：{{returnCarInfo.start_time}}</p>
        <p>结束租车时间：{{returnCarInfo.end_time}}</p>
        <p>计费方式：{{returnCarInfo.charge_type}}</p>
        <!-- <p>计费方式：{{returnCarInfo.charge_type==1?'按公里数收费':returnCarInfo.charge_type==2?'按油耗收费':'按天数收费'}}</p> -->
        <p>收费金额：{{returnCarInfo.charge}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="returnCarDialog = false">取 消</el-button>
        <el-button type="primary" @click="comfirmReturnClick">确 定</el-button>
      </span>
    </el-dialog>
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
import {getRental,getCarAndCharge,createRentCar,getReturnCarInfo,comfirmReturnCar,modifyCarFee,getCarOriginVal} from '@/api/traffic'
import validator from '@/common/js/validator'
import searchBox from '@/components/search-box'
export default {
  name: 'rental',
  data () {
    return {
    	tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: false,
      emptyText: ' ',
      rentalDialog: false,
      returnCarDialog: false,
      formData: { phone: '', identity: '', licence: '', carId:'', chargeType:'',originVal: '',originTime: null},
      formRule: {
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' },{ validator: validator.checkPhone, trigger: 'blur' }],
        identity: [{ required: true, message: '请输入身份证', trigger: 'blur' },{ validator: validator.checkIdentity, trigger: 'blur' }],
        licence: [{ required: true, message: '请输入驾驶证', trigger: 'blur' },{ validator: validator.checkLicence, trigger: 'blur' }],
        carId: [{ required: true, message: '请选择车牌号', trigger: 'change' }],
        chargeType: [{ required: true, message: '请选择收费方式', trigger: 'change' }],
        originVal: [{ required: true, message: '请输入收费方式开始值', trigger: 'blur' },{ validator: validator.checkOriginVal, trigger: 'blur' }],
        originTime:[{ required: true, message: '请选择起始时间', trigger: 'blur' }]
      },
      carOption: [],
      chargeOption: [],
      originValType: 1,
      returnCarInfo: null,
      queryText1: '',
      queryText2: '',
      queryStartTime: '',
      queryEndTime: ''
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getRental()
    })
  },
  methods:{
    // 获取汽车租赁列表
    _getRental(){
      let params = {
        page: this.currentPage,
        page_size: this.pageSize,
        vehicle_number: this.queryText1, 
        phone_number: this.queryText2,
        start_time: this.queryStartTime,
        end_time: this.queryEndTime
      }
      this.loading = true
      getRental(params).then((res)=>{
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
    // 搜索
    onSearchClick(value1, value2, value3){
      this.queryText1 = value1
      this.queryText2 = value2
      if(value3){
        this.queryStartTime = value3[0]
        this.queryEndTime = value3[1]
      }else{
        this.queryStartTime = ''
        this.queryEndTime = ''
      }
      if(this.currentPage === 1 ){
        this._getRental()
      }else{
        // 通过改变页数来触发事件从而进行搜索
        this.currentPage = 1
      }
    },
    // 下拉框改变获取到起始值
    onLoadOriginValByCar(val){
      if(this.formData.carId && this.formData.chargeType){
        this._getCarOriginVal({car_id: this.formData.carId,charge_scheme_id: this.formData.chargeType})
      }
    },
    onLoadOriginValByType(val){
      for(let item of this.chargeOption){
        if(item.charge_scheme_id == val){
          this.originValType = item.type
        }
      }
      if(this.formData.carId && this.formData.chargeType){
        this._getCarOriginVal({car_id: this.formData.carId,charge_scheme_id: this.formData.chargeType})
      }
    },
    _getCarOriginVal(params){
      getCarOriginVal(params).then(res=>{
        if(res.data.ret == 0){
          if(this.originValType === 3){
            this.formData.originTime = new Date(res.data.datas.unit_value)
          }else{
            this.formData.originVal = res.data.datas.unit_value
          }
        }
      })
    },
    // 导出
    onExportClick(){
      location.href = `${process.env.BASE_API}/orders/export?vehicle_number=${this.queryText1}&phone_number=${this.queryText2}&start_time=${this.queryStartTime}&end_time=${this.queryEndTime}`
    },
    // 打开新增租车弹窗
    onAddRentalClick(){
      this.rentalDialog = true
      if(!this.carOption.length && !this.chargeOption.length){
        getCarAndCharge().then((res)=>{
          if(res.data.ret == 0){
            this.carOption = res.data.datas.catList
            this.chargeOption = res.data.datas.chargeSchemeList
          }
        })
      }
    },
    // 关闭新增租车弹窗
    onCloseRentalDialog(){
      this.$refs.rentalForm.resetFields() // 重置表单
    },
    onSubmitForm(){
      this.$refs['rentalForm'].validate((valid) => {
        if (valid) {
          let params =　{
            phone_number: this.formData.phone,
            id_card: this.formData.identity,
            driver_card: this.formData.licence,
            car_id: this.formData.carId,
            charge_scheme_id  : this.formData.chargeType,
            init_value: this.originValType===3? this.formData.originTime/1000:this.formData.originVal
          }
          createRentCar(params).then((res)=>{
            this.loadTableData(res,1)
          })
          this.onCloseRentalDialog()
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    // 还车信息回显
    onReturnCarClick(row){
      getReturnCarInfo({orders_id: row.orders_id}).then((res)=>{
        if(res.data.ret == 0){
          this.returnCarInfo = res.data.datas
          this.returnCarInfo.charge_type = this.returnCarInfo.charge_type==1?'按公里数收费':this.returnCarInfo.charge_type==2?'按油耗收费':'按天数收费'
          this.returnCarDialog = true
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 确定还车
    comfirmReturnClick(){
      comfirmReturnCar({orders_id: this.returnCarInfo.orders_id}).then((res)=>{
        this.loadTableData(res,2)
      })
    },
    // 结算价格修改
    onModifyCharge(row){
      this.$prompt('请输入金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
        inputErrorMessage: '金额格式不正确'
      }).then(({ value }) => {
        modifyCarFee({orders_id: row.orders_id,charge:value}).then(res=>{
          this.loadTableData(res,4)
        })
      }).catch(() => {
        console.log('close') 
      })             
    },
    // 重新加载数据 type为1则是新增状态，2为编辑状态，3为删除状态，4为费用修改成功
    loadTableData(res, status){
      if(res.data.ret == 0){
        this.rentalDialog = false
        this.returnCarDialog = false
        this._getRental()
        let msg = ''
        if(status === 1){
          msg = '添加成功！'
        }else if(status === 2){
          msg = '还车成功！'
        }else if(status === 3){
          msg = '删除成功！'
        }else if(status === 4){
          msg = '费用修改成功！'
        }else{}
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
      this._getRental()
    },
    // 当前页数变化事件
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this.currentPage = page
        this._getRental()
      }
    },
    formatCharge(row, column, cellValue){
      switch(cellValue){
        case 1:
          return `按里程，${row.per_unit}元/公里`
          break
        case 2:
          return `按油耗，${row.per_unit}元/升`
          break
        case 3:
          return `按天数，${row.per_unit}元/日`
          break
        default:
          return '-'
      }
    },
    formatStatus(row, column, cellValue){
      switch(cellValue){
        case 1:
          return `已出租`
          break
        case 2:
          return `支付中`
          break
        case 3:
          return `已还车`
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

