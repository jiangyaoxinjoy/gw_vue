<template>
  <Modal
      v-model="modal"
      :width="60"
      :footer-hide="true"
      @on-visible-change="stateChange">
    <div style="background:#eee;padding: 20px">
      <Card :bordered="false">
          <p slot="title">设备用水量折线图: {{deviceId}}</p>
          <form slot="extra" :action="actionUrl+'deviceWaterExport'" method="post">
            <input type="text" hidden name="deviceId" :value="deviceId">
            <input type="text" hidden name="token" :value="token">
            <input type="text" hidden name="startTime" :value="selectTime[0]">
            <input type="text" hidden name="endTime" :value="selectTime[1]">
            <Button html-type="submit" class="exprot" type="primary" size="small"><Icon type="ios-download-outline"></Icon> 导出</Button>
          </form>
          <DatePicker 
            type="daterange" 
            :options="options" 
            placement="bottom-start" 
            placeholder="Select date" 
            style="width: 200px"  
            :value="selectTime"
            @on-change="timeChange"
          ></DatePicker>
          <chart-water style="height: 300px;" :lineKey="lineKey" :lineValue="lineValue"/>
      </Card>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { daterange, getDate }  from '@/libs/tools'
import { ChartWater } from '_c/charts/'
export default {
  name: 'waterContent',
  props: {
    waterModal: {
      type: Boolean,
      default: false
    },
    deviceId: String,
    actionUrl: String
  },
  components: {
    ChartWater
  },
  data() {
    return {
      lineKey: [],
      lineValue: [],
      selectTime: daterange(6),
      options: {
        shortcuts: [
          {
            text: '1周',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: '1个月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: '3个月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      }
    }
  },
  computed: {
    modal: {
      get() {
        return this.waterModal
      },
      set() {}
    },
    ...mapState({
      token: state => state.user.token
    })
  },
  watch: {
    selectTime: {
      handler(val) {
        this.deviceWater()
      },
      // immediate: true
    },
    deviceId: {
      handler(val) {
        if(this.waterModal) {
          this.deviceWater()
        }
      }
    }
  },
  methods: {
    ...mapActions(['getDeviceWater']),
    stateChange (val) {
      if (!val) {
        this.closeModal()
      }
    },
    closeModal () {
      this.selectTime = daterange(6)
      this.$emit('waterChangeState',false)
    },
    timeChange (val) {
      this.selectTime = val
    },
    deviceWater () {
      this.getDeviceWater({selectTime: this.selectTime, device_id: this.deviceId}).then(res => {
        console.log(res)
        var lineKey = []
        var lineValue = []
        if (res != null) {
           _(res).forEach(function(value) {
            console.log(value);
            lineValue.push(value.water_yield)
            lineKey.push(getDate(value.record_time,'month-date'))
          });
        }  
        this.lineKey = lineKey
        this.lineValue = lineValue    
      })
    }
  }
}
</script>