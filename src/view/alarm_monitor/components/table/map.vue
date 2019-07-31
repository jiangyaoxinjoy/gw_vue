<template>
   <!-- :center="{ lng: curMarker.lng, lat: Number(curMarker.lat) + 0.005 }" -->
  <baidu-map
    ak="QPPRPzUYlpEqGNkyylz2OuTBQCeWVHAd"
    class="bm-view"
    :zoom="zoom"
    @ready="map_handler"
    :scroll-wheel-zoom="true"
    :style="{ 'height': mapHeight+'px', 'width': '100%' }"
  >
    <Spin size="large" fix v-if="loading"></Spin>
    <bm-marker :position="curMarker"  @click="infoWindowOpen"></bm-marker>
    <template v-if="hasAlertMarker">
      <bm-info-window
        :show="infoWindowShow"
        @close="infoWindowClose"
        :position="curMarker"
        :height="450"
        :width="450"
        :autoPan="true"
      >
        <!-- <Spin size="large" fix v-if="loadingWin"></Spin> -->
        <template v-if="JSON.stringify(alarmInfo) != '{}'">
          <map-info :alarmInfo="alarmInfo"/>
        </template>
      </bm-info-window>
    </template>
  </baidu-map>
</template>
<script>
import mapInfo from './components/mapInfo/mapInfo.vue'
import { mapState } from 'vuex'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmMarker, BmInfoWindow } from 'vue-baidu-map'

export default {
  name: 'BaiMap',
  components: {
    mapInfo,
    BaiduMap,
    BmMarker,
    BmInfoWindow
  },
  data () {
    return {
      loading: true,
      zoom: 16,
      infoWindowShow: false,
      showTels: false,
      hasAlertMarker: false
      // loadingWin: true
    }
  },
  computed: {
    ...mapState({
      alarmInfo: state => state.alert.alarmInfo,
      mapHeight: state => state.user.windowH - 60,
      curMarker: state => state.alert.curMarker
    })
  },
  watch: {
    // alarmInfo (val) {
    //   if (JSON.stringify(val) !== '{}') {
    //     setTimeout(() => {
    //       this.loadingWin = false
    //     })
    //   }
    // },
    curMarker () {
      this.initMap()
    }
  },
  methods: {
    map_handler ({ BMap, map }) {
      this.map = map
      this.BMap = BMap
      this.initMap()
    },
    initMap () {
      if (!this.BMap) return false
      var BMap = this.BMap
      var map = this.map
      if (this.curMarker.lng === 0) {
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            console.log(r.point.lng)
            this.curMarker = { lng: r.point.lng, lat: r.point.lat }
            map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), this.zoom)
          } else {
            alert('failed' + this.getStatus())
          }
        }, { enableHighAccuracy: true })
        console.log(1111)
      } else {
        console.log(2222)
        this.hasAlertMarker = true
        setTimeout(() => {
          this.infoWindowShow = true
        }, 200)
        map.centerAndZoom(new BMap.Point(this.curMarker.lng, Number(this.curMarker.lat) + 0.005), this.zoom)
      }
      this.loading = false
    },
    infoWindowClose (e) {
      this.infoWindowShow = false
    },
    infoWindowOpen () {
      this.infoWindowShow = true
    }
  },
  created () {

  },
  beforeDestroy () {
    this.$store.commit('setCurMarker', { lat: 0, lng: 0 })
  }
}
</script>
<style lang="less">
  .bm-view{
    width: 100%;
  }
</style>
