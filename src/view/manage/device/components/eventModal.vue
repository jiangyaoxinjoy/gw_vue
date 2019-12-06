<template>
  <Modal
      v-model="eventModal"
      :title="'事件查询:'+queryDeviceId"
      :width="90"
      :footer-hide="true"
      :styles="{top: '20px', height:'calc(100% - 50px)'}"
      :mask-closable="false"
      @on-visible-change="modalStateChange"
    >
      <Row>
        <!-- style="background: #e3e8ee;padding:8px;" -->
        <Col span="24" class="demo-tabs-style1" >
          <Tabs type="card" @on-click="tabClick" v-model="tabValue">
            <form slot="extra" :action="actionUrl+'deviceEventExport'" method="post">
              <input type="text" hidden name="exportType" :value="tabValue">
              <input type="text" hidden name="deviceId" :value="queryDeviceId">
              <input type="text" hidden name="token" :value="token">
              <input type="text" hidden name="showType" :value="tab1Params.showType">
              <input type="text" hidden name="dataType" :value="tab2Params.dataType">
              <input type="text" hidden name="selectTime" :value="tab2Params.selectTime">
              <input type="text" hidden name="timeType" :value="tab2Params.timeType">
              <Button html-type="submit" class="exprot" type="primary" size="small"><Icon type="ios-download-outline"></Icon> 导出</Button>
            </form>
            <TabPane label="接收事件" >
              <div class="tabTop">
                显示：
                <RadioGroup v-model="tab1Params.showType" type="button" size="small" @on-change="showTypeChange">
                  <Radio :label="1">全部</Radio>
                  <Radio :label="2">异常</Radio>
                  <Radio :label="3">告警</Radio>
                </RadioGroup>
              </div>
              <Table
              :columns="tab1columns"
              :data="tab1Data"
              :height="tableHeight - 165"
              :border="false"
              >
                <Page class-name='totalfr' slot="footer" :total="tab1total" @on-change="tab1PageChange" :page-size="tab1Params.limit" size="small" show-total />
              </Table>
            </TabPane>
            <TabPane label="原始数据">
              <div class="tabTop">
                <RadioGroup v-model="tab2Params.timeType" @on-change="tab2TimeTypeChange">
                  <Radio :label="1">
                    <span>全部</span>
                  </Radio>
                  <Radio :label="2">
                    <span>本周</span>
                  </Radio>
                  <Radio :label="3">
                    <span>上周</span>
                  </Radio>
                  <Radio :label="4">
                    <span>本月</span>
                  </Radio>
                  <Radio :label="5">
                    <span>上月</span>
                  </Radio>
                  <Radio :label="6">
                    <span>指定时间</span>
                     <DatePicker
                     :value="selectTime"
                     type="date"
                     placeholder="Select date"
                     style="width: 200px"
                     format="yyyy-MM-dd"
                     @on-change="tab2selectTimeChange"
                    ></DatePicker>
                  </Radio>
                </RadioGroup>
              </div>
              <div class="tabTop">
                <RadioGroup v-model="tab2Params.dataType" type="button" size="small" @on-change="tab2DataTypeChange">
                  <Radio :label="1">全部</Radio>
                  <Radio :label="2">水压异常</Radio>
                  <Radio :label="3">阀门打开</Radio>
                  <Radio :label="4">撞倒</Radio>
                  <Radio :label="5">设备异常</Radio>
                 <!--  <Radio :label="2">失联</Radio>
                  <Radio :label="3">心跳</Radio>
                  <Radio :label="4">水压</Radio>
                  <Radio :label="5">栓帽打开</Radio> -->
                </RadioGroup>
              </div>
              <Table
              :columns="tab2Columns"
              :data="tab2Data"
              :height="tableHeight - 215"
              >
                <Page class-name='totalfr' slot="footer"  :total="tab2total" @on-change="tab2PageChange" :page-size="tab2Params.limit" size="small" show-total />
              </Table>

            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
