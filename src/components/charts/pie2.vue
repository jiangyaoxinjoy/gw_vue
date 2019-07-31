<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import  'echarts/theme/dark.js'
import { on, off } from '@/libs/tools'
// echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    backgroundColor: String,
    height: Number
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    value(val){
      // console.log(val)
      if(val.length > 0) {
        this.init()
      }
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    init () {
      let legend = this.value.map( item => item.name)
      // console.log(legend)
      let option = {
        backgroundColor: this.backgroundColor, //rgba设置透明度0.1,
        // color: ['#fff', '#85D7E3', '#FFD100'],
        title : {
          show: false,
          text: this.text,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          },
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            // orient: 'vertical',
            x: 'center',
            top: 5,
            data: legend
            // itemGap: (this.height - 90)/3
        },
        series: [
          {
            name: this.text,
            type:'pie',
            radius : '55%',
            // radius: ['40%', '58%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
            center: ['47%', '55%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置

            avoidLabelOverlap: false,
            // 设置值域的标签
            label: {
              normal: {
                // show: false,
                formatter: '{b} : {c}个',//   设置标签显示内容 ，默认显示{b}
                // position: 'center' // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
              },
              emphasis: {
                show: true,
                formatter: '{b} : {c}个 ({d}%)',
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(30, 144, 255，0.5)'
                }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: this.value
          }
        ]
      };
      this.dom = echarts.init(this.$refs.dom, 'dark')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.$nextTick(() => {
      
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
