<template>
  <Modal
    v-model="showModal"
    title="修改密码"
    :mask-closable="false"
    :footer-hide="true"
    @on-visible-change="model_change"
  >
    <Form :model="formItem" ref="formItem" :rules="ruleCustom"  :label-width="80">
      <input type="text" name="a" style="display: none"/>
      <input type="password" name="b" style="display: none"/>
      <!-- <FormItem>      
        <Input autocomplete="off" style="display: none" clearable type="text" v-model="formItem.a" placeholder="输入原始密码..."></Input>
      </FormItem>
      <FormItem>      
        <Input autocomplete="off" style="display: none" clearable type="password" v-model="formItem.b" placeholder="输入原始密码..."></Input>
      </FormItem> -->
      <FormItem label="原始密码" prop="originPwd">      
        <Input autocomplete="off" clearable type="password" v-model="formItem.originPwd" placeholder="输入原始密码..."></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPwd">   
        <Input autocomplete="off"  clearable type="password" v-model="formItem.newPwd" placeholder="输入新密码..."></Input>
      </FormItem>
      <FormItem label="确认密码" prop="againPwd">     
        <Input autocomplete="off" clearable type="password" v-model="formItem.againPwd" placeholder="再输入一遍新密码..."></Input>
      </FormItem>
      <FormItem>
        <Button  @click="close">取消</Button>
        <Button type="primary" style="margin-left: 8px" @click="handleSubmit('formItem')">提交</Button>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    modal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'))
      } else {
        // if (this.formCustom.passwdCheck !== '') {
        //   // 对第二个密码框单独验证
        //   this.$refs.formCustom.validateField('passwdCheck');
        // }
        callback()
      }
    }
    const validatenewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'))
      } else {
        // if (this.formCustom.againPwd !== '') {
        //   // 对第三个密码框单独验证
        //   this.$refs.formCustom.validateField('againPwd');
        // }
        callback()
      }
    }
    const validateagainPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'))
      } else if (value !== this.formItem.newPwd) {
        callback(new Error('The two input passwords do not match!'))
      } else {
        callback()
      }
    }
    return {
      formItem: {
        originPwd: '',
        newPwd: '',
        againPwd: '',
        a:'',
        b:''
      },
      ruleCustom: {
        originPwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPwd: [
          { validator: validatenewPwd, trigger: 'blur' }
        ],
        againPwd: [
          { validator: validateagainPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['changePsd']),
    model_change (val) {
      if( !val) {
       this.close()
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var data = {}
          data.originPwd = this.formItem.originPwd
          data.newPwd = this.formItem.newPwd
          data.againPwd = this.formItem.againPwd
          // {data.originPwd,data.newPwd,data.againPwd} = {...this.formItem}
          var payload = JSON.parse(JSON.stringify(data))
          payload.userId = this.$store.state.user.userId
          this.changePsd(payload).then(res => {
            if (res.status === 0) {
              this.$router.push({
                name: 'login'
              })
              this.$refs.formItem.resetFields();
              this.$Message.info('密码修改成功，请重新登录')
            }
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    close () {
      this.$refs.formItem.resetFields();
      this.$emit('changeModalState', false)
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modal
      },
      set () {}
    }
  }
}
</script>
