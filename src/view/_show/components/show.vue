<template>
  <div class="show">
    <!-- loading start -->
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="page_loading"></Icon>
      <div>Loading</div>
    </Spin>
    <!-- loading end -->
    <!-- 筛选框 start-->
    <Companyselect
    class="headerSelect"
    v-if="comId === 1"
    :companyList="companyList"
    :selectCompany="selectCompany"
    @changeComId="comChange"/>
    <!-- 筛选框 end -->
    <Menu mode="horizontal" active-name="1" class="menu">
      <div class="wrapper-header-nav-list">
        <img :src="logo"/>
        <h1 class="bb">{{system_name}}</h1>
      </div>
    </Menu>
    <Layout>
      <Content class="map_content">
        <div class="mapHeader" :style="{width: (windowWidth - 350) +'px'}">
          <div class="badge_block" @click="alertTypeChoose(0)" :class="alarmType === 0? 'badge_active': ''">
            <Badge :count="detail.alertTotal" type="primary">
              <Icons :size="28" type="xiaohuoshuan"/>
              <span class="badge_label">全部</span>
            </Badge>
          </div>
          <div class="badge_block" @click="alertTypeChoose(1)" :class="alarmType === 1? 'badge_active': ''">
            <Badge :count="detail.prec" type="success">
              <Icons :size="28" type="shuiyaxiaxian"/>
              <span class="badge_label">水压异常</span>
            </Badge>
          </div>
          <div class="badge_block" @click="alertTypeChoose(2)" :class="alarmType === 2? 'badge_active': ''">
            <Badge class="badge" :count="detail.opc" type="info">
              <Icons :size="28" type="famen"/>
              <span class="badge_label">阀门打开</span>
            </Badge>
          </div>
          <div class="badge_block" @click="alertTypeChoose(3)" :class="alarmType === 3? 'badge_active': ''">
            <Badge class="badge" :count="detail.downc" type="warning">
              <Icons :size="28" type="-FireHydrant"/>
              <span class="badge_label">撞倒</span>
            </Badge>
          </div>
          <div class="badge_block" @click="alertTypeChoose(4)" :class="alarmType === 4? 'badge_active': ''">
            <Badge class="badge" :count="detail.lossc" type="error">
              <Icons :size="30" type="jingbao"/>
              <span class="badge_label">设备异常</span>
            </Badge>
          </div>                          
        </div>
        <div id="XSDFXPage" class="XSDFXPage" :style="{height: mapHeight +'px'}"></div>
        <Button @click="value1 = !value1" size="small" type="warning" class="drawer_control" :style="{bottom: (mapHeight/2 + 240) +'px'}">{{value1 ? '隐藏列表' : '显示列表'}}</Button>
        <div class="overlay" :style="{bottom: (mapHeight - 450)/2 +'px'}">
          <Drawer width="100%" :transfer="false" :mask="false" inner :closable="false" v-model="value1" class-name="drawer_wrap">
            <CellGroup @on-click="openAlarm">
              <Cell
                v-for="(item, index) in alarmData"
                :extra="item.hearttime | timeYearFilter"
                :label="item.address"
                :key="item.Id"
                :name="index"
              >
              <Button v-if="(item.state === '10' && alarmType === 0) || alarmType === 1 " size="small" type="success">{{item.state | alarmTypeFilter}}</Button>
              <Button v-if="(item.state === '20' && alarmType === 0) || alarmType === 2" size="small" type="info">{{item.state | alarmTypeFilter}}</Button>
              <Button v-if="(item.state === '30' && alarmType === 0) || alarmType === 3" size="small" type="warning">{{item.state | alarmTypeFilter}}</Button>
              <Button v-if="(item.state === '70' && alarmType === 0) || alarmType === 4" size="small" type="error">{{item.state | alarmTypeFilter}}</Button>
            </Cell>
            </CellGroup>
          </Drawer>
        </div>
        <div class="charts_list" style="width: 350px">
          <p class="cherts_header"> {{alertpie.title}}</p>
          <chart-pie2 
            :style="{height: (mapHeight*0.28 -45) + 'px'}" 
            :value="alertpie.value"  
            :text="alertpie.title"
            :height="mapHeight*0.28 -45"
            backgroundColor="rgba(9,18,32,0.7)"></chart-pie2>
          <p class="cherts_header"> {{unusualpie.title}}</p>
          <chart-pie2 
            :style="{height: (mapHeight*0.28 - 45) + 'px'}" 
            :value="unusualpie.value"  
            :text="unusualpie.title"
            backgroundColor="rgba(9,18,32,0.7)"></chart-pie2>
          <p class="cherts_header"> 设备报警折线图</p>
          <chart-line2 
            :style="{height: (mapHeight*0.44 - 45) + 'px'}" 
            :comId="selectCompany"
            backgroundColor="rgba(9,18,32,0.7)"
          ></chart-line2>
        </div>
      </Content>
    </Layout>

    <Modal
      v-model="notifyModal"
      class="notifyModal"
      :footer-hide="true">
      <div slot="header" class="header">
        <h3> {{notifyData.name}} <span>{{notifyData.tel}}</span></h3>
      </div>
      <div class="content">
        <div v-for="notify in notifyData.list" class="wrap" :key="notify.Id">
          <Steps
            :current="notify.state == 1 ? 3 : 2"
            :status="notify.state == 1 ? 'finish' : 'error'"
            size='small'
            direction="horizontal"
          >
            <Step class="stepitem" :title="notify.sendtime | time"></Step>
            <Step class="stepitem" :title="notify.type | notifyTypeMethod"></Step>
            <Step class="stepitem" :title="[notify.receivetime, notify.state] | stateFilter"></Step>
          </Steps>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import InforCard from '_c/info-card'
