<template>
<div class="manage_device">
  <Table
    :columns="columns"
    :data="deviceData"
    :height="tableHeight"
    :loading="loading"
    ref="table"
    @on-select-all-cancel="handleCancelSelectAll"
    @on-select-all="handleSelectAll"
    @on-select="handleSelect"
    @on-select-cancel="handleCancel">

    <div class="theader" slot="header">
      <Button class="tbHBtn" type="primary" icon="md-add-circle" @click="handleAddDevice">
        <span>添加设备</span>
      </Button>
      <Button class="tbHBtn" type="primary" icon="ios-cloud-upload-outline" @click="handleImportDevice">
        <span>导入设备</span>
      </Button>   
      <Button class="tbHBtn"  type="primary"  @click="changeTimeOrder" :icon="timeOrder == 'down' ? 'md-arrow-dropup' : 'md-arrow-dropdown'">
        <span >时间排序</span>
      </Button>
      <div class="tbh_r">
        <Button class="tbHBtn" type="info" @click="handleBatchDelete">
          <span>批量删除</span>
        </Button>
        <Button class="tbHBtn" type="info" @click="handleBatchValue">
          <span>批量设置阀值</span>
        </Button>
        <Button class="tbHBtn" type="info" @click="handleBatchValue">
          <span>批量导出设备用水量</span>
        </Button>
      </div>
    </div>
    <!-- <div class="tb_pop_device" slot-scope="{ row, index }" slot="deviceId">
      <Poptip
        confirm
        @on-ok="copyDeviceId($event, row.device_id)"
        ok-text="复制"
      >
        <div slot="title">{{row.device_id}}</div>
        <div>{{row.device_id}}</div>
      </Poptip>
      <Poptip
      >
        <div slot="title">{{row.device_id}}</div>
        <div slot="content">
          <Button v-clipboard="{value:row.device_id,success: copySuccess, error: copyError}">copy</Button> 
        </div>
        <div>{{row.device_id}}</div>
      </Poptip>
    </div> -->
    <template slot-scope="{ row, index }" slot="state">
      <Tooltip placement="top">
        <div slot="content">{{row.state | alarmTypeFilter}}</div>
        <Tag class="stateTag" v-if="row.state == '70' && row.status != 0" type="dot" color="error">离线</Tag>
        <Tag class="stateTag" v-if="row.state == '80' && row.status != 0" type="dot" color="error">故障</Tag>
        <Tag class="stateTag" v-if="row.state != '70' && row.state != '80' && row.status != 0" type="dot" color="success">在线</Tag>
        <Tag color="default" v-if="row.status == 0">未安装</Tag>
      </Tooltip>
    </template>
    <template slot="signal" slot-scope="{ row, index }">
      <Tooltip placement="top">
        <div slot="content">信号值: {{row.signal || 0}}</div>
        <img class="cursorP" :src="signal0" style="width: 18px" v-if="row.signal == '' || row.signal == 0">
        <img class="cursorP" :src="signal1" style="width: 18px" v-if="row.signal > 0 && parseInt(row.signal/6) == 0">
        <img class="cursorP" :src="signal2" style="width: 18px" v-if="parseInt(row.signal/6) == 1">
        <img class="cursorP" :src="signal3" style="width: 18px" v-if="parseInt(row.signal/6) == 2">
        <img class="cursorP" :src="signal4" style="width: 18px" v-if="parseInt(row.signal/6) == 3">
        <img class="cursorP" :src="signal5" style="width: 18px" v-if="parseInt(row.signal/6) >= 4">
      </Tooltip>     
    </template>
    <template slot="battery"  slot-scope="{ row, index }">
       <Tooltip placement="top">
        <div slot="content">电量值: {{row.battery || 0}}</div>
        <img class="cursorP" :src="battery0" style="width: 25px" v-if="row.battery == '' || row.battery == 0">
        <img class="cursorP" :src="battery5" style="width: 25px" v-if="row.battery > 0 && parseInt(row.battery/20) == 0">
        <img class="cursorP" :src="battery4" style="width: 25px" v-if="parseInt(row.battery/20) == 1">
        <img class="cursorP" :src="battery3" style="width: 25px" v-if="parseInt(row.battery/20) == 2">
        <img class="cursorP" :src="battery2" style="width: 25px" v-if="parseInt(row.battery/20) == 3">
        <img class="cursorP" :src="battery1" style="width: 25px" v-if="parseInt(row.battery/20) >= 4">
      </Tooltip>
    </template>
    <template slot="action" slot-scope="{ row, index }">
      <div @click="handleRowEdit(row)" class="action_block">
        <Tooltip content="修改" placement="top">
          <Icons type="xiugai" color="#9fa19f" :size="18" />
        </Tooltip>
      </div>
      <div @click="handleDelete(row)" class="action_block">
        <Tooltip content="删除" placement="top">
          <Icons type="shanchu" color="#9fa19f" :size="18" />
        </Tooltip>
      </div>
      <div @click="eventQuery(row)" class="action_block">
        <Tooltip content="事件查询" placement="top">
          <Icons type="Normal" color="#9fa19f" :size="18" />
        </Tooltip>
      </div>
      <div @click="handleWater(row)" class="action_block">
        <Tooltip content="设备用水量" placement="top">
          <Icons type="yongshuiliang" color="#9fa19f" :size="18" />
        </Tooltip>
      </div>
    </template>
    <template slot="address" slot-scope="{ row, index }">
      <Tooltip content="查看地图" placement="top">
        <div class="tbAddress"  type="text" v-if="row.status === 1" @click="goMap(row)">
          <Icons type="ditu" :size="16"/>
          {{row.address}}       
        </div>
      </Tooltip>
    </template>
    <Page :current="deviceParams.pageNum" class-name='totalfr' slot="footer" :page-size="deviceParams.limit" @on-change="changePage" :total="dataTotal" show-total/>
  </Table>
  <template v-if="ifeventModal">
    <eventModal :actionUrl="url" @modalState="eventModalState" :queryDeviceId="queryDeviceId" :modal="eventModalShow"/>
  </template>
  <AddDevice :addModal="addModal" :companyList="companyList" @addStateChange="closeAddModal"/>
  <EditDevice :editModal="editModal" :companyList="companyList" @editChangeState="closeEditModal" :mapItem="mapItem" :ifSetup="deviceSetUp"/>
  <ImportDevice :uploadModal="uploadModal" :companyList="companyList" @uploadChangeState="closeImportModal"/>
  <ValueModal @closeModal="closeVlaueModal" :valueModal="valueModal" @getValue="getValue"/>
  <waterContent :actionUrl="url" :waterModal="waterModal" :deviceId="queryDeviceId" @waterChangeState="closeWaterModal"/>
