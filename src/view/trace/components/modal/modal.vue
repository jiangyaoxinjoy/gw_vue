<template>
  <Modal
    v-model="show"
    :title="'告警详情'"
    @on-cancel="cancel"
    :footer-hide='true'
    :styles="{top: '20px', width: '90%'}"
  >
    <Table :highlight-row="true" @on-row-click="setData2" :data="data1" :columns="columns" :height="windowH/2 - 50">
      <Page :current="pageNum" class-name='totalfr' slot="footer" :page-size="tabal1Params.limit" @on-change="table1changePage" :total="data1Total" size="small" show-total />
    </Table>
    <Table :data="data2" :columns="columns2" :height="windowH/2 - 80">
    </Table>
</Modal>
</template>
<script>
import { mapActions } from 'vuex'
import { getDate } from '@/libs/tools.js'
export default {
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    deviceId: [String]
  },
  data () {
    return {
      pageNum: 1,
      tabal1Params: {
        limit: 7,
        offset: 0,
        device_id: 0
      },
      data1Total: 0,
      data1: [],
      data: [],
      columns: [
        {
          title: '事件ID',
          key: 'Id',
          minWidth: 70
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
          title: '事件类别',
          key: 'alert_type',
          minWidth: 120,
          render: (h, params) => {
            let text = ''
            switch (params.row.alert_type) {
              case '20':
                text = '阀门打开'
                break
              case '30':
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
          minWidth: 70
        },
        {
          title: '通知方式',
          key: '',
          minWidth: 70,
          render: (h, params) => {
            let text = ''
            if (this.data[params.index].notify != null) {
              text = '短信'
            }
            return h('span', text)
          }
        },
        {
          title: '备注',
          key: 'descrip',
          minWidth: 70
        }
      ],
      data2: [],
      columns2: [
        {
          title: '主事件ID',
          key: 'alert_id',
          minWidth: 70
        },
        {
          title: '电话号码',
          key: 'phone',
          minWidth: 80
        },
        {
          title: '姓名',
          key: 'userName',
          minWidth: 70
        },
        {
          title: '通知方式',
          key: 'type',
          minWidth: 70,
          render: (h, params) => {
            if (params.row.type === 1) {
              return h('span', '短信')
            } else if (params.row.type === 2) {
              return h('span', '微信')
            }
          }
        },
        {
          title: '通知情况',
          key: '',
          minWidth: 70,
          render: (h, params) => {
            if (params.row.state === 1) {
              return h('span', '发送成功')
            }
            if (params.row.state === 0) {
              if (params.row.receivetime === 0) {
                return h('span', '发送中')
              } else {
                return h('span', '发送失败')
              }
            }
          }
        },
        {
          title: '开始时间',
          key: 'sendtime',
          minWidth: 120,
          render: (h, params) => {
            let time = getDate(params.row.sendtime)
            return h('span', time)
          }
        },
        {
          title: '结束时间',
          key: 'receivetime',
          minWidth: 120,
          render: (h, params) => {
            if (params.row.receivetime !== 0) {
              let time = getDate(params.row.receivetime)
              return h('span', time)
            }
            return h('span', '')
          }
        }
      ]
    }
  },
  watch: {
    deviceId (val) {
      if (val !== '0') {
        this.tabal1Params.device_id = val
        this.resetData()
        this.initDeviceAlertDetail()
      }
    }
  },
  computed: {
    show: {
      get () {
        return this.modalShow
      },
      set () {}
    },
    windowH () {
      return this.$store.state.user.windowH
    }
  },
  methods: {
    ...mapActions(['getDeviceAlertDetail']),
    cancel () {
      this.$emit('hideModal', true)
    },
    table1changePage (val) {
      this.pageNum = val
      this.tabal1Params.offset = (val - 1) * this.tabal1Params.limit
      this.initDeviceAlertDetail()
    },
    initDeviceAlertDetail () {
      this.getDeviceAlertDetail(this.tabal1Params).then(res => {
        // console.log(res)
        this.data1 = []
        if (res.data.length != 0) {
          this.data = res.data
          this.data.forEach((val, key) => {
            this.data1.push(val.alert)
          })
          this.data1[0]['_highlight'] = true
          this.data1Total = res.total
          this.data2 = res.data[0].notify !== null ? res.data[0].notify : []
        }
      })
    },
    setData2 (val, index) {
      this.data2 = this.data[index].notify !== null ? this.data[index].notify : []
    },
    resetData () {
      this.pageNum = 1
      this.tabal1Params.offset = 0
    }
  }
}
</script>
<style lang="less">
 @import './modal.less';
</style>