import { ChartPie2, ChartLine2 } from '_c/charts'
import { mapActions, mapState, mapGetters} from 'vuex'
import Icons from '_c/icons/'
import SquareOverlay from '@/libs/marker.js'
import { getClientWidth, getAlertType } from '@/libs/tools.js'
import { Companyselect } from '_c/input/index'
import logo from '@/assets/images/logomin.png'
import config from '@/config'

export default {
  name: 'show',
  components: {
    Companyselect,
    InforCard,
    ChartPie2,
    Icons,
    ChartLine2
  },
  data () {
    return { 
      logo: '',
      selectCompany: 1,
      windowWidth: getClientWidth(),
      notifyModal: false,
      notifyData: "",
      value1: true, //隐藏列表
      value2: true, //隐藏图表
      columns: [ 
        {
          title: '地区',
          key: 'area',
          className: 't_hd'
        },
        {
          title: '报警',
          key: 'alarmNum',
          className: 't_hd'
        },
        {
          title: '异常',
          key: 'abnormalNum',
          className: 't_hd'
        },
        {
          title: '总数',
          key: 'totalNum',
          className: 't_hd'
        }
      ],
      alarmType: 0,
      alarmData: [],
      detail: "",
      alertpie: {
        value: [],
        title: '报警统计',
        type: 'pie'
      },
      unusualpie: {
        value: [],
        title: '异常统计',
        type: 'pie'
      },
      alertInfo: "",
      chooseAlert: {},
      zoom: 16,
      canGetUnalertDevice: false,
      deviceParams: {},
      unalertDeviceList: [],
      loading: true,
      markersProduct: [],
      markersDeviceProduct: [],
      style1: require("@/assets/images/juhe1.png"),
      style2: require("@/assets/images/juhe2.png"),
      style3: require("@/assets/images/juhe3.png"),
      style4: require("@/assets/images/juhe4.png"),
      style5: require("@/assets/images/juhe5.png"),
      deviceIcon: require("@/assets/images/markerdevice.png"),
    }
  },
  beforeCreate () {
    this.$store.commit('getWindowH')
    window.onresize = () => {
      this.$store.commit('getWindowH')
      this.windowWidth = getClientWidth()
    }
  },
  created () {
    this.initPage()
    if (this.companyList.length === 0) {
      this.getCompanyList()
    }
    this.sendMessage({'token': this.token}) 
  },
  computed: {
    ...mapState({
      mapHeight: state => state.user.windowH - 60,
      comId : state => state.user.comId,
      companyList: state => state.user.companyList,
      system_name: state => state.user.system_name,
      companyIcon: state => state.user.companyIcon,
      baseUrl: state => state.user.baseUrl,
      socket: state => state.websocket.socket,
      token: state => state.user.token,
    }),
    ...mapGetters({
      // location: 'getDefalultLocation'
    }),   
  },
  watch: {
    unalertDeviceList(val) {
      this.setUnalertMarker()   
    },
    companyIcon: {
      handler(val) {
        if (val != '') {
          this.logo = this.baseUrl + val.substring(2) 
        } else {
          this.logo = logo
        }        
      },
      immediate: true
    },
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
        this.initPage()  
      },
      deep:true
    },
    'socket.isConnected': {
      handler(val) {
        if(val) {
          this.sendMessage({'token': this.token}) 
        }
      },
      deep:true
    },
  },
  methods: {
    ...mapActions(['getShowUnalertDevice','getDevicemonitoring', 'getShowAlertInfo','getCompanyList','getStatisticalChart','sendMessage']),
    //选中报警种类
    alertTypeChoose (type) {
      this.alarmType = type
      this.getDeviceAlert()
      // this.classifyAlert()
    },
    //报警状态的标记点
    setMarker () {
      if(!this.map) return
      var map = this.map
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers()      
      }
      if (this.infoWindow) {
        this.infoWindow.close()
      }
      if (this.alarmData.length === 0 ) return  
      var markers = new Array()
      var points = new Array();
      this.alarmData.forEach( (item,key) => {
        var point = new BMap.Point( item.lng, item.lat)
        points.push(point)
        var myMarker = new SquareOverlay({lng:item.lng, lat:item.lat}, 36, map, item.device_id, this.addClickHandlerProduct)
        var marker = new BMap.Marker(point)
        markers.push(myMarker)
      })
      this.markersProduct = markers //聚合的点
      map.setViewport(points) //显示在视野范围内
      this.markerClustererProduct() //聚合
    },
    markerClustererProduct () {
      // var allMaerker = _.concat(this.markersProduct, this.markersDeviceProduct);
      var map = this.map
      var markerClusterer = new BMapLib.MarkerClusterer(map, {
        markers: this.markersProduct,
        minClusterSize: 3, //最小的聚合数量，小于该数量的不能成为一个聚合，默认为2
        styles : [
          {
            url:  this.style1,
            size: new BMap.Size(53,53)
          },
          {
            url:  this.style2,
            size: new BMap.Size(53,53)
          },
          {
            url:  this.style3,
            size: new BMap.Size(53,53)
          },
          {
            url:  this.style4,
            size: new BMap.Size(53,53)
          },
          {
            url:  this.style5,
            size: new BMap.Size(53,53)
          }
        ]
      });
      this.markerClusterer = markerClusterer
      console.log(markerClusterer)
    },
    //标记点传入的点击显示窗口的方法
    addClickHandlerProduct (center,device) {
      this.chooseAlert.lng = center.lng
      this.chooseAlert.lat = center.lat
      this.chooseAlert.device_id = device
      this.markerWindow()
    },
    //报警标记点的窗口
    markerWindow () {
      var map = this.map
      var point = new BMap.Point( this.chooseAlert.lng, this.chooseAlert.lat);
      var centerPoint = new BMap.Point( this.chooseAlert.lng, Number(this.chooseAlert.lat) + 0.005);
      // if (this.chooseAlertList.length === 0) return
      var map = this.map
      map.centerAndZoom(centerPoint, this.zoom)
      var opts = {
          width : 350,     // 信息窗口宽度
          height: 450,     // 信息窗口高度
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
      var infoWindow = new BMap.InfoWindow(sContent,opts);
      this.infoWindow = infoWindow
      map.openInfoWindow(infoWindow,point)
      this.getShowAlertInfo({ "device_id": this.chooseAlert["device_id"],"alarmType": this.alarmType})
      .then( res => {
        setTimeout(() => {
          this.$windowinfo(res, false)
        })
      })
    },
    //点击报警列表
    openAlarm (index) {
      var copy = _.cloneDeep(this.alarmData[index])
      this.chooseAlert = copy
      this.$nextTick( () => {
         this.markerWindow()
      })
    },
    changLoginOutState (val) {
      this.ifLoginOut = val
    },
    comChange (val) {
      this.selectCompany = val
      this.alarmType = 0
      this.initPage()
    },
    getDeviceAlert () {
      var comId = this.comId === 1 ? this.selectCompany : this.comId
      this.getDevicemonitoring({'companyId': comId, 'alertType': this.alarmType}).then(res => {
        console.log(res)
        this.alarmData = res.alertList != null ? res.alertList : []
        var count = {}
        count.downc = res.downc
        count.lossc = res.lossc
        count.opc = res.opc
        count.prec = res.prec
        count.alertTotal = res.prec+res.opc+res.lossc+res.downc 
        this.detail = count
        this.setMarker()
      })
    },
    initPage () {
      var comId = this.comId === 1 ? this.selectCompany : this.comId
      this.getDeviceAlert(0)
      this.getStatisticalChart({'companyId': comId}).then( res => {
        this.alertpie.value = [
          {value: res.prec, name: '水压异常'},
          {value: res.opc, name: '阀门打开'},
          {value: res.downc, name: '倾倒'}
        ]

        this.unusualpie.value = [
          {value: res.lossc, name: '失联'},
          {value: res.sigc, name: '低信号'},
          {value: res.powerc, name: '低电量'}
        ]
      })
    },
    //获取没有报警的标记点
    getUnalertDevice () {
      if (!this.canGetUnalertDevice || !this.map) return
      var map = this.map;
      var bounds = map.getBounds()
      this.deviceParams.minLatitude = bounds.getSouthWest().lat
      this.deviceParams.maxLatitude = bounds.getNorthEast().lat
      this.deviceParams.minLongitude = bounds.getSouthWest().lng
      this.deviceParams.maxLongitude = bounds.getNorthEast().lng
      this.deviceParams.companyId = this.comId === 1 ? this.selectCompany : this.comId
      this.getShowUnalertDevice(this.deviceParams).then( res => {
        this.unalertDeviceList = res === null ? [] : res
      })
    },
    //没有报警的普通标记点
    setUnalertMarker () {
      if (!this.map ) return
      if (this.markerClusterer) {
        this.markerClusterer.removeMarkers(this.markersDeviceProduct)
      }
      this.deletePoint()
      var map = this.map
      this.markersDeviceProduct = []
      this.unalertDeviceList.forEach( (val,key) => {
        var point = new BMap.Point(val.lng, val.lat)
        var myIcon = new BMap.Icon(this.deviceIcon,new BMap.Size(32,32));
        var marker = new BMap.Marker(point,{icon: myIcon})
        this.markersDeviceProduct.push(marker)
        map.addOverlay(marker)
        marker.setLabel(val.address)
        var opts = {
          width : 200,     // 信息窗口宽度
          height: 100,     // 信息窗口高度
          title :  `设备号： ${val.device_id}`, // 信息窗口标题
          enableMessage:true//设置允许信息窗发送短息
        }
        var infoWindow = new BMap.InfoWindow(`地址：${val.address}`, opts);  // 创建信息窗口对象 
        marker.addEventListener("click", () => {
          map.openInfoWindow(infoWindow,point); //开启信息窗口
        })       
      })
      var curClusterer = this.markerClusterer.getMarkers()
      console.log(curClusterer)
      var removeClusterer = _.difference(curClusterer,this.markersProduct) 
      this.markerClusterer.removeMarkers(removeClusterer )
      this.markerClusterer.addMarkers(this.markersDeviceProduct)
    },
     //删除普通标记点
    deletePoint (){
      if (!this.map ) return
      var map = this.map
      var allOverlay = map.getOverlays();
      console.log(allOverlay)
      if (_.isArray(allOverlay)) {
        for(var i = 0; i<allOverlay.length; i++) {
          //删除指定经度的点       
          if (allOverlay[i].getIcon ) {
            map.removeOverlay(allOverlay[i]);
          }
        }
      }      
    }
  },
  mounted() {
    // 百度地图API功能
    // 创建Map实例
    var map = new BMap.Map("XSDFXPage");
    this.map = map
    // 初始化地图,设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(this.location.lng,this.location.lat), this.zoom);
    // 添加地图类型控件
    // map.addControl(new BMap.MapTypeControl());  
    // 设置地图显示的城市 此项是必须设置的
    map.setCurrentCity(this.location.city);    
    // 开启鼠标滚轮缩放      
    map.enableScrollWheelZoom(true);
    map.setMapStyleV2({     
      styleId: config.showMapStyleId
    });
    map.addEventListener("zoomend", (e) => {
      var ZoomNum = map.getZoom();
      if(ZoomNum > 15) {
        this.canGetUnalertDevice = true
      } else {
        this.canGetUnalertDevice = false
      }
    });
    map.addEventListener("dragend",this.getUnalertDevice)
    map.addEventListener("tilesloaded", () => {
      setTimeout( () => {
        this.loading = false
      },1000)
    });
  }
}
</script>
<style lang="less" scoped>
@import './show.less';
</style>
<style type="text/css">
  .XSDFXPage{
    width: 100%;
  }
  .headerSelect .ivu-select-dropdown {
    background: rgba(9,18,32,0.6);
    color: #fff;
  }  
  .headerSelect .ivu-select-item {
    color: #fff;
  }
  .headerSelect .ivu-select-item-selected,.headerSelect .ivu-select-item:hover {
    color: #02a2aa;
  }
  .headerSelect .ivu-select-item:hover {
    background-color: rgba(142,255,246,0.1);
  }
  .show .overlay .ivu-cell-extra,.show .overlay .ivu-cell-label{
    color: #fff;
  }
  .show .ivu-cell-label{
    padding-top: 10px;
  }
  .show .ivu-cell-footer{
    top: 32%;
  }
  .show .ivu-cell:hover {
    background: rgba(142,255,246,0.1);
  }
  .show .ivu-drawer-content{
    background: rgba(9,18,32,0.6);
  }
  .show .ivu-badge-count{
    top:  5px;
    right: 4px;
  }
  .show .info_header{
    height: 70px;
  
  }
  .show .info_header img {
    width: 60px;
    height: auto
  }
  .show .headerSelect .ivu-select-selection {
    background-color: #00070f;
  }
  .show .ivu-menu-horizontal.ivu-menu-light:after {
    background: #00070f;
  }
  .show .headerSelect.ivu-select{
    color: #fff;
  } 
  .show .info{
    height: 450px;
  }
  .show .step_wrap {
    margin-left: 12px;
  }
  .show .tel{
    margin-right: 53px;
  }
  .show .step_block .step_btn{
    width: calc(100% - 50px);
  }
  .show .ivu-card-bordered {
    min-height: 440px;
  }
  .show .drawer_wrap .ivu-cell{
    padding: 5px 0;
  }
  .show .ivu-spin-fix{
    z-index: 1001;
    background-color: rgba(9,18,32,0.9);
  }
  
</style>