<template>
  <div class="monitoring_map">
    <baidu-map 
      class="bm-view" 
      ak="QPPRPzUYlpEqGNkyylz2OuTBQCeWVHAd"
      :style="{height: mapHeight +'px'}"
      center="上海"
      :zoom="zoom"
      @ready="handler">
    </baidu-map>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
  name: "Map",
  components: {
    BaiduMap
  },
  data() {
    return {
      zoom: 16,
      mapshow: true
    }
  },
  computed: {
    ...mapState({
      mapHeight: state => state.user.windowH - 60,
      curMarker: state => state.alert.curMarker,
      curDeviceId: state => state.alert.curDeviceId,
    }),
    ...mapGetters(['getDefalultCity'])
  },
  watch: {
    curDeviceId: {
      handler(val){
        if( val != '' ){
          setTimeout(() => {
            this.setMarker()
          }, 500)
        } else {
          this.handlerNoMarker()
        }
      }
    }
  },
  methods: {
    ...mapActions(['getDeviceAlertInfo']),
    handler ({BMap, map}) {
      this.map = map
      this.BMap = BMap      
      map.enableScrollWheelZoom();    
    },
    handlerNoMarker () {
      if( !this.map) return
      var map = this.map
      map.centerAndZoom(this.getDefalultCity, this.zoom);
    },
    setMarker() {
      if( !this.map) return
      var map = this.map
      this.removeMarkerEvent()
      if ( this.curDeviceId === '' || !this.curMarker.lng) return
      var point = new BMap.Point(this.curMarker.lng, this.curMarker.lat)
      //让标记点显示在中点偏下的位置
      var centerPoint = new BMap.Point(this.curMarker.lng, Number(this.curMarker.lat) + 0.006)
      var marker = new BMap.Marker(point)
      map.addOverlay(marker)
      map.centerAndZoom(centerPoint, this.zoom);
      var opts = {
          width : 450,     // 信息窗口宽度
          height: 500,     // 信息窗口高度
      };
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
      var point = new BMap.Point(this.curMarker.lng, this.curMarker.lat);
      var infoWindow = new BMap.InfoWindow(sContent,opts);
      this.infoWindow = infoWindow
      map.openInfoWindow(infoWindow,point)
      this.getDeviceAlertInfo({'device_id': this.curDeviceId}).then( res => {
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
<style type="text/css">
  .monitoring_map .ivu-card-bordered {
    min-height: 490px;
  }
</style>