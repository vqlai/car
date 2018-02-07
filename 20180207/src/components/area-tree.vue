<template>
  <div class="area-tree" :style="{height: tableHeight+'px'}">
    <el-tree :data="treeData" :props="treeProp" @node-click="onTreeNodeClick" highlight-current></el-tree>
  </div>
</template>

<script>
import treeData from '@/api/tree'
export default {
  name: 'area-tree',
  props: {},
  data () {
    return {
      treeData: treeData,
      // 配置项
      treeProp: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed:{
    // 计算面板高度
    tableHeight: ()=>{
      return window.innerHeight - (60+20+42)
    }
  },
  mounted() {},
  methods:{
    onTreeNodeClick(cNode,pNode) {
      this.$emit("onTreeNodeClick", cNode, pNode)
    }
  }
}
</script>

<style scoped lang="less">
	.area-tree{
    overflow-y: scroll;
  }
</style>
