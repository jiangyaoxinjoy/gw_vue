<template>
  <div class="gw-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-pane">
        <Table
          :columns="columns"
          :data="alertList"
          @on-row-click="tablecellClick"
          :loading="loading"
          :highlight-row="true"
          ref="table"
          :height="contentHeight"
        >
          <div class="table_filter" slot="header">
            <RadioGroup class="group1" v-model="params.alarmType" type="button" @on-change="alarmTypeChange">
              <!-- <Radio :label="0">全部</Radio> -->
              <Radio v-for="item in alarmTypeList" :label="item.key"  :key="item.id">{{item.title}}</Radio>
            </RadioGroup>
            <Companyselect :width="150" :companyList="companyList" :selectCompany="params.companyId" @changeComId="companyChange"/>
          </div>
          <template slot="state" slot-scope="{ row, index }">
            <span v-if="params.alarmType === 0">{{row.state | alarmTypeFilter}}</span>
            <span v-if="params.alarmType != 0">{{params.alarmType | chooseTypeFilter}}</span>
          </template>
          <template slot="address" slot-scope="{ row, index }">
            <div class="rowAddress">
              {{row.address}}
              <span v-if="row.descrip" class="rowDescrip">({{row.descrip}})</span>
            </div>
          </template>
          <Page class-name='totalfr' slot="footer" :total="totalCount" :page-size="params.limit"  show-total :current="1" @on-change="changePage"></Page>
        </Table>
      </div>
      <div slot="right" class="split-pane">
          <!-- :center="curMarker"   -->
        <baidu-map 
          class="bm-view" 
          :ak="mapAk"
          :style="{height: contentHeight +'px'}"               
          :zoom="zoom"
          :center="defaultCity"
          @ready="handler">
        </baidu-map>
      </div>
    </Split>
  </div>
</template>

