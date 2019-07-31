<template>
<Modal
    v-model="modal"
    title="导入设备"
    :mask-closable="false"
    :footer-hide="true"
    :width="300"
    @on-visible-change="uploadModalChange">
    <Form
      ref="uploadForm"
      :model="uploadForm"
      :label-width="70"
      :rules="ruleUpload"
    >
      <FormItem label="选择公司" prop="companyId">
        <Select v-model="uploadForm.companyId" style="width:200px">
          <Option v-for="item in companyList" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="上传模式" prop="importType">
        <RadioGroup v-model="uploadForm.importType">
          <Radio :label="1">增量上传</Radio>
          <Radio :label="2">覆盖上传</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="水压阀值" prop="value">
        <Input type="text" v-model="uploadForm.value" placeholder="输入水压阀值" number></Input>
      </FormItem>
      <FormItem class="fileWrap" label="选择文件">
        <Upload
          ref="upload"
          class="tbHBtn"
          accept = ".xlsx"
          :action="url +'deviceimport'"
          :show-upload-list="false"
          :before-upload="handleUpload"
        >
          <Button type="primary" icon="ios-cloud-upload-outline">导入文件</Button>
        </Upload>
        <div class="upLoadname" v-if="uploadForm.file !== '' && uploadForm.file !== null">Upload file: {{ uploadForm.file.name }} </div>
      </FormItem>
      <FormItem class="footer">
        <Button
          v-if="uploadForm.file !== '' && uploadForm.file !== null"
          type="warning"
          @click="upload"
          :loading="uploadLoadingStatus"
        >
          {{ uploadLoadingStatus ? 'Uploading' : '点击上传' }}
        </Button>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import {mapActions, mapState } from 'vuex'
export default {
  name: 'importDevice',
  props: {
    uploadModal: {
      type: Boolean,
      default: false
    },
    companyList: Array,
  },
  data() {
    const validateValue = (rule, value, callback) => {
      if (value === '') {
        callback();
      }else if ( _.isNumber(value) && value > 0) {
        callback();
      } else {
        callback(new Error('请输入正确阀值'));
      }
    };
    return{
      uploadLoadingStatus: false,
      uploadForm: {
        file: '',
        importType: 1,
        companyId: '',
        value: 0.5
      },
      ruleUpload: {
        companyId: [
          { required: true, type: 'number', message: '请选择公司', trigger: 'change' }
        ],
        value: [
          { validator: validateValue, trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    modal: {
      get() {
        return this.uploadModal
      },
      set() {}
    },
    ...mapState({
      url: state => state.user.baseUrl,
      token: state => state.user.token
    })
  },
  methods: {
    ...mapActions(['importDevice']),
    uploadModalChange(val, upload) {
      if(!val) {
        this.$refs.uploadForm.resetFields()
        this.uploadForm.file = ''
        this.$emit("uploadChangeState", false, upload)
      }
    },
    upload () {
      this.uploadLoadingStatus = true
      this.$refs.uploadForm.validate((valid) => {
        if (valid) {
          let formdata = new FormData()
          formdata.append('file', this.uploadForm.file)
          formdata.append('companyId', this.uploadForm.companyId)
          formdata.append('importType', this.uploadForm.importType)
          formdata.append('token', this.token)
          formdata.append('value', this.uploadForm.value || 0)
          this.importDevice(formdata).then(res => {
            if (res.status !== 0) {
              this.$Message.error(res.msg)
            } else {
              if (this.uploadForm.importType === 1) {
                this.$Message.success({
                  content: `添加：${res.data}个设备`,
                  duration: 3
                })
              } else if (this.uploadForm.importType === 2) {
                this.$Message.success({
                  content: '覆盖添加：' + res.data + '个设备',
                  duration: 3
                })
              }
            }
            this.$refs.uploadForm.resetFields()
            this.uploadForm.file = ''
            this.uploadLoadingStatus = false
            this.modal = false
            this.uploadModalChange(false, true)
          })
        } else {
          this.uploadLoadingStatus = false
          this.$Message.error('Fail!')
        }
      })
    },
    handleUpload (file) {
      this.uploadForm.file = file
      return false
    },
  }
}
</script>