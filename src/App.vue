<template>
  <div id="app">
    <h1>我的第一个Vue项目</h1>
    <!-- 路由出口 -->
    <router-view />
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success"
               round>成功按钮</el-button>

    <el-input-number v-model="num"
                     @change="handleChange"
                     :min="1"
                     :max="10"
                     label="描述文字"></el-input-number>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      num: 6
    }
  }
}
</script>

<style lang="less">
</style>
