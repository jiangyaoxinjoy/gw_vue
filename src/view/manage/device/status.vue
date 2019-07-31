<template>
  <Layout>
    <Sider hide-trigger width="220">
      <Form label-position="top" class="sider_form">
        <FormItem label="公司">
          <Companyselect
          :width="220"
          :companyList="companyList"
          :selectCompany="deviceParams.companyId"
          @changeComId="comChange"/>
        </FormItem>
        <FormItem label="报警终端状态" class="radioGroup">
          <RadioGroup v-model="deviceParams.online_state" type="button" @on-change="onlineChange">
            <Radio :label="0">全部</Radio>
            <Radio :label="1">在线</Radio>
            <Radio :label="2">异常</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="安装" class="radioGroup">
          <Select v-model="deviceParams.status" placeholder="选择是否安装">
            <Option :value="3">全部</Option>
            <Option :value="1">未安装</Option>
            <Option :value="2">已安装</Option>
          </Select>
        </FormItem>
        <FormItem label="地址/设备号" class="addressSearch">
          <Input
            ref="addkey"
            @on-change="handleClear"
            placeholder="输入设备地址、设备号"
            class="search-input"
            @on-search="handleSearch"
            enter-button="搜索"
            search
            clearable
            v-model="addkeys"
            @keydown.enter.native.prevent="handleSearch"/>
          </FormItem>
        <FormItem class="exportBtn">
          <Button type="info" class="" @click="resetForm">重置</Button>
        </FormItem>
      </Form>
      <form :action="url +'deviceexport'" method="post">
        <input type="text" hidden name="addkeys" :value="deviceParams.addkeys" />
        <input type="text" hidden name="token" :value="token"/>
        <input type="text" hidden name="online_state" :value="deviceParams.online_state"/>
        <input type="text" hidden name="companyId" :value="deviceParams.companyId"/>
        <Button icon="ios-download-outline" type="primary" long html-type="submit">导出到Excel</Button>
      </form>
    </Sider>
    <Content :style="{height: tableHeight +'px'}">
     <!--  <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive> -->
      <router-view></router-view>
    </Content>
  </Layout>
</template>
<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { Companyselect } from '_c/input/index'
export default {
  components: {
    Companyselect
  },
  data () {
    return {
      addressTemp: '',
      addkeys: '',
    }
  },
  computed: {
    ...mapState({
      url: state => state.user.baseUrl,
      companyList: state => state.user.companyList,
      token: state => state.user.token,
      tableHeight: state => state.user.windowH - 60,
      comId: state => state.user.comId
    }),
    ...mapGetters([
      'deviceParams'
    ])
  },
  watch: {
    // selectStatus (val) {
    //   this.deviceParams.status = val
    //   this.queryData()
    // }
  },
  beforeCreate() {
   var deviceStatusParams = {
      companyId: 0,
      online_state: 0,
      addkeys: '',
      pageNum: 1,
      limit: 100,
      status: 3
    }
    deviceStatusParams.companyId = this.$store.state.user.comId
    this.$store.commit('setDeviceParams',deviceStatusParams)
  },
  created () {
    if (this.companyList.length === 0) {
      this.getCompanyList()
    }
  },
  methods: {
    ...mapActions(['getCompanyList', 'deviceList', 'exportDeviceList']),
    ...mapMutations(['setDeviceParams']),
    queryData () {
      this.deviceParams.pageNum = 1
      this.setDeviceParams(this.deviceParams)
    },
    //公司
    comChange (val) {
      // console.log(val)
      this.deviceParams.companyId = val
      this.queryData()
    },
    //报警终端状态
    onlineChange () {
      this.queryData()
    },
    //查询按钮
    handleSearch (e) {
      this.deviceParams.addkeys = e
      this.queryData()
    },
    setMapHide () {
      this.showMap = false
    },
    //重置
    resetForm () {
      this.deviceParams.companyId = this.comId
      this.deviceParams.online_state = 0
      this.deviceParams.addkeys = ""
      this.deviceParams.pageNum = 1
      this.addkeys = ''
      this.queryData()
    },
    //地址清空
    handleClear (e) {
      if (e.target.value === '') {
        this.deviceParams.addkeys = ''
        this.queryData()
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import './status.less';
</style>
<style type="text/css">
.ivu-modal-content{
  height: 100%;
}
.radioGroup .ivu-form-item-content .ivu-radio-group{
 display: flex;
}
.radioGroup .ivu-form-item-content .ivu-radio-group label {
  flex: 1;
  text-align: center;
}
.addressSearch .ivu-form-item-content{
  display: flex;
}
.exportBtn .ivu-form-item-content{
  display: flex;
  flex-direction: column;
}
.exportBtn button{
  flex: 1;
}
.sider_form .ivu-form-item-label{
  color: rgba(255,255,255,.8);
}
 .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
    height:100%;
    margin-top: -16px;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
    padding-bottom: 0px;
}

.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
}
.form_search button{
  width: 100%;
}
.addressSearch .ivu-input-icon-clear{
  right: 50px;
}
</style>
