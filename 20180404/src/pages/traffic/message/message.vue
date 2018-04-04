<style scoped lang="less">
  @import "./message.less";
</style>

<template>
	<section class="message main-panel">
    <searchBox queryTip="请输入标题" :addBtn="true" @onSearch="onSearchClick" @onAdd="onAddClick"></searchBox>
    <el-dialog title="新增公告" :visible.sync="msgDialog" model="right" width="30%" @close="onCloseMsgDialog">
      <el-form :model="formData" label-width="60px" :rules="formRules" ref="msgForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" auto-complete="off" :maxlength="20" placeholder="请输入不多于20个文字的标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="formData.content" :maxlength="200" auto-complete="off" :autosize="{ minRows: 8, maxRows: 10 }" placeholder="请输入不多于200个文字的内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitForm">保 存</el-button>
      </div>
    </el-dialog>
    <div v-loading="loading" element-loading-text="数据加载中...">
      <el-table
        :data="tableData"
        :empty-text="tableEmptyText"
        border
        height="531"
        style="width: 100%">
        <el-table-column
          prop="title"
          width="200"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容">
          <!-- <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="publish_time"
          width="180"
          label="发布时间">
        </el-table-column>
        <el-table-column
          width="80"
          label="操作">
          <template slot-scope="scope">
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
import { getMsg, addMsg, deleteMsg } from '@/api/traffic'
import searchBox from '@/components/search-box'
export default {
  name: 'message',
  data () {
    return {
    	queryText: '',
      tableData: [], 
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      total: 0, // 总记录数
      pageFlag: false, // 防止分页快速点击bug
      loading: false,
      tableEmptyText: ' ',
      msgDialog: false,
      formData:{
        title: '',
        content:''
      },
      formRules:{
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this._getMsg()
    })
  },
  methods:{
    _getMsg(){
      let params = {
        page: this.currentPage,
        page_size: this.pageSize,
        content: this.queryText
      }
      this.loading = true
      getMsg(params).then(res=>{
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
        this.pageFlag = false
        this.loading = false // 关闭加载动画
        if(!this.tableData.length) this.tableEmptyText = '暂无数据'
      })
    },
    onSizeChange(size){
      this.pageSize = size 
      this._getMsg()
    },
    onCurrentChange(page){
      if(!this.pageFlag){
        this.pageFlag = true
        this.currentPage = page
        this._getMsg()
      }
    },
    onSearchClick(value){
      this.queryText = value
      if(this.currentPage == 1){
        this._getMsg()
      }else{
        this.currentPage = 1
      }
    },
    onAddClick(){
      this.msgDialog = true
    },
    onCloseMsgDialog(){
      this.$refs['msgForm'].resetFields()
    },
    onSubmitForm(){
      this.$refs['msgForm'].validate((valid) => {
        if (valid) {
          console.log(this.formData)
          addMsg(this.formData).then((res)=>{
            this.loadTableData(res, 1)
          })
        } else {
          this.$message({
            message: '请正确输入完成后再提交表单！',
            type: 'error'
          })
          return false
        }
      })
    },
    onDeleteClick(row){
      this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMsg({notice_id: row.system_notice_id}).then((res)=>{
          this.loadTableData(res, 2)
        })
      })
    },
    loadTableData(res, status){
      if(res.data.ret == 0){
        this.msgDialog = false
        this._getMsg()
        let msg = status === 1 ? '添加成功！' : '删除成功！'
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
    }
  },
  components:{
    searchBox
  }
}
</script>

