<template>
  <Layout>
    <Sider hide-trigger width="250">
      <Form label-position="top" class="sider_form">
        <FormItem label="选择公司">
          <Companyselect
          :companyList="companyList"
          :selectCompany="alarmParams.companyId"
          :width="250"
          @changeComId="comChange"/>
        </FormItem>
        <FormItem label="告警状态" class="status_search">
          <RadioGroup v-model="alarmParams.alertState" type="button" @on-change="alarmStateChange">
            <Radio :label="0">全部</Radio>
            <Radio :label="1">已解除</Radio>
            <Radio :label="2">未解除</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="地址/设备号">
          <Input
            @on-change="handleClear"
            clearable
            placeholder="输入设备地址、设备号"
            class="search-input"
            v-model="alarmParams.addkeys"
          />
        </FormItem>
        <FormItem label="日期范围" class="data_search">
          <DatePicker type="daterange" @on-clear="claerDate" split-panels placeholder="选择日期" v-model='alarmParams.dataPicker'></DatePicker>
        </FormItem>
        <FormItem class="form_search">
          <Button @click="handleSearch" size="large" class="search-btn" type="warning"><Icon type="search"/>查询</Button>
        </FormItem>
        <FormItem class="form_search">
          <Button @click="handleReset" size="large" type="info">重置</Button>
        </FormItem>
        <FormItem class="export_wrap">
          <form id="upload" :action="url+'exportAlertTrace'" method="post">
            <input autocomplete="off" type="text" hidden="" name="token" :value="token">
            <input autocomplete="off" type="text" hidden="" name="addkeys" :value="alarmParams.addkeys">
            <input autocomplete="off" type="text" hidden="" name="alertState" :value="alarmParams.alertState">
            <input autocomplete="off" type="text" hidden="" name="companyId" :value="alarmParams.companyId">
            <input autocomplete="off" type="text" hidden="" name="dataPicker" :value="alarmParams.dataPicker">
            <Button type="primary" html-type="submit" class="exportBtn" size="large"><Icon type="ios-download-outline"></Icon>导出到Excel</Button>
          </form>
        </FormItem>
      </Form>
    </Sider>
    <Content>
      <Table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :height="tableHeight"
        ref="table"
      >
        <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" @click="show(row)">告警详情</Button>
        </template>
        <Page @on-change="changePage"  class-name='totalfr' slot="footer" :current="alarmParams.pageNum" :page-size="alarmParams.limit" :total="dataTotal" show-total size="small" />
      </Table>
    </Content>
    <modal :modalShow="modalShow" @hideModal="modalShow = false" :deviceId="modalDeviceId"/>
  </Layout>
