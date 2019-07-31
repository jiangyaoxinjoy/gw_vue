<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import  'echarts/theme/macarons.js'

export default {
  name: 'ChartWater',
  props: {
    lineValue: Array,
    lineKey: Array
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    lineValue(val){
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
      let option = {
        // title: {
        //   show: false,
        //   text: '设备出水量折线图',
        //   textStyle: {
        //     fontSize: 16,
        //     fontWeight: 'bold'
        //   },
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 10,
          data:['每日出水量']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.lineKey,
          // axisLabel:{
          //   rotate: 20,
          //   interval:0
          // },
          axisLine:{
            lineStyle :{
              color: '#CECECE'
            }
          },
        },
        yAxis: {
          type: 'value',
          axisLabel : {
             formatter: '{value} 吨'
          },
          axisLine:{
            lineStyle :{
              color: '#CECECE'
            }
          }
        },
        series: [
          {
            name:'每日出水量',
            type:'line',
            data: this.lineValue
          }
        ]
      };
      this.dom = echarts.init(this.$refs.dom, 'macarons')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.init()
    // })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
 