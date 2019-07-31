<template>
  <div>
    <Table
      :columns="columns"
      :data="alertList"
      @on-row-click="setMarker"
      :loading="loading"
      :highlight-row="true"
      ref="table"
      :height="tableHeight"
    >
      <div class="table_filter" slot="header">
        <RadioGroup class="group1" v-model="params.alarmType" type="button" @on-change="alarmTypeChange">
          <Radio label="0">全部</Radio>
          <Radio v-for="item in alarmTypeList" :label="item.key"  :key="item.id">{{item.title}}</Radio>
        </RadioGroup>
        <Companyselect :width="150" :companyList="companyList" :selectCompany="params.companyId" @changeComId="companyChange"/>
      </div>
      <template slot="state" slot-scope="{ row, index }" >
        <span>{{row.state | alarmTypeFilter}}</span>
      </template>
      <Page class-name='totalfr' slot="footer" :total="totalCount" :page-size="params.limit"  show-total :current="1" @on-change="changePage"></Page>
    </Table>
  </div>
</template>
<script>
import expandRow from './expanRow.vue'
import { mapState, mapActions } from 'vuex'
import { RiQiYear } from '@/libs/util'
import { Companyselect } from '_c/input/index'

export default {
  name: 'IndexTable',
  components: { expandRow, Companyselect },
  data () {
    return {
      params: {
        alarmType: '0',
        limit: 100,
        offset: 0,
        pageNum: 1,
        companyId: 0
      },
      alertList: [],
      totalCount: 0,
      loading: true,
      columns: [
        {
          type: 'expand',
          width: 40,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '报警类型',
          key: 'state',
          minWidth: 90,
          slot: 'state'
        },
        {
          title: '发生时间',
          key: 'alarm_on',
          minWidth: 150,
          render: (h, params) => {
            let time = RiQiYear(params.row.hearttime)
            return h('span', time)
          }
        },
        {
          title: '设备号',
          key: 'device_id',
          minWidth: 180
        },
        {
          title: '公司名称',
          key: 'company',
          minWidth: 160
        },
        { title: '备注', key: 'descrip', minWidth: 200, ellipsis: true }
      ]
    }
  },
  computed: {
    ...mapState({
      alarmTypeList: state => state.alert.alarmTypeList,
      tableHeight: state => state.user.windowH - 60,
      companyList: state => state.user.companyList,
      comId: state => state.user.comId,
      curMarker: state => state.alert.curMarker,
      curDeviceId: state => state.alert.curDeviceId
    })
  },
  created () {
    this.initPage()
  },
  methods: {
    ...mapActions(['getAlertList', 'getCompanyList']),
    initPage () {
      if (this.companyList.length === 0) {
        this.getCompanyList()
      }
      if (this.comId !== 1) {
        this.params.companyId = this.comId
      }
      this.queryTableData()
    },
    queryTableData () {
      let data = JSON.parse(JSON.stringify(this.params))
      data.offset = (data.pageNum - 1) * data.limit
      // 请求数据
      this.getAlertList(data).then(res => {
        this.alertList = res.list == null ? [] : res.list
        this.totalCount = res.count
        if (res.count > 0) {
          this.alertList[0]['_highlight'] = true
          this.setMarker(this.alertList[0])
        }
      })
      this.loading = false
    },
    setMarker (row, index) {
      var curMarker = this.curMarker
      if (curMarker.lat !== row.lat || curMarker.lng !== row.lng) {
        this.$store.commit('setCurMarker', { lat: row.lat, lng: row.lng, device_id: row.device_id })
        // this.$store.dispatch('getDeviceAlertInfo', { device_id: row.device_id })
      }
    },
    changePage (val) {
      this.params.pageNum = val
      this.loading = true
      this.queryTableData()
    },
    alarmTypeChange (val) {
      this.loading = true
      this.params.alarmType = val
      this.params.pageNum = 1
      this.queryTableData()
    },
    companyChange (val) {
      this.loading = true
      this.params.pageNum = 1
      this.params.companyId = val
      this.queryTableData()
    }
  }
}
</script>
<style lang="less" scoped>
@import './table.less';
</style>