</template>
<script>
import { getDate } from '@/libs/tools'
import modal from './components/modal/modal.vue'
import { mapActions, mapState } from 'vuex'
import { Companyselect } from '_c/input/index'
export default {
  components: {
    modal,
    Companyselect
  },
  data () {
    return {
      alarmParams: {
        companyId: 0,
        alertState: 0,
        addkeys: '',
        dataPicker: ['', ''],
        pageNum: 1,
        limit: 20,
        offset: 0
      },
      // companyList: [],
      modalDeviceId: '0',
      modalShow: false,
      tableData: [],
      dataTotal: 0,
      loading: true,
      columns: [
        {
          title: '项目名称',
          key: 'companyName',
          minWidth: 100
        },
        {
          title: '发生时间',
          minWidth: 150,
          key: 'sendtime',
          render: (h, params) => {
            let time = getDate(params.row.sendtime)
            return h('div', time)
          }
        },
        {
          title: '事件类别',
          key: 'alert_type',
          minWidth: 100,
          render: (h, params) => {
            let texts = ''
            switch (params.row.alert_type) {
              case '60':
                texts = '水压异常'
                break
              case '20':
                texts = '阀门打开'
                break
              case '30':
                texts = '撞倒'
                break
              case '70':
                texts = '失联'
                break
              default:
                texts = '设备异常'
                break
            }
            if (params.row.restoretime === 0 && params.row.alert_type !== '70') {
              return h('span', {
                style: {
                  backgroundColor: '#E97C67',
                  color: '#F4EAE0',
                  display: 'inlineBlock',
                  padding: '3px'
                }
              }, texts)
            } else if (params.row.restoretime === 0 && params.row.alert_type === '70') {
              return h('span', {
                style: {
                  backgroundColor: '#F0C866',
                  color: '#222222',
                  display: 'inlineBlock',
                  padding: '3px'
                }
              }, texts)
            } else {
              return h('div', texts)
            }
          }
        },
        {
          title: '告警状态',
          key: 'alertState',
          minWidth: 90,
          render: (h, params) => {
            let texts = ''
            if (params.row.restoretime !== 0 && params.row.restoretime !== '') {
              texts = '已解除'
            } else {
              texts = '未解除'
            }
            return h('div', { props: {} }, texts)
          }
        },
        {
          title: '通知情况',
          minWidth: 100,
          key: 'notifyStatus',
          render: (h, params) => {
            let texts = ''
            if (params.row.notifyStatus === 1) {
              texts = '通知已到达'
            } else {
              texts = '通知未到达'
            }
            return h('div', { props: {} }, texts)
          }
        },
        {
          title: '设备号',
          minWidth: 180,
          key: 'device_id'
        },
        {
          title: '地址',
          minWidth: 250,
          key: 'address'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      companyList: state => state.user.companyList,
      token: state => state.user.token,
      tableHeight: state => state.user.windowH - 60,
      comId: state => state.user.comId,
      url: state => state.user.baseUrl,
    })
  },
  created () {
    this.initPage()
  },
  methods: {
    ...mapActions(['getCompanyList', 'getAlertHistory']),
    /**
     * [initPage 页面初始化]
     * @return {[type]} [description]
     */
    initPage () {
      if (this.companyList.length === 0) {
        this.getCompanyList()
      }
      this.alarmParams.companyId = this.comId
      this.$nextTick( () =>{
        this.getAlertData()
      })
    },
    changePage (val) {
      this.alarmParams.pageNum = val
      this.$nextTick( () =>{
        this.getAlertData()
      })
    },
    //地址清空
    handleClear (e) {
      // console.log(e.target.value)
      if (e.target.value === '') {
        this.queryData()
      }
    },
    //查询按钮
    handleSearch () {
      this.queryData()
    },
    show (row) {
      this.modalDeviceId = row.device_id
      this.modalShow = true
    },
    comChange (val) {
      this.alarmParams.companyId = val
      this.queryData()
    },
    
    alarmStateChange () {
      this.queryData()
    },
    handleReset () {
      this.alarmParams.addkeys = ''
      this.alarmParams.alertState = 0
      this.alarmParams.companyId = this.comId
      this.alarmParams.dataPicker = ['', '']
      this.alarmParams.pageNum = 1
      this.$nextTick( () =>{
        this.getAlertData()
      })
    },
    //日期清空
    claerDate(e) {
      this.queryData()
    },
    /**
     * [getAlertData 根据参数获取页面数据]
     * @return {[type]} [description]
     */
    getAlertData () {
      this.loading = true
      var payload = JSON.parse(JSON.stringify(this.alarmParams))
      payload.offset = (Number(payload.pageNum) - 1) * Number(payload.limit)
      if (payload.dataPicker[0] !== '' && payload.dataPicker[1] !== '') {
        var date = new Date(payload.dataPicker[0])
        payload.dataPicker[0] = String(date.getTime())
        var date1 = new Date(payload.dataPicker[1])
        payload.dataPicker[1] = String(date1.getTime())
      }
      this.getAlertHistory(payload).then(res => {
        if (res.list != null) {
          this.tableData = res.list
          this.dataTotal = res.total
        } else {
          this.tableData = []
          this.dataTotal = 0
        }
        this.loading = false
      })
    },
    queryData () {
      this.alarmParams.pageNum = 1
      this.$nextTick( () =>{
        this.getAlertData()
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import './trace.less';
</style>
<style type="text/css">
  .sider_form.ivu-form .ivu-form-item-label{
     color: rgba(255,255,255,.8)
  }
  .data_search .ivu-date-picker{
    width: 100%;
  }
  .status_search .ivu-radio-group{
    display: flex;
  }
  .status_search label{
    flex: 1;
    text-align: center;
  }
  .export_wrap button{
    width: 100%;
  }
  .form_search button{
    width: 100%;
  }
</style>
