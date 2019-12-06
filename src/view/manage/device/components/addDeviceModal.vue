
<template>
  <Modal
    v-model="modal"
    title="添加设备"
    :mask-closable="false"
    @on-visible-change="changeState">
    <Form
      :model="modalForm"
      :label-width="80"
      ref="modalForm"
      :rules="ruleValidate"
      @keydown.enter.native="handleSubmit"
    >
      <FormItem label="所属公司" prop="company_id">
        <Select v-model="modalForm.company_id" style="width:200px">
          <Option v-for="item in companyList" :value="item.Id" :key="item.Id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="设备号" prop="device_id">
        <Input type="text" v-model="modalForm.device_id" placeholder="输入设备号"></Input>
      </FormItem>    
      <FormItem label="地址" prop="address">
        <Input type="text" v-model="modalForm.address" placeholder="输入地址"></Input>
      </FormItem>
      <FormItem label="开水阈值" prop="value">
        <Input type="text" v-model="modalForm.value" placeholder="输入开水阀值" number></Input>
      </FormItem>     
    </Form>
    <div slot="footer">      
      <Button @click="closeBtn">取消</Button>
      <Button type="primary" @click="handleSubmit('modalForm')">提交</Button>
    </div>
  </Modal>
</template>
<script>
import { mapActions} from 'vuex'
export default {
  name: "AddDevice",
  props: {
    addModal: {
      type: Boolean,
      default: false
    },
    companyList: Array
  },
  data () {
    const validateValue = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if ( _.isNumber(value) && value > 0) {
        callback();
      } else {
        callback(new Error('请输入正确阀值'));
      }
      
    };
    return {
      modalForm: {
        address: '',
        value: 0.5,
        device_id: '',
        company_id: ''
      },
      ruleValidate: {
        device_id: [
          { required: true, message: '设备号不能为空', trigger: 'blur' }
        ],
        company_id: [
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
        return this.addModal
      },
      set() {}
    }
  },
  methods: {
    ...mapActions(['addDevice']),
    changeState (val) {
      // console.log(val)
      if (!val) {
        this.$refs.modalForm.resetFields()
        this.$emit('addStateChange', false)
      }
    },
    closeBtn () {
      this.modal = false
      this.changeState(false)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var copy = JSON.parse(JSON.stringify(this.modalForm))
          if (copy.value === '') {
            copy.value = 0
          }
          this.addDevice(copy).then(res => {
            if (res.status === 0) {
              this.$Message.success({
                content: '新增成功',
                duration: 3
              })
              this.modal = false
              this.$emit('addStateChange',false, true)
              this.$refs.modalForm.resetFields()
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
  }
}
</script>