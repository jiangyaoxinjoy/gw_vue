<template>
  <Modal
    v-model="show"
    class-name="notifyModal"
    :footer-hide="true"
    @on-visible-change="changeState"
    @loading="loading">
    <div slot="header" class="header">
      <h3> {{userAllNotify.name}} <span>{{userAllNotify.tel}}</span></h3>
    </div>
    <div class="content">
      <div class="wrap">
        <Steps
          v-for="notify in notifyData.list" 
          :key="notify.Id"
          :current="notify.state == 1 ? 3 : 2"
          :status="notify.state == 1 ? 'finish' : 'error'"
          size='small'
        >
          <Step class="stepitem" :title="notify.sendtime | time"></Step>
          <<Step class="stepitem" :title="notify.type | notifyTypeMethod"></Step>
          <Step class="stepitem" :title="[notify.receivetime, notify.state] | stateFilter"></Step>
        </Steps>
      </div>
    </div>
  </Modal>
</template>
<script>
import { getUserNotifyHistory } from '@/api/user'
import { getToken } from '@/libs/util'
export default {
  name: "NotifyModal",
  props: {
    notifyModal: Boolean,
    userAllNotify: Object
  },
  data () {
    return {
      show: false,
      token: getToken(),
      notifyData: {
        list: [],
        value: 1
      },
      loading: true
    }
  },
  watch: {
    notifyModal:{
      handler(val) {
        this.show = val
        if (val) {
          this.getData()
        }
      },
      immediate: true
    }
  },
  methods: {
    changeState (val) {
       this.$emit('stateChange', val)
    },
    getData () {
      getUserNotifyHistory({'device_id': this.userAllNotify.device_id, 'user_id': this.userAllNotify.user_id, 'token': this.token })
      .then(res => {
        // console.log(res)
        if (res.data.status === 0) {
          this.notifyData.list = res.data.data
          this.loading = false
        }
      })
    }
  }
}
</script>
<style type="text/css">
  .notifyModal .content {
    height: 450px;
    margin-left: 40px;
    overflow-y: auto;
  }
  .notifyModal .ivu-steps {
    margin-top: 5px;
  }
</style>