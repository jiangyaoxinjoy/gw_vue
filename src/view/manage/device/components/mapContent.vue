<template>
<div>
  <Spin size="large" fix v-if="loading"></Spin>
  <baidu-map
    ak="QPPRPzUYlpEqGNkyylz2OuTBQCeWVHAd"
    class="bm-view"
    :center="{lng: centerMark.lng, lat: centerMark.lat}"
    :zoom="zoom"
    :min-zoom="16"
    @ready="map_handler"
    :style="{'height':mapHeight+'px'}"
    :scroll-wheel-zoom="true"
    @moveend="mapMoveend"
  >
    <p class="mapHeader">
      <router-link to="data">
        <Button type="text" icon="ios-arrow-back" to="data">返回</Button>
      </router-link>
      <Button type="text" icon="md-share-alt" @click="resetMap">恢复视图</Button>
    </p>
    <bm-view :style="{flex:1, height: mapInnerHeight +'px',width: '100%'}">
    </bm-view>
    <bml-marker-clusterer 
      :averageCenter="true"
      :styles = "style"
      >
      <bm-marker
        v-for="marker of markersData"
        :key="marker.Id"
        @click="showInfo(marker)"
        :icon="{ url: (marker.state == '70' || marker.state == '80') ? locationE : locationP, size: {width: 30, height: 30}}"
        :position="{lng: marker.lng, lat: marker.lat}">
      </bm-marker>
    </bml-marker-clusterer>
    <bm-info-window
      :position="{lng: infoWindow.lng, lat: infoWindow.lat}"
      :show="infoWindowShow"
      @close="infoWindowClose"
      @open="infoWindowOpen"
      :width=0
      :height=0
      :autoPan="false"
    >
      <div class="info_title">
        <Tag type="dot" :color="stateColor">{{infoWindow.state | filterStateText}}</Tag>
        <span>{{infoWindow.device_id}}</span>
      </div>
      <p v-text="infoWindow.address"></p>
    </bm-info-window>
  </baidu-map>
</div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmMarker, BmInfoWindow, BmlMarkerClusterer, BmView } from 'vue-baidu-map'

export default {
  name: 'fullMap',
  components: {
    BmlMarkerClusterer,
    BaiduMap,
    BmMarker,
    BmInfoWindow,
    BmView
  },
  filters: {
    filterStateText (val) {
      if (val === '70') {
        return '异常'
      } else if (val === '80') {
        return '故障'
      } else {
        return '在线'
      }
    }
  },
  data () {
    return {
      infoPosition: {},
      zoom: 16,
      infoWindowShow: false,
      infoWindow: {},
      pointsView: [],
      markers: [],
      markersData: [],
      loading: true,
      style: [
        {url: require("@/assets/images/juhe1.png"), size: {width: 53, height: 53}},
        {url: require("@/assets/images/juhe2.png"), size: {width: 53, height: 53}},
        {url: require("@/assets/images/juhe3.png"), size: {width: 53, height: 53}},
        {url: require("@/assets/images/juhe4.png"), size: {width: 53, height: 53}},
        {url: require("@/assets/images/juhe5.png"), size: {width: 53, height: 53}}
      ],
      locationE: require("@/assets/images/location2.png"),
      locationP: require("@/assets/images/location1.png")
    }
  },
  created () {
    if (this.centerMark.lng === 0) {
      this.$router.push({ path: 'data' })
    }
  },
  watch: {
    deviceParams: {
      handler () {
        this.loading = true
        this.infoWindowClose()
        this.addMarker()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'deviceParams'
    ]),
    ...mapState({
      centerMark: state => state.device.centerMark
    }),
    stateColor () {
      if (this.infoWindow.state !== '70' && this.infoWindow.state !== '80') {
        return 'success'
      } else {
        return 'error'
      }
    },
    mapHeight () {
      return this.$store.state.user.windowH
    },
    mapInnerHeight () {
      return this.mapHeight - 35
    }
  },
  methods: {
    ...mapActions(['deviceMapList']),
    map_handler ({ BMap, map }) {
      this.BMap = BMap
      this.map = map
      map.enableScrollWheelZoom() // 启动滚轮放大缩小
      map.enableContinuousZoom() // 启用地图惯性拖拽
      this.addMarker()
    },
    showInfo (item) {
      this.infoWindow = item
      this.infoWindowShow = true
    },
    addMarker () {
      // console.log(11)
      if (!this.BMap) return false
      var map = this.map
      var bounds = map.getBounds()
      this.deviceParams.minLatitude = bounds.getSouthWest().lat  
      this.deviceParams.maxLatitude = bounds.getNorthEast().lat 
      this.deviceParams.minLongitude = bounds.getSouthWest().lng 
      this.deviceParams.maxLongitude = bounds.getNorthEast().lng 
      this.getMapDeviceList()
    },
    infoWindowClose (e) {
      this.infoWindowShow = false
    },
    infoWindowOpen (e) {
      this.infoWindowShow = true
    },
    resetMap () {
      this.loading = true
      var map = this.map
      map.centerAndZoom(new BMap.Point(this.centerMark.lng, this.centerMark.lat), this.zoom)
    },
    clickHandler (e) {
      this.infoWindowShow = true
    },
    getMapDeviceList () {
      if ( !_.isString(this.deviceParams.addkeys)) return
      this.deviceMapList(this.deviceParams).then(res => {
        this.markersData = res.data === null ? [] : res.data
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    mapMoveend (e) {
      this.addMarker()
    }
  }
}
</script>
<style lang="less" scoped>
  .bm-view{
    width: 100%;
  }
  .info_title{
    white-space: nowrap;
    padding-bottom: 10px;
    span{
      margin-right: 10px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
  .mapHeader{
    display: flex;
    flex-direction:row-reverse;
  }
</style>
