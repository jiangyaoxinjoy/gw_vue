<template>
  <Modal
    v-model="show"
    :title="title"
    :footer-hide="true"
    @on-cancel="cancel"
    width="80%"
    :styles="{top: modalTop+'px'}"
    :loading="loading"
  >
    <Spin fix v-if="loading"></Spin>
    <template v-if="alarmType == '20'">
      <Table height="600" :columns="columns" :data="openTableData">      
        <Page 
          :current="openHistoryForm.page" 
          class-name='totalfr' 
          slot="footer" 
          :page-size="openHistoryForm.limit" 
          @on-change="openHistorychangePage" 
          :total="openDataTotal" 
          v-show="openDataTotal > 0"
          show-total/>
          </Table>
      </Table>
    </template>
    <template v-if="alarmType == '10'">
      <Row class="modalrow">
        <DatePicker 
          type="daterange" 
          :options="options" 
          placement="bottom-start" 
          placeholder="Select date" 
          style="width: 200px"  
          :value="selectTime"
          @on-change="timeChange"
        ></DatePicker>
      </Row>
      <Tabs v-model="showType" v-if="show" @on-click="tabClick">
        <TabPane label="图形" name="1">
          <chart-line style="height: 450px;" :value="lineData" :value2="value2" :value1="value1"/>
        </TabPane>
        <TabPane label="数据" name="2">
          <Table :columns="lineColumns" :data="lineTableData" height="500" size="small">
            <template slot="value1">
              <span>{{this.value1}}</span>
            </template>
            <template slot="value2">
              <span>{{this.value2}}</span>
            </template>
            <Page 
              v-show="dataTotal > 0"
              :current="historyForm.page" 
              class-name='totalfr' 
              slot="footer" 
              :page-size="historyForm.limit" 
              @on-change="changePage" 
              :total="dataTotal" show-total/>
          </Table>
        </TabPane>
    </Tabs>
    </template>
</Modal>
</template>
<script>
import { ChartLine } from '_c/charts/index'
import { getToken } from '@/libs/util'
import { getDevicePressurehistory, getDeviceOpenhistory } from '@/api/user'
import { getDate } from '@/libs/tools'
import { getClientHeight,daterange} from '@/libs/tools' 

export default {
  name: 'indexModal',
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    alarmType: {
      type: String
    },
    deviceId: {
      type: String
    }
  },
  components: {
    ChartLine
  },
  data () {
    return {
      loading: true,
      token: getToken(),
      columns: [
        {
          title: '打开圈数',
          key: 'cola',
          minWidth: 90
        },
        {
          title: '发生时间',
          key: 'sendtime',
          minWidth: 160,
          render: (h, params) => {
            var time = getDate(params.row.sendtime)
            return h('span', time)
          }
        },
        {
          title: '出水量约(吨)',
          key: 'cold',
          minWidth: 120,
          render: (h, params) => {
            // params.row.colc
            // var time = params.row.colc / 1000
            return h('span',params.row.cold.toFixed(2))
          }
        },
        {
          title: '持续时间(秒)',
          key: 'colc',
          minWidth: 120,
          render: (h, params) => {
            var time = params.row.colc / 1000
            return h('span', time)
          }
        },
        {
          title: '记录时间',
          key: 'createtime',
          minWidth: 170,
          render: (h, params) => {
            if (params.row.createtime === '0001-01-01T00:00:00Z') {
              return h('span', '')
            }
            let time = params.row.createtime.replace('T', ' ')
            let stime = time.split('+')[0]
            return h('span', stime)
          }
        }
      ],
      count: 0,
      openTableData: [],
      showType: '1',
      historyForm: {
        page: 1,
        limit: 10
      },
      openHistoryForm: {
        page: 1,
        limit: 10
      },
      lineData: {},
      value1: 0,
      value2: 0,
      lineTableData: [],
      lineColumns: [
        {
          title: '发生时间',
          key: 'sendtime',
          render: (h, params) => {
            var time = getDate(params.row.sendtime)
            return h('span', time)
          }
        },
        {
          title: '水压(Mpa)',
          key: 'pressure_value'
        },
        {
          title: '阀值下限',
          slot: 'value1'
        },
        {
          title: '阀值上限',
          slot: 'value2'
        }
      ],
      windowH: getClientHeight(),
      selectTime: daterange(6),
      options: {
        shortcuts: [
          {
            text: '1周',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: '1个月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: '3个月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      dataTotal: 0,
      openDataTotal: 0,
    }
  },
  computed: {
    show: {
      get: function (argument) {
        return this.modalShow
      },
      set: function () {}
    },
    title () {
      if (this.alarmType === 10) {
        return '水压历史数据'
      } else if (this.alarmType === 20) {
        return '栓帽打开历史数据'
      } else {
        return '历史数据'
      }
    },
    modalTop () {
      return (this.windowH - 670 > 0) ? (this.windowH - 670)/2 : 0
    }
  },
  watch: {
    modalShow: {
      handler (val) {
        if (val) {
          if (this.alarmType === '10') {
            this.historyForm.page = 1
            this.showType = '1'
            this.initPressureData()
          }
          if (this.alarmType === '20') {
            this.openHistoryForm.page = 1
            this.initOpenData()
          }
        }
      },
      immediate: true
    },
  },
  methods: {
    cancel () {
      this.$emit('hideModal', true)
    },
    initPressureData () {
      this.loading = true
      let offset = (this.historyForm.page -1)* this.historyForm.limit
      getDevicePressurehistory({ 'device_id': this.deviceId, 'selectTime': this.selectTime,'token': this.token,"dataType": this.showType,"limit":this.historyForm.limit, "offset": offset}).then(res => {
        // console.log(res.data.data.list)
        var data = res.data.data.list || []
        console.log(data)
        this.lineData = {}
        this.lineTableData = data
        data.forEach((val, key) => {
          let time = getDate(val.sendtime,'month')
          this.lineData[time] = val.pressure_value
        })  
        this.value1 = res.data.data.value1
        this.value2 = res.data.data.value2
        this.dataTotal = res.data.data.total
        this.loading = false
      }).catch( err => {
        this.$message.error(err)
        this.loading = false
      })
    },
    initOpenData () {
      this.loading = true
      let query = {}
      query.limit = this.openHistoryForm.limit
      query.offset = (this.openHistoryForm.page -1)* this.openHistoryForm.limit
      query.device_id = this.deviceId
      query.token = this.token
      getDeviceOpenhistory(query).then(res => {
        // console.log(res)
        if(res.data.status == 0) {
          this.openTableData = res.data.data.list || []
          this.openDataTotal = res.data.data.total
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
      }).catch( err => {
        this.$message.error(err)
        this.loading = false
      })
    },
    timeChange (val) {
      this.historyForm.page = 1
      this.selectTime = val
      this.initPressureData()
    },
    changePage(page) {
      this.historyForm.page = page
      this.initPressureData()
    },
    openHistorychangePage(page) {
      this.openHistoryForm.page = page
      this.initOpenData()
    },
    tabClick(name){
      this.showType = name
      this.historyForm.page = 1
      this.initPressureData()
    }
  }
}
</script>
<style lang="less" scoped="true">
@import './modal.less';
</style>
