<template>
  <Layout>
    <Sider hide-trigger width="220">
      <div class="device_title"><Icon type="ios-list" :size="28"/>设备管理</div>
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
            <Radio :label="2">离线</Radio>
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
      <form  target="deviceexport" :action="url +'deviceexport'" method="post" class="exportBtn">
        <input type="text" hidden name="token" :value="token"/>
        <input type="text" hidden name="deviceIds" :value="deviceIdstring"/>
        <Button icon="ios-download-outline" type="primary" :disabled="disabledExport" long html-type="submit">导出到Excel</Button>
      </form>
      <iframe name="deviceexport" id="deviceexport" style="display:none"></iframe>
      <Button type="primary" long class="exportBtn" @click="backupModal = true">一键备份</Button>
      <Button type="primary" long @click="restoreModal = true">一键还原</Button>
    </Sider>
    <Content :style="{height: tableHeight +'px'}">
      <router-view></router-view>
    </Content>
    <Modal
      v-model="restoreModal"
      title="设备还原"
      :mask-closable="false"
      :width="350"
      @on-visible-change="restoreVisibleChange">
      <Form
        ref="restoreForm"
        :model="restoreForm"
        :label-width="70">
        <FormItem class="fileWrap" label="输入密码" prop="password">
          <Input autocomplete="new-password" v-model="restoreForm.password" type="password" v-show="false"></Input>
          <Input autocomplete="new-password" clearable type="password" v-model="restoreForm.password" placeholder="输入原始密码..."></Input>
        </FormItem>
        <FormItem class="fileWrap" label="选择文件" prop="file">
          <Upload
            ref="upload"
            class="tbHBtn"
            accept = ".xlsx"
            :action="url +'deviceimport'"
            :show-upload-list="false"
            :before-upload="handleUpload">
            <Button type="primary" icon="ios-cloud-upload-outline">导入文件</Button>
          </Upload>
          <p class="upLoadname" v-if="restoreForm.file !== '' && restoreForm.file !== null">Upload file: {{ restoreForm.file.name }} </p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="restoreModal = false" type="default">取消</Button>
        <Button
          type="warning"
          @click="uploadRestore"
          :loading="uploadLoadingStatus">
          {{ uploadLoadingStatus ? 'Uploading' : '确定' }}
        </Button>
      </div>
    </Modal>
    <Modal
      v-model="backupModal"
      title="设备备份"
      :mask-closable="false"
      :width="350"
      @on-visible-change="backupVisibleChange"
      footer-hide="true">
      <form target="devicebackup" :action="url +'devicebackup'" method="post" class="exportBtn">
        <Form :label-width="70">
          <FormItem class="fileWrap" label="输入密码" prop="password">
            <Input autocomplete="new-password" v-model="backupForm.password" type="password" v-show="false"></Input>
            <Input autocomplete="new-password" clearable type="password" v-model="backupForm.password" placeholder="输入原始密码..."></Input>
          </FormItem>
        </Form>   
        <input type="text" hidden name="password" v-model="backupForm.password"/>
        <input type="text" hidden name="token" :value="token"/>   
        <div class="backupFooter">
          <Button @click="backupModal = false" type="default">取消</Button>
          <Button type="primary" html-type="submit">一键备份</Button>
        </div>
      </form>
       <iframe name="devicebackup" id="devicebackup" style="display:none"></iframe>
    </Modal>
  </Layout>
