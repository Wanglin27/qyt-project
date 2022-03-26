<template>
  <div>
    <div id="he-plugin-standard"></div>
  </div>
</template>

<script>
export default {
  created () {
    window.WIDGET = {
      CONFIG: {
        layout: '1',
        width: '300',
        height: '150',
        background: '1',
        dataColor: 'FFFFFF',
        key: '02cc6fe7c9174b73b511658ffa19b5f0'
      }
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src =
      'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0'
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}
</script>

<style>
</style>
