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
      <Card style="width:100%">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
           原始数据 
        </p>
        <form slot="extra" :action="actionUrl+'deviceEventExport'" method="post">
          <input type="text" hidden name="exportType" :value="1">
          <input type="text" hidden name="deviceId" :value="queryDeviceId">
          <input type="text" hidden name="token" :value="token">
          <!-- <input type="text" hidden name="showType" :value="tab1Params.showType"> -->
          <input type="text" hidden name="dataType" :value="tab2Params.dataType">
          <input type="text" hidden name="selectTime" :value="tab2Params.selectTime">
          <input type="text" hidden name="timeType" :value="tab2Params.timeType">
          <Button html-type="submit" class="exprot" type="primary" size="small"><Icon type="ios-download-outline"></Icon> 导出</Button>
        </form>
     
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
            <Radio :label="3">阀门开启</Radio>
            <Radio :label="4">撞倒</Radio>
            <Radio :label="5">离线</Radio>
            <Radio :label="6">原始数据</Radio>
          </RadioGroup>
        </div>
        <Table
          :loading="loading"
          :columns="tab2Params.dataType ==  6 ? tabcolumnsOrigin : tab2Columns"
          :data="tab2Data"
          :height="tableHeight - 260">
          <Page class-name='totalfr' slot="footer"  :total="tab2total" @on-change="tab2PageChange" :page-size="tab2Params.limit" size="small" show-total />
        </Table>
        <!--  <Table
          v-if="tab2Params.dataType == 6"
          :columns="tabcolumnsOrigin"
          :data="tab2Data"
          :height="tableHeight - 260">
          <Page class-name='totalfr' slot="footer"  :total="tab2total" @on-change="tab2PageChange" :page-size="tab2Params.limit" size="small" show-total />
        </Table> -->
      </Card>
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
import { getDate } from '@/libs/tools'
export default {
  props: {
    modal: Boolean,
    queryDeviceId: [Number, String],
    actionUrl: String
  },
  data () {
    return {
      selectTime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      tab1total: 0,
      tab1Data: [],
      tab2Params: {
        timeType: 1,
        dataType: 1,
        selectTime: 0,
        limit: 30,
        pageNum: 1,
        offset: 0
      },
      tab2total: 0,
      tab2Data: [],
      tabcolumnsOrigin: [
        {
          title: 'ID',
          key: 'Id',
          minWidth: 100
        },
        {
          title: '内容',
          key: 'content',
          minWidth: 160,
        },
        {
          title: '时间',
          key: 'createtime',
          minWidth: 160,
          render: (h, params) => {
            let dateee = new Date(params.row.createtime).toJSON();
            return h('span', new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''))
          }
        },
        {
          title: '设备ID',
          key: 'device_id',
          minWidth: 160,
        },
      ],
      tab2Columns: [
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
                text = '阀门开启'
                break
              case '130':
                text = '撞倒'
                break
              case '60':
                text = '水压异常'
                break
              case '70':
                text = '离线'
                break
              case '80':
                text = '水压恢复'
                break
              case '90':
                text = '阀门已关闭'
                break
              case '100':
                text = '撞倒恢复'
                break
              case '110':
                text = '离线恢复'
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
        // {
        //   title: '状态',
        //   render: (h, params) => {
        //     return h('span', '已解析')
        //   }
        // }
      ],
      loading: true
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
        if (this.modal) {
          this.tab2Params.dataType = 1
          this.tab2Params.timeType = 1
          this.getDeviceOriginData()
        }       
      },
      immediate: true
    }
  },
  created () {
    var date = new Date(this.selectTime)
    this.tab2Params.selectTime = date.getTime()
  },
  methods: {
    ...mapActions(['getDeviceAlertOriginData', 'exportDeviceEvent','getOridata']),
    modalStateChange (val) {
      this.$emit('modalState', val)
    },
    getDeviceOriginData () {
      this.loading = true
      this.tab2Data = []
      let payload = JSON.parse(JSON.stringify(this.tab2Params))
      payload.offset = (payload.pageNum - 1) * payload.limit
      payload.device_id = this.queryDeviceId
      if(this.tab2Params.dataType != 6) {
        this.getDeviceAlertOriginData(payload).then(res => {
          console.log(res)
          if (res.list != null) {
            this.tab2Data = res.list
            this.tab2total = res.total
          } else {
            this.tab2Data = []
            this.tab2total = 0
          }
          this.loading = false
        })
      }else{
        this.getOridata(payload).then( res =>{
          if (res.list != null) {
            this.tab2Data = res.list
            this.tab2total = res.count
          } else {
            this.tab2Data = []
            this.tab2total = 0
          }
          this.loading = false
        })
      } 
    },
  //   // tabClick (val) {
  //   //   if (val === 1 && this.tab2Data.length == 0) {
  //   //     this.getDeviceOriginData()
  //   //   }
  //   // },
    tab2TimeTypeChange () {
      // this.tab2Loading = true
      this.getDeviceOriginData()
    },
    tab2DataTypeChange () {
      this.getDeviceOriginData()
      // this.tab2Loading = true
      
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
  //   showTypeChange () {
  //     // this.tab1Loading = true
  //     this.getDeviceEvent()
  //   },
  //   tab1PageChange (val) {
  //     // this.tab1Loading = true
  //     this.tab1Params.pageNum = val
  //     this.getDeviceEvent()
  //   }
  }
}
</script>
<style type="text/css">
.tabTop{
  margin-bottom: 16px;
}
</style>
