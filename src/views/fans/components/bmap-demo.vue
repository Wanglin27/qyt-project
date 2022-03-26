<template>
  <div id="container"
       class="bmap-container"></div>
</template>

<script>
export default {
  name: 'bmapDemo',
  mounted () {
    // <!-- 百度地图SDK脚本会暴露一个数据：Bmap  SDK已经在public index.html文件引入了 因为引入script要写在html文件下 -->
    // <!-- 注意 在项目代码中访问第三方数据必须加window -->
    var map = new window.BMap.Map('container')
    var point = new window.BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom(true)
  }
}
</script>

<style lang="less" scoped>
.bmap-container {
  width: 800px;
  height: 600px;
  border: 1px solid gray;
}
</style>