</template>
<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { Companyselect } from '_c/input/index'
import { deviceRestore,devicebackup } from '../../../api/user.js'
export default {
  components: {
    Companyselect
  },
  data () {
    return {
      addressTemp: '',
      addkeys: '',
      disabledExport: true,
      restoreModal: false,
      restoreForm: {
        file: '',
        password: '',
        passwordInputType: 'text'
      },
      uploadLoadingStatus: false,
      backupModal: false,
      backupForm: {
        password: ''
      },
      backupLoadingStatus: false
    }
  },
  computed: {
    ...mapState({
      url: state => state.user.baseUrl,
      companyList: state => state.user.companyList,
      token: state => state.user.token,
      tableHeight: state => state.user.windowH - 60,
      comId: state => state.user.comId,
      deviceIdstring: state => state.device.deviceIds
    }),
    ...mapGetters([
      'deviceParams'
    ])
  },
  watch: {
    deviceIdstring(val) {
      if (val != '') {
        this.disabledExport = false
      } else {
        this.disabledExport = true
      }
    }
  },
  mounted () {
    var _this = this
    const iframe = document.querySelector('#devicebackup')
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function (e) {
        let res = JSON.parse(iframe.contentWindow.document.body.innerText)
        if( res.status != 0) {
          _this.$Message.error(res.msg)
        }
      })
    } else {
      iframe.onload = function (e) {
        let res = JSON.parse(iframe.contentWindow.document.body.innerText)
        if( res.status != 0) {
          _this.$Message.error(res.msg)
        }
      }
    }
    const iframe2 = document.querySelector('#deviceexport')
    // 处理兼容行问题
    if (iframe2.attachEvent) {
      iframe2.attachEvent('onload', function (e) {
        let res = JSON.parse(iframe2.contentWindow.document.body.innerText)
        if( res.status != 0) {
          _this.$Message.error(res.msg)
        }
      })
    } else {
      iframe2.onload = function (e) {
        let res = JSON.parse(iframe2.contentWindow.document.body.innerText)
        if( res.status != 0) {
          _this.$Message.error(res.msg)
        }
      }
    }
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
    if (this.$store.state.user.comId === 1) {
      deviceStatusParams.companyId = 0
    } else {
      deviceStatusParams.companyId = this.$store.state.user.comId
    }  
    this.$store.commit('setDeviceParams',deviceStatusParams)
  },
  created () {
    if (this.companyList.length === 0) {
      this.getCompanyList()
    }
  },
  methods: {
    ...mapActions(['getCompanyList', 'deviceList', 'exportDeviceList','devicebackup']),
    ...mapMutations(['setDeviceParams','setDeviceIds','SetSelectedDeviceReset','setRreshDevice']),
    deviceRestore,
    devicebackup,
    downloadFile:function(fileName) {
      window.open(this.url + "/exportfolder/" + fileName);
    },
    handleUpload (file) {
      this.restoreForm.file = file
      return false
    },
    uploadBackup() {
      this.backupLoadingStatus = true
      if (this.backupForm.password === '') {
        this.$Message.error({
            content: '请输入密码',
            duration: 5,
            closable: true
        });
        this.backupLoadingStatus = false
        return false
      }
      this.devicebackup(this.backupForm).then(res => {
        this.$Message.success({
            content: '完成',
            duration: 3
          })
        this.backupLoadingStatus = false
        this.backupModal = false
      }).catch( err => {
        this.backupLoadingStatus = false
        this.$Message.error(err)
      })
    },
    uploadRestore() {
      this.uploadLoadingStatus = true
      if (this.restoreForm.file === '') {
        this.$Message.error({
            content: '未选择还原文件',
            duration: 5,
            closable: true
        });
        this.uploadLoadingStatus = false
        return false
      }
      if (this.restoreForm.password === '') {
        this.$Message.error({
            content: '请输入密码',
            duration: 5,
            closable: true
        });
        this.uploadLoadingStatus = false
        return false
      }
      let formdata = new FormData()
      formdata.append('file', this.restoreForm.file)
      formdata.append('token', this.token)
      formdata.append('password', this.restoreForm.password)
      this.deviceRestore(formdata).then(res => {
        if (res.data.status !== 0) {
          this.$Message.error(res.data.msg)
        } else {
          this.$Message.success({
            content: '完成',
            duration: 3
          })
          this.restoreModal = false
          this.disabledExport = true
          this.setRreshDevice(true)
        } 
        this.uploadLoadingStatus = false    
      }).catch( err => {
        this.uploadLoadingStatus = false
        this.$Message.error(err)
      })
    },
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
      this.disabledExport = true
      if (this.comId === 1) {
        this.deviceParams.companyId = 0
      } else {
        this.deviceParams.companyId = this.comId
      }  
      this.deviceParams.online_state = 0
      this.deviceParams.addkeys = ""
      this.deviceParams.pageNum = 1
      this.addkeys = ''
      this.deviceParams.status = 3
      this.queryData()
      this.SetSelectedDeviceReset(true)
      // this.setDeviceIds("")
    },
    //地址清空
    handleClear (e) {
      if (e.target.value === '') {
        this.deviceParams.addkeys = ''
        this.queryData()
      }
    },
    backupVisibleChange(val) {
     if(val) {
      this.backupForm.password = ''
     }
    },
    restoreVisibleChange(val) {
      if(val) {
        this.$refs['restoreForm'].resetFields();
      }
    }
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