import { getDate } from '@/libs/tools.js'
export default {
  props: {
    modal: Boolean,
    queryDeviceId: [Number, String],
    actionUrl: String
  },
  data () {
    return {
      tabValue: 0,
      selectTime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      tab1Params: {
        limit: 30,
        pageNum: 1,
        offset: 0,
        showType: 1
      },
      tab1total: 0,
      tab1Data: [],
      tab2Params: {
        timeType: 1,
        dataType: 1,
        selectTime: 0,
        limit: 30,
        pageNum: 1,
        offset: 0
        // showType: 1,
      },
      tab2total: 0,
      tab2Data: [],
      tab1columns: [
        {
          title: '事件ID',
          key: 'Id',
          minWidth: 100
        },
        {
          title: '发生时间',
          key: 'sendtime',
          minWidth: 160,
          render: (h, params) => {
            let time = getDate(params.row.sendtime)
            return h('span', time)
          }
        },
        {
          title: '事件类型',
          key: 'alert_type',
          minWidth: 100,
          render: (h, params) => {
            let text = ''
            switch (params.row.alert_type) {
              case '120':
                text = '阀门打开'
                break
              case '130':
                text = '撞倒'
                break
              case '60':
                text = '水压异常'
                break
              case '70':
                text = '失联'
                break
              default:
                break
            }
            return h('span', text)
          }
        },
        {
          title: '值',
          key: 'cola',
          minWidth: 60
        },
        {
          title: '公司名称',
          key: 'company',
          minWidth: 120
        },
        {
          title: '备注',
          key: 'descrip',
          minWidth: 50
        }
      ],
      tab2Columns: [
        {
          title: 'Timestamp',
          key: 'sendtime',
          minWidth: 160,
          render: (h, params) => {
            let time = getDate(params.row.sendtime)
            return h('span', time)
          }
        },
        {
          title: '事件类型',
          key: 'alert_type',
          minWidth: 100,
          render: (h, params) => {
            let text = ''
            switch (params.row.alert_type) {
              case '120':
                text = '阀门打开'
                break
              case '130':
                text = '撞倒'
                break
              case '60':
                text = '水压异常'
                break
              case '70':
                text = '失联'
                break
              default:
                break
            }
            return h('span', text)
          }
        },
        {
          title: 'serial_no',
          key: 'cola',
          minWidth: 60
        },
        // {
        //   title: '状态',
        //   render: (h, params) => {
        //     return h('span', '已解析')
        //   }
        // }
      ]
    }
  },
  computed: {
    eventModal: {
      get () {
        return this.modal
      },
      set () {}
    },
    tableHeight () {
      return this.$store.state.user.windowH - 60
    },
    token () {
      return this.$store.state.user.token
    }
  },
  watch: {
    queryDeviceId: {
      handler (val) {
        this.tab1total = 0
        this.tab1Data = []
        this.tab2total = 0
        this.tab2Data = []
        this.tab1Params.showType = 1
        this.tab2Params.dataType = 1
        this.tab2Params.timeType = 1
        this.getDeviceEvent()
      },
      immediate: true
    }
  },
  created () {
    var date = new Date(this.selectTime)
    this.tab2Params.selectTime = date.getTime()
  },
  methods: {
    ...mapActions(['getDeviceAlertEvent', 'getDeviceAlertOriginData', 'exportDeviceEvent']),
    modalStateChange (val) {
      this.$emit('modalState', val)
      if (!val) {
        this.tabValue = 0
      }
    },
    getDeviceEvent () {
      let payload = JSON.parse(JSON.stringify(this.tab1Params))
      payload.offset = (payload.pageNum - 1) * payload.limit
      payload.device_id = this.queryDeviceId
      this.getDeviceAlertEvent(payload).then(res => {
        // console.log(res)
        if (res.list != null) {
          this.tab1Data = res.list
          this.tab1total = res.total
        } else {
          this.tab1Data = []
          this.tab1total = 0
        }
      })
    },
    getDeviceOriginData () {
      let payload = JSON.parse(JSON.stringify(this.tab2Params))
      payload.offset = (payload.pageNum - 1) * payload.limit
      payload.device_id = this.queryDeviceId

      this.getDeviceAlertOriginData(payload).then(res => {
        if (res.list != null) {
          this.tab2Data = res.list
          this.tab2total = res.total
        } else {
          this.tab2Data = []
          this.tab2total = 0
        }
        // this.tab2Loading = false
      })
    },
    tabClick (val) {
      if (val === 1 && this.tab2Data.length == 0) {
        this.getDeviceOriginData()
      }
    },
    tab2TimeTypeChange () {
      // this.tab2Loading = true
      this.getDeviceOriginData()
    },
    tab2DataTypeChange () {
      // this.tab2Loading = true
      this.getDeviceOriginData()
    },
    tab2PageChange (val) {
      // this.tab2Loading = true
      this.tab2Params.pageNum = val
      this.getDeviceOriginData()
    },
    tab2selectTimeChange (val) {
      console.log(val)
      var date = new Date(val)
      console.log(date)
      let timestamp = date.getTime() - 60 * 60 * 8 * 1000
      this.tab2Params.selectTime = timestamp
      this.getDeviceOriginData()
    },
    showTypeChange () {
      // this.tab1Loading = true
      this.getDeviceEvent()
    },
    tab1PageChange (val) {
      // this.tab1Loading = true
      this.tab1Params.pageNum = val
      this.getDeviceEvent()
    }
  }
}
</script>
<style type="text/css">
.tabTop{
  margin-bottom: 16px;
}
</style>
