<template>
  <Modal
    v-model="modal"
    title="修改设备信息"
    :mask-closable="false"
    @on-visible-change="closeEditModal"
    class-name="vertical-center-modal"
    width="90%"
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
    <Row :gutter="8">
        <Col span="8">
             <FormItem label="设备号" prop="device_id">
          <Input v-model="mapItem.device_id" placeholder="输入设备号"></Input>
      </FormItem>
        </Col>
        <Col span="8">
            <FormItem label="所属公司" prop="company_id">
        <Select v-model="mapItem.company_id">
          <Option v-for="item in companyList" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
        </Select>
      </FormItem>
        </Col>
        <Col span="8">
            <FormItem label="开水阈值" prop="value">
        <Input type="text" v-model="mapItem.threshold" placeholder="输入开水阀值" number></Input>
      </FormItem>
        </Col>
    </Row>
    <Row :gutter="8">
        <Col span="12">
             <FormItem label="地址" v-if="ifSetup">
        <Input 
          v-model="mapItem.address" 
          placeholder="输入地址"
          @on-change="geocoder"
        ></Input>
      </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="备注" v-if="ifSetup">
            <Input 
              v-model="mapItem.descrip" 
              placeholder="输入地址"
            ></Input>
          </FormItem>
        </Col>
    </Row>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <baidu-map
        :ak="mapAk"
        class="map"
        :center="center"
        :zoom="18"
        :scroll-wheel-zoom="true"
        @ready="map_handler"
        style="display: flex; flex-direction: column"
        v-if="ifSetup"
      >       
        <bm-view style="width: 100%; height:350px;">
        </bm-view>
        <bm-marker
          :position="center"
          :dragging="true"
          :auto-resize="true"
          @dragend="showPosition">
        </bm-marker>
      </baidu-map>
    </Form>
    <div slot="footer">
      <Button @click="closeEditModal(false)">取消</Button>
      <Button :disabled="!canSubmit" type="primary" @click="handleSubmit('mapItem')">修改</Button>
    </div>
  </Modal>
</template>
<script>
import { mapActions, mapState} from 'vuex'
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
          lng: 0,
          lat: 0,
          device_id: '',
          company_id: '',
          threshold: '',
          descrip: ''
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
      spinShow: true,
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
      windowH: getClientHeight(),
      center: {lng: 0, lat: 0}
    }
  },
  computed: {
    ...mapState({
      mapAk: state => state.user.mapAk
    }),
    modal: {
      get() {
        return this.editModal
      },
      set() {}
    },
  },
  watch: {
    'mapItem.company_id' : {
      handler(val) {
        // console.log(val)
        if(val != '') {
          this.getUsers(val)
        }
      },
      immediate: true
    },
    'mapItem.lng' : {
      handler(val) {
        if(val != 0) {
          setTimeout( () => {
            this.center.lng = val 
            this.center.lat = this.mapItem.lat
          },500)
        }
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
        setTimeout( () => {
          this.spinShow = false
        },200)
      })
      // this.$nextTick(() => {
      //   var box = document.querySelector('.vertical-center-modal>.ivu-modal')
      //   var reg = /\d+/;
      //   let height= window.getComputedStyle(box).height.match(reg)[0]
      //   console.log(height)
      // })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.mapItem.lng = this.center.lng
          // this.mapItem.lat = this.center.lat
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
        this.center = {lng: 0, lat: 0}
        this.mapItem.address = ''
        this.mapItem.id = ''
        this.mapItem.lat = 0
        this.mapItem.lng = 0
        this.mapItem.device_id = ''
        this.mapItem.company_id = ''
        this.mapItem.threshold = ''
        this.mapItem.descrip= ''
        this.spinShow = true
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
  .notify_p {
    padding: 0 10px 10px 10px;
  }
  .notify_p span{
    margin-left: 10px;
  }
</style>