<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import  'echarts/theme/dark.js'
import { on, off } from '@/libs/tools'

export default {
  name: 'ChartLine2',
  props: {
    cola: Array,
    colb: Array,
    colc: Array,
    dayString: Array,
    backgroundColor: String
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    dayString(val){
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
        backgroundColor: this.backgroundColor,
        // color: ['#fff', '#85D7E3', '#FFD100'],
        title: {
          show: false,
          text: '设备报警折线图',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          },
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 10,
          data:['压力异常','阀门打开','撞倒']
        },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dayString
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'压力异常',
            type:'line',
            data: this.cola
          },
          {
            name:'阀门打开',
            type:'line',
            data: this.colb
          },
          {
            name:'撞倒',
            type:'line',
            data: this.colc
          }
        ]
      };
      this.dom = echarts.init(this.$refs.dom, 'dark')
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
 