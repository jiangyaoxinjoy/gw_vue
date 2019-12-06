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
          <!-- <Radio :label="0">全部</Radio> -->
          <Radio v-for="item in alarmTypeList" :label="item.key"  :key="item.id">{{item.title}}</Radio>
        </RadioGroup>
        <Companyselect :width="150" :companyList="companyList" :selectCompany="params.companyId" @changeComId="companyChange"/>
      </div>
      <template slot="state" slot-scope="{ row, index }">
        <span>{{row.state | alarmTypeFilter}}</span>
      </template>
      <Page class-name='totalfr' slot="footer" :total="totalCount" :page-size="params.limit"  show-total :current="1" @on-change="changePage"></Page>
    </Table>
  </div>
</template>
<script>
import expandRow from './expanRow.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
// import { RiQiYear } from '@/libs/util'
import { Companyselect } from '_c/input/index'
import { getDate } from '@/libs/tools'

export default {
  name: 'IndexTable',
  components: { expandRow, Companyselect },
  data () {
    return {
      params: {
        alarmType: 1,
        limit: 100,
        offset: 0,
        pageNum: 1,
        companyId: 1
      },
      alertList: [],
      totalCount: 0,
      loading: true,
      timer: null,
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
            let time = getDate(params.row.hearttime)
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
      curDeviceId: state => state.alert.curDeviceId,
      defaultCity: state => state.alert.defaultCity,
    })
  },
  created () {
    this.initPage()
  },
  mounted() {
    this.$nextTick( () => {
      this.timer = setInterval(this.queryTableData, 120*1000)
    })
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.setCurDeviceId('')       
  },
  methods: {
    ...mapMutations(['setCurDeviceId']),
    ...mapActions(['getAlertList', 'getCompanyList','getCity']),
    initPage () {
      if (this.companyList.length === 0) {
        this.getCompanyList()
      }
      this.params.companyId = this.comId
      this.queryTableData()    
    },
    queryTableData () {
      let data = JSON.parse(JSON.stringify(this.params))
      data.offset = (data.pageNum - 1) * data.limit
      // 请求数据
      this.getAlertList(data).then(res => {
        this.alertList = res.list == null ? [] : res.list
        this.totalCount = res.count
        var flag =  _.findIndex(this.alertList, ['device_id', this.curDeviceId])
        if (res.count > 0) {
          if( flag === -1) {
            this.alertList[0]['_highlight'] = true
            this.setMarker(this.alertList[0])
          } else {
            this.alertList[flag]['_highlight'] = true
          } 
        } else {
          this.setCurDeviceId('')              
        }
      })
      this.loading = false
    },
    setMarker (row, index) {
      if (row.device_id != this.curDeviceId) {
        this.$store.commit('setCurMarker', { lat: row.lat, lng: row.lng, device_id: row.device_id })
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
