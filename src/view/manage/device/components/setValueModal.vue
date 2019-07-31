<template>
  <Modal v-model="modal" title="设置阀值" @on-visible-change="changeModalState"
    :footer-hide="true">
    <Form
      ref="form"
      :model="form"
      :label-width="70"
      :rules="ruleForm"
    >
      <FormItem label="水压阀值" prop="value">
        <Input type="text" v-model="form.value" placeholder="输入水压阀值..." number></Input>
      </FormItem>
      <FormItem class="footer">
        <Button @click="closeModal(false)">取消</Button>
        <Button type="primary" style="margin-left: 8px" @click="handleSubmit('form')">修改</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: 'ValueModal',
  props: {
    valueModal: {
      type: Boolean,
      default: false
    }
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
      modal: false,
      form: {
        value: ''
      },
      ruleForm: {
        value: [
          { validator: validateValue, trigger: 'blur' }
        ]
      },
    }
  },
  watch: {
    valueModal(val) {
      this.modal = val
    }
  },
  methods: {
    closeModal(val) {
      this.form.value = ''
      this.canSubmit = false
      this.$emit('closeModal', false)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.$Message.info('success!')
          this.$emit("getValue", this.form.value)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    changeModalState (val) {
      if (!val) {
        this.closeModal(val)
      }
    }
  }
}
</script>