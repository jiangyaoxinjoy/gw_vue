<template>
  <Modal
    v-model="showModal"
    title="添加人员"
    :mask-closable="false"
    :footer-hide="true"
    @on-visible-change="changeState"
  >
      <Form :model="modalForm" :label-width="80" ref="modalForm" :rules="ruleValidate" @keydown.enter.native="handleSubmit">
        <FormItem label="昵称" prop="name">
            <Input v-model="modalForm.name" placeholder="输入昵称"></Input>
        </FormItem>
        <FormItem label="真实姓名" prop="real_name">
            <Input v-model="modalForm.real_name" placeholder="输入真实姓名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input v-model="modalForm.password" placeholder="输入密码"></Input>
        </FormItem>
        <FormItem label="电话号码" prop="phone">
            <Input v-model="modalForm.phone" placeholder="输入电话号码"></Input>
        </FormItem>
        <FormItem label="公司名称" prop="company_id">
            <Select v-model="modalForm.company_id">
                <Option v-for="item in companyList" :key="item.Id" :value="item.Id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="权限" prop="authority">
            <CheckboxGroup v-model="modalForm.authority">
              <Checkbox v-for="item in authList" :key="item.Id" :label="item.Id">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="是否禁用">
          <RadioGroup v-model="modalForm.status">
            <Radio  :label="-1" >禁用</Radio>
            <Radio :label="1">使用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('modalForm')">提交</Button>
          <Button style="margin-left: 8px" @click="handlerClose">取消</Button>
        </FormItem>
      </Form>
  </Modal>
</template>
<script>
export default {
  name: 'addModal',
  props: {
    modal: Boolean
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (!(/^[0-9a-zA-Z]+$/.test(value))) {
        callback(new Error('你输入的字符不是数字或者字母'))
      }
      callback()
    }
    const validatePhone = (rule, value, callback) => {
      if (!(/^1[345678]\d{9}$/.test(value))) {
        callback(new Error('手机号码有误，请重填'))
      }
      callback()
    }
    return {
      modalForm: {
        name: '',
        real_name: '',
        password: '',
        phone: '',
        company_id: '',
        authority: [],
        status: 1
      },
      ruleValidate: {
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
          // { min: 6, message: '密码不能少于6个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        company_id: [
          { required: true, type: 'number', message: '请选择公司', trigger: 'change' }
        ],
        authority: [
          { required: true, type: 'array', message: '请选择权限', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    modal (val) {
      if (!val) {
        this.$refs.modalForm.resetFields()
      }
    }
  },
  computed: {
    companyList () {
      return this.$store.state.user.companyList
    },
    authList () {
      return this.$store.state.user.authList
    },
    showModal: {
      get () {
        return this.modal
      },
      set () {

      }
    }
  },
  methods: {
    changeState (val) {
      this.$emit('addState', val)
    },
    handleSubmit () {
      this.$refs.modalForm.validate((valid) => {
        if (valid) {
          this.$emit('addSubmit', this.modalForm)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handlerClose () {
      this.showModal = false
      this.$emit('addState', false)
    }
  }
}
</script>