<script>
// import expandRow from './components/table/expanRow.vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { Companyselect } from '_c/input/index'
import { getDate, getAlertType } from '@/libs/tools'
// import Vue from 'vue'
export default {
  name: 'home',
  components: {
   BaiduMap,
   // expandRow, 
   Companyselect
  },
  data () {
    return {
      split: 0.4,
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
      // timer: null,
      columns: [
        // {
        //   type: 'expand',
        //   width: 40,
        //   render: (h, params) => {
        //     return h(expandRow, {
        //       props: {
        //         row: params.row
        //       }
        //     })
        //   }
        // },
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
        { title: '地址', key: 'address', minWidth: 200, slot: 'address' }
      ],
      zoom: 16,
      curAlert: '',
      point: '',
      // defaultCity:''
    }
  },
   computed: {
    ...mapState({
      alarmTypeList: state => state.alert.alarmTypeList,
      contentHeight: state => state.user.windowH - 60,
      companyList: state => state.user.companyList,
      comId: state => state.user.comId,
      token: state => state.user.token,
      socket: state => state.websocket.socket,
      mapAk: state => state.user.mapAk
      // defaultCity:  state => state.user.defaultCity
    }),
    ...mapGetters({
      defaultCity: 'getDefalultCity'
    }),
  },
  created () {
    // console.log(this)
    if(!this.socket.isConnected) {
      this.$connect()
    }
    // this.defaultCity = this.$store.getters.getDefalultCity
    this.initPage()
  },
  beforeDestroy() {
    this.$disconnect()
  },
  watch: {
    'socket.message': {
      handler(val) {
        console.log(val)
        var alertText = getAlertType(val.alertType)
        if (val.alertType) {
          this.$Notice.warning({
            title: '报警通知',
            desc: `智能消火栓 ${val.deviceId} ${alertText}`,
            duration: 4
          })
        }  
        this.setTimeGetTableData()     
      },
      deep:true
    },
    'socket.isConnected': {
      handler(val) {
        if(val) {
          this.sendMessage({'token': this.token,'page':'index'}) 
        }
      },
      deep:true,
      immediate: true
    },   
  },
  methods: {
    ...mapActions(['getAlertList', 'getCompanyList','getCity', 'getDeviceAlertInfo','sendMessage']),
    initPage () {
      if (this.companyList.length === 0) {
        this.getCompanyList()
      }
      //设置公司
      if(this.comId === 1) {
        this.params.companyId = 0
      } else {
        this.params.companyId = this.comId
      }      
      //获取报警列表
      this.queryTableData()  
      // this.sendMessage({'token': this.token,'page':'index'})
    },
    setTimeGetTableData () {
      let data = _.cloneDeep(this.params)
      data.offset = (data.pageNum - 1) * data.limit
      this.getAlertList(data).then(res => {
        this.alertList = res.list == null ? [] : res.list
        this.totalCount = res.count
        //要修改
        var flag =  _.findIndex(this.alertList, ['device_id', this.curAlert.device_id])        
        // this.curAlert = ''
        if (res.count > 0) {
          if( flag === -1) {
            this.alertList[0]['_highlight'] = true
            this.curAlert = this.alertList[0]
            setTimeout( () => {
              this.setMarker()
            },500)
          } else {
            var sameFlag =  _.some(this.alertList,this.curAlert);
            this.alertList[flag]['_highlight'] = true
            this.curAlert = this.alertList[flag]            
            console.log(sameFlag)
            if (!sameFlag) {
              setTimeout( () => {
                this.setMarker()
              },500)
            }
          } 
        } else {
          this.curAlert = ''
          this.handlerNoMarker()
        } 
      })
    },
    queryTableData () {
      this.loading = true
      let data = _.cloneDeep(this.params)
      data.offset = (data.pageNum - 1) * data.limit
      // 请求数据
      this.getAlertList(data).then(res => {
        this.alertList = res.list == null ? [] : res.list
        this.totalCount = res.count
        if (res.count > 0) {
          this.alertList[0]['_highlight'] = true
          this.curAlert = this.alertList[0]
          setTimeout( () => {
            this.setMarker()
          },500)
        } else {
          this.curAlert = ''    
          this.handlerNoMarker()  
        }
      })
      this.loading = false
    },
    tablecellClick(row, index) {
      this.curAlert = this.alertList[index]
      setTimeout( () => {
        this.setMarker()
      },500)
    },
    changePage (val) {
      this.alertList = []
      this.curAlert = ''
      this.params.pageNum = val     
      this.queryTableData()
    },
    alarmTypeChange (val) {
      this.alertList = []
      this.curAlert = ''
      this.params.alarmType = val
      this.params.pageNum = 1
      this.queryTableData()
    },
    companyChange (val) {
      this.alertList = []
      this.curAlert = ''
      this.params.pageNum = 1
      this.params.companyId = val
      this.queryTableData()
    },
    handler ({BMap, map}) {
      this.map = map
      this.BMap = BMap      
      map.enableScrollWheelZoom(); 
    },
    handlerNoMarker () {
      if( !this.map) return
      var map = this.map
      this.removeMarkerEvent()
    },
    setMarker () {
      if( !this.map) return
      var map = this.map
      this.removeMarkerEvent()
      if (this.curAlert === '') return
      this.point = new BMap.Point(this.curAlert.lng, this.curAlert.lat)
      //让标记点显示在中点偏下的位置
      var centerPoint = new BMap.Point(this.curAlert.lng, Number(this.curAlert.lat) + 0.006)
      map.centerAndZoom(centerPoint, this.zoom);
      var marker = new BMap.Marker(this.point)
      map.addOverlay(marker)     
      marker.addEventListener('click', this.markerWindow);
      this.markerWindow()
    },
    markerWindow () {
      var map = this.map
      var opts = {
          width : 450,     // 信息窗口宽度
          height: 500,     // 信息窗口高度
      };
      var sContent =`
        <div id="windowInfo">
          <div class="ivu-spin ivu-spin-large ivu-spin-fix">
            <div class="ivu-spin-main">
              <span class="ivu-spin-dot"></span> 
              <div class="ivu-spin-text"></div>
            </div>
          </div>
        </div>`;
      if (this.curAlert === '') return
      var infoWindow = new BMap.InfoWindow(sContent,opts);
      this.infoWindow = infoWindow
      map.openInfoWindow(infoWindow,this.point)
      this.getDeviceAlertInfo({'device_id': this.curAlert.device_id,'alarmType': this.params.alarmType}).then( res => {
        setTimeout(() => {
          this.$windowinfo(res, true)
        })
      })
    },
    removeMarkerEvent () {
      var map = this.map
      var allOverlay = map.getOverlays();
      for(var i = 0;i<allOverlay.length;i++) {  
        allOverlay[i].removeEventListener("click", this.markerWindow);
        map.removeOverlay(allOverlay[i]);
      }
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
