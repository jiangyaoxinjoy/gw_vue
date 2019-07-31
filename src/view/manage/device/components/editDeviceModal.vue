<template>
  <Modal
    v-model="modal"
    title="修改设备信息"
    :mask-closable="false"
    @on-visible-change="closeEditModal"
    :footer-hide="true"
    class-name="vertical-center-modal"
    :styles="{top: modalTop+'px'}"
  >
    <Divider orientation="left">通知用户</Divider>
    <p class="notify_p" v-for="item in users" :key="item.Id" >用户名：{{item.name}} <span>电话号码：{{item.phone}}</span></p>
    <Divider dashed />
    <Form
      :model="mapItem"
      :label-width="80"
      ref="mapItem"
      :rules="ruleValidate"
    >
      <FormItem label="设备号" prop="device_id">
          <Input v-model="mapItem.device_id" placeholder="输入设备号"></Input>
      </FormItem>
      <FormItem label="所属公司" prop="company_id">
        <Select v-model="mapItem.company_id" style="width:200px">
          <Option v-for="item in companyList" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="水压阀值" prop="value">
        <Input type="text" v-model="mapItem.threshold" placeholder="输入水压阀值" number></Input>
      </FormItem>
      <baidu-map
        class="map"
        :center="{lng: mapItem.lng,lat: mapItem.lat}"
        :zoom="18"
        :scroll-wheel-zoom="true"
        @ready="map_handler"
        style="display: flex; flex-direction: column"
        v-if="ifSetup"
      >
        <FormItem label="地址">
          <Input 
            v-model="mapItem.address" 
            placeholder="输入地址"
            @on-change="geocoder"
          ></Input>
        </FormItem>
        <bm-view style="width: 100%; height:350px; flex: 1">
        </bm-view>
        <bm-marker
          :position="{lng: mapItem.lng,lat: mapItem.lat}"
          :dragging="true"
          :auto-resize="true"
          @dragend="showPosition">
        </bm-marker>
      </baidu-map>
      <FormItem class="editmFooter">
        <Button @click="closeEditModal(false)">取消</Button>
        <Button :disabled="!canSubmit" type="primary" style="margin-left: 8px" @click="handleSubmit('mapItem')">修改</Button>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { mapActions} from 'vuex'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmView, BmMarker} from 'vue-baidu-map'
import { getClientHeight} from '@/libs/tools' 
export default {
  props: {
    editModal: {
      type: Boolean,
      default: false
    },
    companyList: Array,
    mapItem: {
      type: Object,
      default: () => {
        return {
          address: '',
          id: '',
          lng: '',
          lat: '',
          device_id: '',
          company_id: '',
          threshold: ''
        }
      }
    },
    ifSetup: Boolean
  },
  name: "EditDevice",
  components: {
    BaiduMap,
    BmView, 
    BmMarker,
  },
  data() {
    const validateValue = (rule, value, callback) => {
      if ( _.isNumber(value) && value > 0) {
        callback();
      } else {
        callback(new Error('请输入正确阀值'));
      }
    };
    return {   
      ruleValidate: {
        device_id: [
          { required: true, message: '设备号不能为空', trigger: 'blur' }
        ],
        company_id: [
          { required: true, type: 'number', message: '请选择公司', trigger: 'change' }
        ],
        threshold: [
          { validator: validateValue, trigger: 'blur' }
        ]
      },
      canSubmit: true,
      users: [],
      windowH: getClientHeight()
    }
  },
  computed: {
    modal: {
      get() {
        return this.editModal
      },
      set() {}
    },
    modalTop () {
      return (this.windowH - 850 > 0) ? (this.windowH - 850)/2 : 0
    }
  },
  watch: {
    'mapItem.company_id' : {
      handler(val) {
        // console.log(val)
        this.getUsers(val)
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['editDevice', 'getNotifyUsers']),
    getUsers (id) {
      this.getNotifyUsers({'company_id': id}).then( res => {
        // console.log(res)
        this.users = res
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.editDevice(this.mapItem).then(res => {
            if (res.status === 0) {
              this.$Message.success({
                content:'编辑成功',
                duration: 3
              })
              this.$refs[name].resetFields()
              this.modal = false
              this.closeEditModal(false, true)
            } else {
              if (res.msg.search("Error 1062") != -1) {               
                this.$Message.error({
                  content: "改设备已经存在",
                  duration: 3
                })
              }else {
                this.$Message.error({
                  content: res.msg,
                  duration: 3
                })
              }       
            }
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    closeEditModal(val, edit) {
      if (!val) {
        this.canSubmit = true
        this.$emit('editChangeState',val,edit)
      }
    },
    showPosition ({ type, target, pixel, point }) {
      var BMap = this.BMap
      var geoc = new BMap.Geocoder()
      this.mapItem.lng = String(point.lng)
      this.mapItem.lat = String(point.lat)
      var address = ''
      geoc.getLocation(point, (rs) => {
        var addComp = rs.addressComponents
        address = `${addComp.province}${addComp.city}${addComp.district}${addComp.street}${addComp.streetNumber}`
        // console.log(addComp)
        this.mapItem.address = address
      })
    },
    map_handler ({ BMap, map }) {
      this.BMap = BMap
    },
    geocoder () {
      this.BMap = BMap
      var myGeo = new BMap.Geocoder();
      myGeo.getPoint( this.mapItem.address, (point) => {
        console.log(point)
        if (point) {
          this.mapItem.lng = String(point.lng)
          this.mapItem.lat = String(point.lat)
          this.canSubmit = true
        } else {
          this.$Modal.warning({
            title: '错误提示',
            content: '<p>地址无法解析</p>',
          })
          this.canSubmit = false
        }
      })
    }
  }
}
</script>
<style type="text/css">
  .editmFooter .ivu-form-item-content{
    text-align: right;
  }
  .editmFooter{
    margin-top: 16px;
    margin-bottom: 8px;
  }
 /*  .editModal .ivu-form-item {
    margin-bottom: 18px;
  } */
  .notify_p {
    padding: 0 10px 10px 10px;
  }
  .notify_p span{
    margin-left: 10px;
  }
</style>