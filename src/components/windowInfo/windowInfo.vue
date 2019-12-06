<template>
  <div class="info">
    <NotifyModal :notifyModal="notifyModal" :userAllNotify="userAllNotify" @stateChange="notifyModalChange"/>
    <IndexHistoryModal v-if="history" :modalShow="historyModal" :deviceId="alarmInfo.deviceId" @hideModal="historyModal = false" :alarmType="alarmInfo.alarm_type"/>
    <div style="background-color: #eee;padding: 5px; position: relative;">
      <div class="ivu-card ivu-card-bordered">
        <div class="ivu-card-head">
          <div class="card_title">
            <i v-if="alarmInfo.alarm_type === '10'" class="card_icon iconfont icon-shuiyaxiaxian" slot="icon" style="font-size: 45px; color: rgb(92, 107, 119);"></i>
            <i v-if="alarmInfo.alarm_type === '20'" class="card_icon iconfont icon-famen" slot="icon" style="font-size: 40px; padding: 0 15px 0 10px; color: rgb(92, 107, 119);"></i>
            <i v-if="alarmInfo.alarm_type === '30'" class="card_icon iconfont icon--FireHydrant" slot="icon" style="font-size: 45px; color: rgb(92, 107, 119); padding: 0 10px"></i>
            <i v-if="alarmInfo.alarm_type === '70'" class="card_icon iconfont icon-shebeiyichang" slot="icon" style="font-size: 45px; color: rgb(92, 107, 119); padding: 0 10px"></i>
            <div>
              {{alarmInfo.alarm_type | alarmTypeFilter}}
              <div class="tag ivu-tag ivu-tag-default ivu-tag-border ivu-tag-checked">
                <span v-if="alarmInfo.isnotify === 1" class="ivu-tag-text ivu-tag-color-default">
                  已有通知到达
                </span> 
                <span v-if="alarmInfo.isnotify === 0" class="ivu-tag-text ivu-tag-color-default">
                 有通知未到达
                </span> 
              </div>
              <br>
              <span class="extra_line">{{alarmText}}</span>
            </div>
          </div>
        </div> 
        <div class="ivu-card-extra">
          <p>{{alarmInfo.send_time | timeFilter}}</p>
        </div> 
        <div class="ivu-card-body">
          <div class="divider ivu-divider ivu-divider-horizontal ivu-divider-default ivu-divider-with-text-left">
            <span class="ivu-divider-inner-text">地址</span>
          </div>
          <p>{{alarmInfo.address}} <span v-if="alarmInfo.descrip" class="rowDescrip">({{alarmInfo.descrip}})</span></p>
          <div class="ivu-cell cell-contact" @click="showcell">
            <div class="ivu-cell-item">
              <div class="ivu-cell-main">
                <div class="ivu-cell-title">联系人和联系方式</div> 
              </div> 
            </div>
            <div class="ivu-cell-arrow cell-arrow" :class="hidecell ? 'active' : ''">
              <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
            </div>
          </div>
          <div v-if="alarmInfo.teles === null && hidecell" style="color: #515a6e;">暂无联系人</div>
          <div v-show="hidecell" class="ivu-cell-group" v-for="item in alarmInfo.teles" :key="item.Id">
            <div class="ivu-cell">
              <div class="ivu-cell-link">
                <div class="ivu-cell-item">
                  <div class="ivu-cell-icon"></div> 
                  <div class="ivu-cell-main">
                    <div class="ivu-cell-title">{{item.real_name}}</div> 
                  </div> 
                  <div class="ivu-cell-footer">
                    <span class="ivu-cell-extra">{{item.phone}}</span>
                  </div>
                </div>
              </div> 
            </div>
          </div>
          <button 
          v-if="(alarmInfo.alarm_type == '10' || alarmInfo.alarm_type == '20') && history" type="button" 
          @click="historyBtnClick" 
          class="history_btn ivu-btn ivu-btn-warning ivu-btn-long">
            <span>
              {{historyModal ? '关闭' : '显示'}}{{alarmInfo.alarm_type | alarmHistory}}
            </span>
          </button>
          <!-- notify start -->
          <div class="step_wrap">
            <div class="step_block" v-for="item in alarmInfo.notify_infos" :key="item.name" v-if="item.data != null">
              <p>
                <div class="ivu-tag ivu-tag-orange ivu-tag-checked">
                  <span class="ivu-tag-text">{{item.name}}</span>
                </div>
                <span class="tel">{{item.phone}}</span>
              </p>
              <div v-for="notify in item.data" :key="notify.Id">
                <div class="ivu-steps ivu-steps-horizontal ivu-steps-small">
                  <div class="stepitem ivu-steps-item ivu-steps-status-finish" style="width: 33.3333%;">
                    <div class="ivu-steps-tail"><i></i>
                    </div> 
                    <div class="ivu-steps-head">
                      <div class="ivu-steps-head-inner">
                        <span class="ivu-steps-icon ivu-icon ivu-icon-ios-checkmark"></span>
                      </div>
                    </div> 
                    <div class="ivu-steps-main">
                      <div class="ivu-steps-title">{{notify.sendtime | time}}</div>
                    </div>
                  </div>
                  <div class="stepitem ivu-steps-item ivu-steps-status-finish" style="width: 33.3333%;">
                    <div class="ivu-steps-tail">
                      <i></i></div> 
                      <div class="ivu-steps-head">
                        <div class="ivu-steps-head-inner">
                          <span class="ivu-steps-icon ivu-icon ivu-icon-ios-checkmark"></span>
                        </div>
                      </div> 
                      <div class="ivu-steps-main">
                        <div class="ivu-steps-title">{{notify.type | notifyTypeMethod}}</div> 
                      </div>
                    </div>
                    <div v-if="notify.state == 1"  class="stepitem ivu-steps-item ivu-steps-status-finish" style="width: 33.3333%;">
                      <div class="ivu-steps-tail"><i></i>
                      </div> 
                      <div class="ivu-steps-head">
                        <div class="ivu-steps-head-inner">
                          <span class="ivu-steps-icon ivu-icon ivu-icon-ios-checkmark"></span>
                        </div>
                      </div> 
                      <div class="ivu-steps-main">
                        <div class="ivu-steps-title">{{[notify.receivetime, notify.state] | stateFilter}}</div> 
                      </div>
                    </div>
                    <div v-if="notify.state == 0"  class="stepitem ivu-steps-item ivu-steps-status-error" style="width: 33.3333%;">
                      <div class="ivu-steps-tail"><i></i>
                      </div> 
                      <div class="ivu-steps-head">
                        <div class="ivu-steps-head-inner">
                          <span class="ivu-steps-icon ivu-icon ivu-icon-ios-close"></span>
                        </div>
                      </div> 
                      <div class="ivu-steps-main">
                        <div class="ivu-steps-title">{{[notify.receivetime, notify.state] | stateFilter}}</div> 
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" @click="allNotify(item)" class="step_btn ivu-btn ivu-btn-default ivu-btn-long">
                  <span>查看全部</span>
                </button>
              </div>
            </div>
          </div> 
          <!-- notify end -->
        </div>
      </div>
    </div>
  </div> 
