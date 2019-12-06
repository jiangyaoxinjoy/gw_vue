<template>
  <Modal
    v-model="editshow"
    title="编辑人员信息"
    :mask-closable="false"
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
            <Select disabled v-model="modalForm.company_id">
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
            <Radio  :label="-1" :disabled="userId == modalForm.id">禁用</Radio>
            <Radio :label="1">使用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handlerClose">取消</Button>
        <Button type="primary" @click="handleSubmit">提交</Button>
      </div>
  </Modal>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'editModal',
  props: {
    modal: Boolean,
    originData: Object
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (!(/^1[345678]\d{9}$/.test(value))) {
        callback(new Error('手机号码有误，请重填'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (!(/^[0-9a-zA-Z]+$/.test(value))) {
          callback(new Error('你输入的字符不是数字或者字母'))
        }
        callback()
      }
    }
    return {
      modalForm: {
        id: '',
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
        phone: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          {
            validator: validatePhone, trigger: 'blur'
          }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' }
        ],
        authority: [
          { required: true, type: 'array', message: '请选择权限', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    editshow: {
      get () {
        return this.modal
      },
      set () {}
    },
    ...mapState({
        companyList: state => state.user.companyList,
        authList: state => state.user.authList,
        userId: state => state.user.userId
    }),
    newForm () {
      let row = this.originData
      let data = {}
      data.id = row.Id
      data.name = row.name
      data.phone = row.phone
      data.company_id = row.company_id
      data.status = row.status
      data.real_name = row.real_name
      let authlist = row.auth_ids.split(',')
      data.authority = authlist.map(Number)
      return JSON.parse(JSON.stringify(data))
    }
  },
  watch: {
    newForm: {
      handler (val) {
        this.modalForm = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeState (val) {
      this.$emit('State', val)
    },
    handleSubmit () {
      // console.log('33')
      this.$refs.modalForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.modalForm)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handlerClose () {
      this.editshow = false
      this.$emit('State', false)
    }
  }
}
</script>
