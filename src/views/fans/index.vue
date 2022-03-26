<template>
  <!-- 1.在绘图前我们需要为 ECharts 准备一个定义了高宽的 DOM 容器 -->
  <div class="fans-container">
    <!-- 1.在绘图前我们需要为 ECharts 准备一个定义了高宽的 DOM 容器 -->
    <h2>普通图表</h2>
    <div ref="main"
         style="width: 800px;height:600px;">
    </div>
    <h2>百度地图结合echarts</h2>
    <mapDemo />
    <h2>纯百度地图</h2>
    <bmapDemo/>
  </div>
</template>

<script>
import mapDemo from './components/map-demo'
import bmapDemo from './components/bmap-demo'
// 2.加载echarts
import * as echarts from 'echarts'
export default {
  name: 'FansIndex',
  components: { mapDemo, bmapDemo },
  data () {
    return {}
  },
  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: 'Email',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Union Ads',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Video Ads',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: 'Search Engine',
          type: 'bar',
          data: [862, 1018, 964, 1026, 1679, 1600, 1570],
          emphasis: {
            focus: 'series'
          },
          markLine: {
            lineStyle: {
              type: 'dashed'
            },
            data: [[{ type: 'min' }, { type: 'max' }]]
          }
        },
        {
          name: 'Baidu',
          type: 'bar',
          barWidth: 5,
          stack: 'Search Engine',
          emphasis: {
            focus: 'series'
          },
          data: [620, 732, 701, 734, 1090, 1130, 1120]
        },
        {
          name: 'Google',
          type: 'bar',
          stack: 'Search Engine',
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 290, 230, 220]
        },
        {
          name: 'Bing',
          type: 'bar',
          stack: 'Search Engine',
          emphasis: {
            focus: 'series'
          },
          data: [60, 72, 71, 74, 190, 130, 110]
        },
        {
          name: 'Others',
          type: 'bar',
          stack: 'Search Engine',
          emphasis: {
            focus: 'series'
          },
          data: [62, 82, 91, 84, 109, 110, 120]
        }
      ]
    }
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>

<style>
</style>
