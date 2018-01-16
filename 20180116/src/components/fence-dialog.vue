<template>
  <div class="rail-dialog">
    <el-dialog
      title="新建围栏"
      :visible.sync="dialogVisible"
      @open="onDialogOpen"
      width="25%"
      left>
      <el-form :model="dialogForm">
        <el-form-item label="围栏名称：" label-width="100px">
          <el-input v-model="dialogForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型：" label-width="100px">
          圆形
        </el-form-item>
        <el-form-item label="备注：" label-width="100px">
          <el-input v-model="dialogForm.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'rail-dialog',
  props: {
    type: Number,
    dialogVisible: Boolean
  },
  data() {
    return{
      // dialogVisible: false,
      dialogForm: {
        name: '',
        remark: ''
      }
    }
  },
  computed: {
    
  },
  methods: {
    onDialogOpen() {

    }
  }
}
</script>

<style scoped lang="less">
  .rail-dialog{

  }
</style>