</div>
</template>
<script>
import eventModal from './eventDataModal.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import Icons from '_c/icons'
// import { isString } from '@/libs/util.js'
import { getClientWidth } from '@/libs/tools.js'
import { getDate } from '@/libs/tools'
import AddDevice from './addDeviceModal.vue'
import EditDevice from './editDeviceModal.vue'
import ImportDevice from './importDeviceModal.vue'
import ValueModal from './setValueModal.vue'
// import waterContent from './waterModal.vue'
const waterContent = () => import(/* webpackChunkName: "water-modal" */'./waterModal.vue')

export default {
  components: {
    eventModal,
    Icons,
    AddDevice,
    EditDevice,
    ImportDevice,
    ValueModal,
    waterContent
  },
  data () {
    return {
      loading: true,
      ifeventModal: false,
      eventModalShow: false,
      queryDeviceId: "",
      waterModal: false,
      signal0: require('@/assets/images/signal0.png'),
      signal1: require('@/assets/images/signal1.png'),
      signal2: require('@/assets/images/signal2.png'),
      signal3: require('@/assets/images/signal3.png'),
      signal4: require('@/assets/images/signal4.png'),
      signal5: require('@/assets/images/signal5.png'),
      battery1: require('@/assets/images/battery1.png'),
      battery2: require('@/assets/images/battery2.png'),
      battery3: require('@/assets/images/battery3.png'),
      battery4: require('@/assets/images/battery4.png'),
      battery5: require('@/assets/images/battery5.png'),
      battery0: require('@/assets/images/battery0.png'),
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '设备号',
          key: 'device_id',
          minWidth: 160,
          className: 'tbDeviceId'
        },
        {
          title: '报警终端状态',
          slot: 'state',
          minWidth: 110
        }, {
          title: '信号',
          slot: 'signal',
          minWidth: 60
        }, {
          title: '电量',
          slot: 'battery',
          minWidth: 60
        },{
          title: '地址',
          slot: 'address',
          minWidth: 200
        },
        {
          title: '安装时间',
          key: 'setuptime',
          minWidth: 150,
          render: (h, params) => {
            if (params.row.setuptime === '') {
              return h('span', '')
            } else {
              let time = getDate(params.row.setuptime)
              return h('span', time)
            }
          }
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 140
        }
      ],
      deviceData: [],
      dataTotal: 0,
      tabValue: 0,
      selected: [],
      valueModal: false,
      deviceSetUp: false,
      editModal: false,
      addModal: false,
      uploadModal: false,
      timeOrder: 'up',
      mapItem: {
        address: '',
        id: '',
        lng: '',
        lat: '',
        device_id: '',
        company_id: '',
        threshold: ''
      },
      tableWidth: getClientWidth() - 220
    }
  },
  derectives: {
    clipOptions: {
      value: 1,
      success: (e) => {
        this.$Message.success('复制成功')
      },
      error: () => {
        this.$Message.error('复制失败')
      }
    }
  },
  computed: {
    ...mapState({
      url: state => state.user.baseUrl,
      tableHeight: state => state.user.windowH - 60,
      comId: state => state.user.comId,
      companyList: state => state.user.companyList,
    }),
    ...mapGetters([
      'deviceParams'
    ])
  },
  watch: {
    deviceParams: {
      handler () {
        this.loading = true
        this.setDeviceList()
      },
      deep: true
    }
  },
  beforeCreate () {
    this.$store.commit('getWindowH')
    window.onresize = () => {
      this.$store.commit('getWindowH')
      this.tableWidth = getClientWidth() - 220
    }
  },
  created () {
    this.setDeviceList()
  },
  methods: {
    ...mapActions(['deviceList', 'volumesetValue', 'deleteDevice']),
    ...mapMutations(['setCenterMarker', 'setDeviceParams']),
    //事件查询按钮
    eventQuery (row) {
      this.ifeventModal = true
      this.eventModalShow = true
      this.queryDeviceId = row.device_id
    },
    changePage (val) {
      this.deviceParams.pageNum = val
      this.setDeviceParams(this.deviceParams)
    },
    setDeviceList () {
      if ( !_.isString(this.deviceParams.addkeys)) return
      this.deviceList(this.deviceParams).then(res => {
        this.deviceData = res.data.list === null ? [] : res.data.list
        this.dataTotal = res.data.count
        if (this.dataTotal > 0) {
          let centerMark = res.data.list[0]
          this.setCenterMarker({ lng: centerMark.lng, lat: centerMark.lat })
        }
        this.loading = false
      }).catch( err => {
        if (err.search("auth") != -1) {
          this.$Modal.error({
              title: "提示",
              content: "没有查看权限"
          });
        }
        this.loading = false
      })
    },
    goMap (row) {
      if (row.lat === '') {
        this.$Message.info('未安装')
        return
      }
      this.$router.push({ path: 'map' })
      this.setCenterMarker({ lng: row.lng, lat: row.lat })
    },
    eventModalState (val) {
      this.eventModalShow = val
    },
    changePage (pageNum) {
      this.deviceParams.pageNum = pageNum
      this.setDeviceList()
    },
    //修改按钮
    handleRowEdit (row) {
      // console.log(row)
      this.mapItem.address = row.address
      this.mapItem.id = row.Id 
      this.mapItem.lat = row.lat
      this.mapItem.lng = row.lng
      this.mapItem.device_id = row.device_id
      this.mapItem.company_id = row.company_id
      this.mapItem.threshold = row.threshold
      this.editModal = true
      if (row.status === 1) {
        this.deviceSetUp = true
      } else {
        this.deviceSetUp = false
      }   
    },
    //添加设备按钮
    handleAddDevice () {
      this.addModal = true
    },
    // 导入设备按钮
    handleImportDevice () {
      this.uploadModal = true
    },
    //按时间排序
    changeTimeOrder () {
      if (this.timeOrder === 'down') {
        this.timeOrder = 'up'
        this.deviceParams.order = 'desc'
      } else {
        this.timeOrder = 'down'
        this.deviceParams.order = 'asc'
      }
      this.deviceParams.pageNum = 1
      this.setDeviceList()
    },
    //选择公司
    changeCom (val) {
      this.deviceParams.companyId = val
      this.deviceParams.pageNum = 1
      this.setDeviceList()
    },
    //添加modal关闭
    closeAddModal(modal, add) {
      this.addModal = modal
      if (add) {
        this.setDeviceList()
      }
    },
    //编辑modal关闭
    closeEditModal(modal, edit) {
      this.editModal = modal
      if (edit) {
        this.setDeviceList()
      }
    },
    //导入modal关闭
    closeImportModal (modal, upload) {
      this.uploadModal = modal
      if (upload) {
        this.setDeviceList()
      }
    },
    handleCancel(selection, row) {
      //从已选项中去除取消项
      _.remove(this.selected, n => {
        return n.device_id === row.device_id
      });
    },
    handleSelect(selection, row) {
      //添加到已选项
      this.selected.push(row);
    },
    handleSelectAll(selection) {
      //数组合并，有可能用户先选择了某几项，已经被我们push进去，因此数组合并需要去重一下
      this.selected = _.uniqBy(this.selected.concat(selection), "device_id");
    },
    handleCancelSelectAll(selection) {
      //从已选项中移除当页数据
      this.selected = _.differenceBy(this.selected, this.deviceData, "device_id");
    },
    //把源数据加上_checked字段，遍历已选项数据，更新选中状态
    updateChecked() {
      for (var i = 0; i < this.deviceData.length; i++) {
        this.deviceData[i]._checked = false;
        for (var j = 0; j < this.selected.length; j++) {
          if (this.selected[j].device_id === this.deviceData[i].device_id) {
            this.deviceData[i]._checked = true;
          }
        }
      }
    },
    handleBatchDelete () {
      // console.log(this.selected)
      var len = this.selected.length
      if (len > 0) {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>确认删除选中的${len}个设备吗?</p>`,
          onOk: () => {
            var data = {}
            data.deviceIds = []
            data.deviceIds = _.map(this.selected, 'device_id')
            this.doDeleteDevice(data)
          },
          onCancel: () => {
            this.$Message.info('取消');
          }
        });
      } else {
        this.$Message.warning({
          content: "请选择要删除的设备",
          duration: 2
        });
      }     
    },
    handleDelete (row) {
      this.$Modal.confirm({
          title: '删除',
          content: `<p>确认删除设备：${row.device_id} 吗?</p>`,
          onOk: () => {
            var data = {}
            data.deviceIds = []
            data.deviceIds.push(row.device_id)
            this.doDeleteDevice(data)
          },
          onCancel: () => {
            this.$Message.info('取消');
          }
      });
    },
    doDeleteDevice (data) {
      this.deleteDevice(data).then( res => {
        // console.log(res)
        this.$Message.info({
          content: `成功删除${res.data}个设备`,
          duration: 2
        })
        this.setDeviceList()
      })
    },
    //批量设置阀值按钮
    handleBatchValue () {
     if (this.selected.length ===  0) {
      this.$Message.warning({
        content: "请选择要修改的设备",
        duration: 2
      });
     } else {
        this.valueModal = true
     }     
    },
    closeVlaueModal (val) {
      this.valueModal = val
    },
    //修改阀值
    getValue (val) {
      var deviceIds = _.map(this.selected, 'device_id')
      var data = {}
      data.deviceIds = deviceIds
      data.value = val
      this.volumesetValue(data).then( res => {
        if ( res.status === 0) {
          this.$Message.success({
            content: `成功修改 ${res.data}个设备的阀值`,
            duration: 2
          })
          setTimeout(() => {
            this.valueModal = false
          },1000)
          this.setDeviceList()
        } else {
          this.$Message.error({
            content: '修改失败',
            duration: 2
          })
        }
      })
    },
    // copy device_id
    copySuccess () {
      this.$Message.success({
        content: '复制成功',
        duration: 1.5
      })
    },
    copyError () {
      this.$Message.error({
        content: '复制成功',
        duration: 1.5
      })
    },
    handleWater (row) {
      this.waterModal = true
      this.queryDeviceId = row.device_id
    },
    closeWaterModal (val) {
      this.waterModal = val
    }
  }
}
</script>
<style lang="less" scoped>
@import '../device.less';
</style>
<style type="text/css">
.stateTag{
  height: 28px;
  line-height: 28px;
  font-size: 10px;
}
.stateTag .ivu-tag-dot-inner{
  width: 8px;
  height: 8px;
  top:  0;
}

.tbDeviceId div{
  min-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis
}
.tb_pop_address div {
  width: 100%;
}
.tb_pop .ivu-tag-dot {
  border-width: 0px !important;
}
</style>
