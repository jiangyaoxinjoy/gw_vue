<template>
<div>
  <Table
    :columns="columns"
    :data="companyList"
    highlight-row
    ref="currentRowTable"
    :height="tableHeight"
  >
    <template slot="header">
      <Button v-if="comId == 1" class="tbHBtn" type="primary" icon="md-add-circle" @click="handleAddCompany">
        <span>添加公司</span>
      </Button>
    </template>
    <template slot-scope="{ row, index }" slot="action" v-if="comId == 1">
      <!-- <Button class="tBtn" type="error" size="small" @click="handleCurrenRow(row)">修改</Button> -->
      <div style="cursor: pointer" @click="handleCurrenRow(row)">
        <Tooltip content="修改" placement="top">
            <Icons type="xiugai" color="#9fa19f" :size="18" />
        </Tooltip>
      </div>
    </template>
  </Table>
  <Modal
    v-model="modal"
    :title="modalState == 'new' ? '新增公司' : '修改公司信息'"
    :footer-hide="true"
    @on-visible-change="changeState"
    :mask-closable="false"
  >
      <Form
        :model="modalForm"
        :label-width="100"
        ref="modalForm"
        :rules="ruleValidate"
      >
        <FormItem label="公司名称" prop="name">
          <Input v-model="modalForm.name" placeholder="输入公司名称"></Input>
        </FormItem>
        <FormItem label="系统名称" prop="system_name">
          <Input v-model="modalForm.system_name" placeholder="输入系统名称"></Input>
        </FormItem>
        <FormItem label="公司地址" prop="address">
          <Input v-model="modalForm.address" placeholder="输入公司地址"></Input>
        </FormItem>
        <FormItem label="最低阀值" prop="value1">
          <Input v-model="modalForm.value1" placeholder="输入最低阀值" number></Input>
        </FormItem>
        <FormItem label="最高阀值" prop="value2">
          <Input v-model="modalForm.value2" placeholder="输入最高阀值" number></Input>
        </FormItem>
        <FormItem label="设置图标">
          <Upload
            ref="upload"
            class="tbHBtn"
            accept = "image/*"
            :action="url +'iconUpload'"
            :show-upload-list="false"
            :before-upload="handleUpload"
          >
            <Button type="primary" size="small" icon="ios-cloud-upload-outline">上传图标</Button>
            <span class="imgTip">请选择小于256KB大小的图片</span>
          </Upload>
          <div class="upLoadname" v-if="modalForm.imgFile !== '' && modalForm.imgFile !== null">Upload file: {{ modalForm.imgFile.name }} </div>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('modalForm')">提交</Button>
            <Button v-if="modalState == 'new'" @click="handleReset('modalForm')" style="margin-left: 8px">重置</Button>
            <Button v-if="modalState == 'edit'" @click="handleClose('modalForm')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
  </Modal>
</div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Icons from '_c/icons'
export default {
  components: {
    Icons
  },
  data () {
    const validateV1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('阀值不能为空'))
      } else if (value >= this.modalForm.value2 && this.modalForm.value2 != '') {
        callback(new Error('数值不能比最高阀值高'))
      } else {
        callback()
      }      
    }
    const validateV2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('阀值不能为空'))
      } if (value <= this.modalForm.value1) {
        callback(new Error('数值不能比最低阀值低'))
      }else {
        callback()
      }      
    }
    return {
      modal: false,
      pageSize: 10,
      modalForm: {
        name: '',
        address: '',
        value1: '',
        value2: '',
        imgFile: '',
        system_name: '管威智慧云平台'
      },
      curId: '',
      modalState: '',
      ruleValidate: {
        name: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' },
        ],
        system_name: [
          { required: true, message: '系统名称不能为空', trigger: 'blur' },
        ],
        address: [{ required: true, message: '公司地址不能为空', trigger: 'blur' }],
        value1: [
          // { required: true, message: '阀值不能为空', trigger: 'change' },
          { validator: validateV1, trigger: 'change'}
        ],
        value2: [
          // { required: true, message: '阀值不能为空', trigger: 'change' },
          { validator: validateV2, trigger: 'change'}
        ],
      },
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '公司地址',
          key: 'address',
          minWidth: 180
        },
        {
          title: '水压阀值1',
          key: 'value1',
          minWidth: 60
        },
        {
          title: '水压阀值2',
          key: 'value2',
          minWidth: 60
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 180,
          align: 'center'
        }
      ],
      selectCompany: '',
      cropper: false
    }
  },
  computed: {
    ...mapState({
      companyList: state => state.user.companyList,
      tableHeight: state => state.user.windowH - 60,
      comId: state => state.user.comId,
      url: state => state.user.baseUrl,
      token: state => state.user.token
    })
  },
  created () {
    this.initPage()
  },
  methods: {
    ...mapActions(['getCompanyList', 'addCom', 'editCom', 'getUserInfo']),
    handleCurrenRow (row) {
      this.modalState = 'edit'
      this.modalForm.name = row.name
      this.modalForm.address = row.address
      this.modalForm.value1 = row.value1
      this.modalForm.value2 = row.value2
      this.modalForm.imgFile = ''
      this.modalForm.system_name = row.system_name
      this.curId = row.Id
      this.modal = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formdata = new FormData()
          formdata.append('file', this.modalForm.imgFile)
          formdata.append('value1', this.modalForm.value1)
          formdata.append('value2', this.modalForm.value2)
          formdata.append('address', this.modalForm.address)
          formdata.append('name', this.modalForm.name)
          formdata.append('system_name', this.modalForm.system_name)
          formdata.append('token', this.token)

          if (this.modalState === 'new') {           
            this.addCom(formdata).then(res => {
              if (res.status !== 0) {
                this.$Message.error(res.msg)
              } else {
                this.getCompanyList()
                this.$Message.success('新增成功!')
                this.modal = false
              }
            })
          } else if (this.modalState === 'edit') {
            formdata.append('id', this.curId)
            this.editCom(formdata).then(res => {
              // console.log(res)
              if (res.status !== 0) {
                this.$Message.error(res.msg)
              } else {
                this.getCompanyList()
                this.$Message.success('修改成功!')
                this.modal = false
                if (this.curId === this.comId) {
                  this.getUserInfo()
                }
              }
            })
          }
        } else {
          // this.$Message.error('失败!');
        }
      })
    },
    changeState (val) {
      if (!val) {
        this.modalForm.imgFile = ''
        this.$refs.modalForm.resetFields()
      }
    },
    handleReset (name) {
      this.modalForm.imgFile = ''
      this.$refs.modalForm.resetFields()
    },
    handleAddCompany () {
      this.modalState = 'new'
      this.modal = true
    },
    initPage () {
      if (this.companyList.length === 0) {
        this.getCompanyList()
      }
    },
    handleUpload (file) {
      this.modalForm.imgFile = file
      return false
    },
    handleClose () {
      this.modal = false
      this.changeState(false)
    }
  }
}
</script>
<style lang="less" scoped>
.imgTip {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}
.upLoadname{
  position: absolute;
  bottom: -24px;
  left: 10px;
}
</style>
