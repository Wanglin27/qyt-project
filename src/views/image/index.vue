<template>
  <div>
    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <ImageList/>
    </el-card>
  </div>
</template>

<script>
import ImageList from '@/components/image-list'
export default {
  name: 'ImageIndex',
  components: { ImageList },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>

</style>
