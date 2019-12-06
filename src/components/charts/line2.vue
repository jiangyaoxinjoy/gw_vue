<template>
  <div ref="dom" id="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import  'echarts/theme/dark.js'
import { on, off, getDateRangeArray,daterange } from '@/libs/tools'
import { mapActions} from 'vuex'

export default {
  name: 'ChartLine2',
  props: {
    // cola: Array,
    // colb: Array,
    // colc: Array,
    // dayString: Array,
    backgroundColor: String,
    comId: {
      type:Number,
      default: 1
    }
  },
  data () {
    return {
      dom: null
    }
  },
  watch: {
    comId(val) {
      this.init()
    }
    // dayString(val){
    //   this.init()
    //   // console.log(val)
    //   // if(val.length > 0) {
    //   //   this.init()
    //   // }
    // }
  },
  methods: {
    ...mapActions(['getAlertAnalyze']),
    resize () {
      this.dom.resize()
    },
    init () {
      this.dom = echarts.init(this.$refs.dom, 'dark')
      this.dom.showLoading({
        text: 'loading',
        color: '#c23531',
        textColor: '#fff',
        maskColor: this.backgroundColor,
        zlevel: 0
      });
      var selectTime = daterange(90)
      var rangeDate =  getDateRangeArray(selectTime[0],selectTime[1], 'day')
      var lineValue = [rangeDate,[],[],[]]

      this.getAlertAnalyze({'companyId': this.comId}).then( res => {
        var analyze = res || []
        _(rangeDate).forEach(function(value) {
          var item = _.find(analyze, function (o) {
            return o.dayString === value
          });
          if (item) {
            lineValue[1].push(item.cola)
            lineValue[2].push(item.colb)
            lineValue[3].push(item.colc)
          } else {
            lineValue[1].push(0)
            lineValue[2].push(0)
            lineValue[3].push(0)
          }
        });
        this.dom.hideLoading();
        this.dom.setOption({
          backgroundColor: this.backgroundColor,
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
            data:['压力异常','阀门开启','撞倒']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: lineValue[0]
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'压力异常',
              type:'line',
              data: lineValue[1]
            },
            {
              name:'阀门开启',
              type:'line',
              data: lineValue[2]
            },
            {
              name:'撞倒',
              type:'line',
              data: lineValue[3]
            }
          ]
        });    
      })

      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
<style type="text/css">
#nodata{
  position: absolute;
  z-index: 1000;
}
</style>
 