</template>
<script>
import { getDeviceAlertInfo } from '@/api/user'
import { getToken } from '@/libs/util'
import { NotifyModal, IndexHistoryModal} from "_c/modal/index.js"

export default {
  name: 'WindowInfo',
  components: {
    NotifyModal,
    IndexHistoryModal
  },
  data() {
    return {
      history: true,
      alarmInfo:'',
      hidecell: false,
      historyModal: false,
      notifyModal: false,
      token: getToken(),
      userAllNotify: {
        user_id: "",
        device_id:'',
        tel:'',
        name:'',
        alert_id: ''
      }
    }
  },
  computed: {
    alarmText () {
      let val = this.alarmInfo.alarm_type
      let text = ''
      switch (val) {
        case '10':
          let cola = this.alarmInfo.cola === -1 ? 0 : this.alarmInfo.cola
          text = '水压' + cola + 'Mpa 阈值 ' + this.alarmInfo.value1 + '~' + this.alarmInfo.value2
          break
        case '20':
          text = '阀门打开' + this.alarmInfo.cola + '圈, 出水量约 '+this.alarmInfo.cold.toFixed(2)+' 吨'
          break
        case '30':
          text = ''
          break
        case '70':
          text = ''
          break
        default:
          text = ''
          break
      }
      return text
    }
  },
  methods: {
    showcell () {
      this.hidecell = !this.hidecell
    },
    allNotify (item) {
      this.userAllNotify.device_id = item.data[0].device_id
      this.userAllNotify.user_id = item.data[0].user_id
      this.userAllNotify.name = item.name
      this.userAllNotify.tel = item.phone
      this.userAllNotify.alert_id = item.data[0].alert_id
      this.notifyModal = true
    },
    notifyModalChange (val) {
      this.notifyModal = val
    },
    historyBtnClick () {
      this.historyModal = !this.historyModal
    }
  },
}
</script>
<style lang="less" scoped>
@import "./windowInfo.less";
</style>